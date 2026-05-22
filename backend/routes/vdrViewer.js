// In-browser VDR doc viewer with:
//   - permission enforcement (role-based ACL via vdr_doc_permissions, page-level)
//   - server-side text watermark overlay metadata in the response
//   - view analytics (dwell time, page count, viewer identity)
//   - audit-log export (CSV)
//
// Endpoints (all under /api/vdr-viewer):
//   GET  /doc/:doc_id                  — fetch doc render payload (pages, watermark, ACL)
//   POST /doc/:doc_id/view             — log a view event (dwell_seconds, page_count)
//   GET  /analytics                    — aggregate view analytics across all docs (admin/advisor)
//   GET  /analytics/doc/:doc_id        — analytics for a single doc
//   GET  /audit-log/export?format=csv  — CSV export of audit_log (admin/advisor)
//   GET  /audit-log/export?format=pdf  — PDF-shaped text export (admin/advisor)

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../config/database');
const { requireWriter } = require('../middleware/auth');

// ─── helpers ───────────────────────────────────────────────

async function lookupPermission(doc_id, role) {
  const r = await pool.query(
    'SELECT * FROM vdr_doc_permissions WHERE doc_id = $1 AND role = $2 ORDER BY id DESC LIMIT 1',
    [doc_id, role]
  );
  if (r.rows.length) {
    const g = r.rows[0];
    return {
      can_view: g.can_view !== false,
      can_download: g.can_download === true,
      watermark_required: g.watermark_required !== false,
      page_range: { start: g.page_range_start || 1, end: g.page_range_end || null },
      source: 'explicit-grant',
    };
  }
  const isPrivileged = ['admin', 'advisor'].includes(role);
  return {
    can_view: isPrivileged,
    can_download: role === 'admin',
    watermark_required: true,
    page_range: { start: 1, end: null },
    source: 'implicit-default',
  };
}

function makeWatermark(doc_id, viewer_email, viewer_role) {
  const watermark_id = `wm_${crypto.randomBytes(6).toString('hex')}`;
  const stamp = new Date().toISOString();
  const overlay_text = `CONFIDENTIAL • ${viewer_email || 'unknown'} • ${viewer_role || 'viewer'} • ${stamp} • ${watermark_id}`;
  return { watermark_id, overlay_text, stamp };
}

// Synthetic page payload (no PDF storage in this app — we surface metadata only).
function synthesizePages(doc, pageRange) {
  const lastPage = pageRange.end || 12;
  const firstPage = pageRange.start || 1;
  const out = [];
  for (let p = firstPage; p <= lastPage; p++) {
    out.push({
      page: p,
      placeholder: `[page ${p} of ${doc.name || doc.doc_id || 'document'}]`,
    });
  }
  return out;
}

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// ─── endpoints ─────────────────────────────────────────────

