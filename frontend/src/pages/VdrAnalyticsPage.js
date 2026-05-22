import React, { useEffect, useState } from 'react';
import { vdrViewerApi, getToken } from '../services/api';

// Dataroom analytics + audit-log export. Read access is broad; the underlying
// endpoints enforce admin/advisor RBAC.
export default function VdrAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await vdrViewerApi.analytics();
      setData(r);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const downloadExport = async (format) => {
    const url = vdrViewerApi.auditExportUrl(format);
    const token = getToken();
    try {
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Export failed (${res.status}): ${t.slice(0, 120)}`);
      }
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const ext = format === 'pdf' ? 'txt' : 'csv';
      a.download = `audit-log-${Date.now()}.${ext}`;
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dataroom Analytics</h2>
          <p>Who viewed what, when, and dwell time. Plus audit-log export (CSV/PDF).</p>
        </div>
        <div className="page-header-actions">
          <button className="btn secondary" onClick={() => downloadExport('csv')}>Export audit log (CSV)</button>
          <button className="btn secondary" onClick={() => downloadExport('pdf')}>Export audit log (PDF)</button>
          <button className="btn ai" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
        </div>
      </div>

      {error && <div className="ai-error">{error}</div>}

      {data && (
        <>
          <div className="card" style={{ marginBottom: 12 }}>
            <h3>Totals</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Stat label="Total views" value={data.totals?.total_views} />
              <Stat label="Unique viewers" value={data.totals?.unique_viewers} />
              <Stat label="Docs viewed" value={data.totals?.docs_viewed} />
              <Stat label="Total dwell (sec)" value={data.totals?.total_dwell_seconds} />
              <Stat label="Avg dwell (sec)" value={Math.round(data.totals?.avg_dwell_seconds || 0)} />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <h3>By Document</h3>
            {(!data.by_doc || data.by_doc.length === 0) && <div className="empty-state">No views logged yet.</div>}
            {data.by_doc && data.by_doc.length > 0 && (
              <table className="data-table">
                <thead>
                  <tr><th>Doc ID</th><th>Views</th><th>Unique viewers</th><th>Total dwell (s)</th><th>Last viewed</th></tr>
                </thead>
                <tbody>
                  {data.by_doc.map((r) => (
                    <tr key={r.doc_id}>
                      <td>{r.doc_id}</td>
                      <td>{r.views}</td>
                      <td>{r.unique_viewers}</td>
                      <td>{r.total_dwell_seconds}</td>
                      <td>{r.last_viewed_at ? new Date(r.last_viewed_at).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h3>By Viewer</h3>
            {(!data.by_viewer || data.by_viewer.length === 0) && <div className="empty-state">No viewer activity yet.</div>}
            {data.by_viewer && data.by_viewer.length > 0 && (
              <table className="data-table">
                <thead>
                  <tr><th>Viewer</th><th>Role</th><th>Views</th><th>Unique docs</th><th>Total dwell (s)</th><th>Last viewed</th></tr>
                </thead>
                <tbody>
                  {data.by_viewer.map((r) => (
                    <tr key={`${r.viewer_email}-${r.viewer_role}`}>
                      <td>{r.viewer_email}</td>
                      <td>{r.viewer_role || '—'}</td>
                      <td>{r.views}</td>
                      <td>{r.unique_docs}</td>
                      <td>{r.total_dwell_seconds}</td>
                      <td>{r.last_viewed_at ? new Date(r.last_viewed_at).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{
      padding: '10px 14px',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 6,
      minWidth: 140,
    }}>
      <div style={{ fontSize: 11, opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{value ?? 0}</div>
    </div>
  );
}
