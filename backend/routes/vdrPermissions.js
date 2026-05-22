// Per-document permissions (role-based access list) for VDR documents.
// Backlog item: "Granular per-doc / per-folder permissions" — implemented as
// role-based ACL on (doc_id, role) with optional page-range constraint.
//
// Endpoints (all under /api/vdr-permissions):
//   GET    /                       — list all grants (admin/advisor)
//   GET    /doc/:doc_id            — grants for a single doc
//   POST   /                       — create a grant (admin only)
//   PUT    /:id                    — update a grant (admin only)
//   DELETE /:id                    — revoke a grant (admin only)
//   POST   /check                  — { doc_id, role } → { can_view, can_download, page_range, watermark_required }

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { requireAdmin, requireWriter } = require('../middleware/auth');

const FIELDS = [
  'doc_id',
  'role',
  'can_view',
  'can_download',
  'watermark_required',
  'page_range_start',
  'page_range_end',
  'granted_by',
];

router.get('/', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM vdr_doc_permissions ORDER BY id DESC');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/doc/:doc_id', async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT * FROM vdr_doc_permissions WHERE doc_id = $1 ORDER BY role ASC',
      [req.params.doc_id]
    );
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.doc_id || !body.role) {
      return res.status(400).json({ error: 'doc_id and role are required' });
    }
    const vals = FIELDS.map((f) => {
      if (f === 'granted_by') return body[f] ?? req.user?.email ?? 'unknown';
      return body[f] ?? null;
    });
    const ph = FIELDS.map((_, i) => `$${i + 1}`).join(',');
    const r = await pool.query(
      `INSERT INTO vdr_doc_permissions (${FIELDS.join(',')}) VALUES (${ph}) RETURNING *`,
      vals
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const sets = FIELDS.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const vals = FIELDS.map((f) => body[f] ?? null);
    vals.push(req.params.id);
    const r = await pool.query(
      `UPDATE vdr_doc_permissions SET ${sets}, updated_at = NOW() WHERE id = $${FIELDS.length + 1} RETURNING *`,
      vals
    );
    if (!r.rows.length) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const r = await pool.query(
      'DELETE FROM vdr_doc_permissions WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'not found' });
    res.json({ message: 'revoked', row: r.rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /check — used by viewer/server to ask if (role) can access (doc_id) and at what page range.
// If no row exists for the (doc, role) pair we default-deny for viewer, default-allow for admin/advisor.
router.post('/check', async (req, res) => {
  try {
    const { doc_id, role } = req.body || {};
    if (!doc_id) return res.status(400).json({ error: 'doc_id is required' });
    const effectiveRole = role || req.user?.role || 'viewer';
    const r = await pool.query(
      'SELECT * FROM vdr_doc_permissions WHERE doc_id = $1 AND role = $2 ORDER BY id DESC LIMIT 1',
      [doc_id, effectiveRole]
    );
    if (r.rows.length) {
      const g = r.rows[0];
      return res.json({
        doc_id,
        role: effectiveRole,
        can_view: g.can_view !== false,
        can_download: g.can_download === true,
        watermark_required: g.watermark_required !== false,
        page_range: {
          start: g.page_range_start || 1,
          end: g.page_range_end || null,
        },
        source: 'explicit-grant',
      });
    }
    // Implicit default
    const isPrivileged = ['admin', 'advisor'].includes(effectiveRole);
    res.json({
      doc_id,
      role: effectiveRole,
      can_view: isPrivileged,
      can_download: effectiveRole === 'admin',
      watermark_required: true,
      page_range: { start: 1, end: null },
      source: 'implicit-default',
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