// GET /api/vdr-viewer/doc/:doc_id
router.get('/doc/:doc_id', async (req, res) => {
  try {
    const docId = req.params.doc_id;
    const role = req.user?.role || 'viewer';

    const docRes = await pool.query(
      'SELECT * FROM vdr_documents WHERE doc_id = $1 OR id::text = $1 LIMIT 1',
      [docId]
    );
    if (!docRes.rows.length) return res.status(404).json({ error: 'document not found' });
    const doc = docRes.rows[0];

    const perm = await lookupPermission(doc.doc_id, role);
    if (!perm.can_view) {
      return res.status(403).json({ error: 'access denied for role', role, doc_id: doc.doc_id });
    }

    const watermark = perm.watermark_required
      ? makeWatermark(doc.doc_id, req.user?.email, role)
      : null;

    if (watermark) {
      try {
        await pool.query(
          `INSERT INTO vdr_watermarks (watermark_id, doc_id, viewer_email, viewer_role, overlay_text)
           VALUES ($1, $2, $3, $4, $5)`,
          [watermark.watermark_id, doc.doc_id, req.user?.email || null, role, watermark.overlay_text]
        );
      } catch (e) {
        console.warn('[vdrViewer] watermark log failed:', e.message);
      }
    }

    res.json({
      doc,
      permission: perm,
      watermark, // null if not required
      pages: synthesizePages(doc, perm.page_range),
      served_at: new Date().toISOString(),
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/vdr-viewer/doc/:doc_id/view  { dwell_seconds, page_count, watermark_id }
router.post('/doc/:doc_id/view', async (req, res) => {
  try {
    const docId = req.params.doc_id;
    const body = req.body || {};
    const role = req.user?.role || 'viewer';
    const r = await pool.query(
      `INSERT INTO vdr_doc_views (doc_id, viewer_email, viewer_role, dwell_seconds, page_count, watermark_id, client_ip, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        docId,
        req.user?.email || null,
        role,
        Number(body.dwell_seconds) || 0,
        Number(body.page_count) || 0,
        body.watermark_id || null,
        (req.ip || '').slice(0, 64),
        (req.headers['user-agent'] || '').slice(0, 255),
      ]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/vdr-viewer/analytics
router.get('/analytics', requireWriter, async (req, res) => {
  try {
    const totals = await pool.query(
      `SELECT
         COUNT(*)::int AS total_views,
         COUNT(DISTINCT viewer_email)::int AS unique_viewers,
         COUNT(DISTINCT doc_id)::int AS docs_viewed,
         COALESCE(SUM(dwell_seconds), 0)::int AS total_dwell_seconds,
         COALESCE(AVG(dwell_seconds), 0)::float AS avg_dwell_seconds
       FROM vdr_doc_views`
    );
    const byDoc = await pool.query(
      `SELECT doc_id,
              COUNT(*)::int AS views,
              COUNT(DISTINCT viewer_email)::int AS unique_viewers,
              COALESCE(SUM(dwell_seconds), 0)::int AS total_dwell_seconds,
              MAX(viewed_at) AS last_viewed_at
         FROM vdr_doc_views
         GROUP BY doc_id
         ORDER BY views DESC
         LIMIT 100`
    );
    const byViewer = await pool.query(
      `SELECT viewer_email, viewer_role,
              COUNT(*)::int AS views,
              COUNT(DISTINCT doc_id)::int AS unique_docs,
              COALESCE(SUM(dwell_seconds), 0)::int AS total_dwell_seconds,
              MAX(viewed_at) AS last_viewed_at
         FROM vdr_doc_views
         WHERE viewer_email IS NOT NULL
         GROUP BY viewer_email, viewer_role
         ORDER BY views DESC
         LIMIT 100`
    );
    res.json({
      totals: totals.rows[0],
      by_doc: byDoc.rows,
      by_viewer: byViewer.rows,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/vdr-viewer/analytics/doc/:doc_id
router.get('/analytics/doc/:doc_id', requireWriter, async (req, res) => {
  try {
    const docId = req.params.doc_id;
    const totals = await pool.query(
      `SELECT
         COUNT(*)::int AS views,
         COUNT(DISTINCT viewer_email)::int AS unique_viewers,
         COALESCE(SUM(dwell_seconds), 0)::int AS total_dwell_seconds,
         COALESCE(AVG(dwell_seconds), 0)::float AS avg_dwell_seconds
       FROM vdr_doc_views WHERE doc_id = $1`,
      [docId]
    );
    const recent = await pool.query(
      `SELECT id, viewer_email, viewer_role, viewed_at, dwell_seconds, page_count, watermark_id
         FROM vdr_doc_views WHERE doc_id = $1
         ORDER BY viewed_at DESC LIMIT 100`,
      [docId]
    );
    res.json({ doc_id: docId, totals: totals.rows[0], recent: recent.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/vdr-viewer/audit-log/export?format=csv|pdf
router.get('/audit-log/export', requireWriter, async (req, res) => {
  try {
    const format = (req.query.format || 'csv').toString().toLowerCase();
    const limit = Math.min(parseInt(req.query.limit, 10) || 5000, 50000);
    const r = await pool.query(
      'SELECT id, entry_id, actor, target, action, result, ts, created_at FROM audit_log ORDER BY id DESC LIMIT $1',
      [limit]
    );
    const rows = r.rows;
    if (format === 'pdf') {
      // No PDF library — emit a printable text doc with a PDF-like header,
      // marked as text/plain so consumers know it's not a real PDF.
      const lines = [
        '═══════════════════════════════════════════════',
        '  AIMandADealRoom — Audit Log Export',
        `  Generated: ${new Date().toISOString()}`,
        `  Row count: ${rows.length}`,
        '═══════════════════════════════════════════════',
        '',
      ];
      for (const row of rows) {
        lines.push(`#${row.id}  [${row.ts || row.created_at || ''}]`);
        lines.push(`  entry_id : ${row.entry_id || ''}`);
        lines.push(`  actor    : ${row.actor || ''}`);
        lines.push(`  target   : ${row.target || ''}`);
        lines.push(`  action   : ${row.action || ''}`);
        lines.push(`  result   : ${row.result || ''}`);
        lines.push('');
      }
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="audit-log-${Date.now()}.txt"`);
      return res.send(lines.join('\n'));
    }
    // CSV default
    const header = ['id', 'entry_id', 'actor', 'target', 'action', 'result', 'ts', 'created_at'];
    const out = [header.join(',')];
    for (const row of rows) {
      out.push(header.map((h) => csvEscape(row[h])).join(','));
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="audit-log-${Date.now()}.csv"`);
    res.send(out.join('\n'));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
