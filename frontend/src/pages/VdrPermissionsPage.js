import React, { useEffect, useState } from 'react';
import { vdrDocumentsApi, vdrPermissionsApi, isAdmin } from '../services/api';
import RecordDetailModal from '../components/RecordDetailModal';

const ROLES = ['admin', 'advisor', 'viewer'];

const empty = {
  doc_id: '',
  role: 'viewer',
  can_view: true,
  can_download: false,
  watermark_required: true,
  page_range_start: '',
  page_range_end: '',
};

export default function VdrPermissionsPage() {
  const admin = isAdmin();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [docs, setDocs] = useState([]);
  const [selectedGrant, setSelectedGrant] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vdrPermissionsApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    vdrDocumentsApi.list()
      .then((rows) => setDocs(Array.isArray(rows) ? rows : []))
      .catch(() => setDocs([]));
  }, []);

  const update = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const submit = async () => {
    setError(null);
    try {
      const payload = {
        ...draft,
        page_range_start: draft.page_range_start === '' ? null : Number(draft.page_range_start),
        page_range_end:   draft.page_range_end   === '' ? null : Number(draft.page_range_end),
      };
      if (editingId) {
        await vdrPermissionsApi.update(editingId, payload);
      } else {
        await vdrPermissionsApi.create(payload);
      }
      setDraft(empty);
      setEditingId(null);
      await load();
    } catch (e) { setError(e.message); }
  };

  const edit = (row) => {
    setSelectedGrant(null);
    setEditingId(row.id);
    setDraft({
      doc_id: row.doc_id || '',
      role: row.role || 'viewer',
      can_view: row.can_view !== false,
      can_download: row.can_download === true,
      watermark_required: row.watermark_required !== false,
      page_range_start: row.page_range_start ?? '',
      page_range_end: row.page_range_end ?? '',
    });
  };

  const remove = async (id) => {
    if (!window.confirm('Revoke this grant?')) return;
    try { await vdrPermissionsApi.remove(id); setSelectedGrant(null); await load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>VDR Permissions</h2>
          <p>Role-based access list for VDR documents (per-doc + page-range + download + watermark).</p>
        </div>
      </div>

      {error && <div className="ai-error">{error}</div>}

      {admin && (
        <div className="card" style={{ marginBottom: 12 }}>
          <h3>{editingId ? `Edit grant #${editingId}` : 'Grant access'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Doc ID</label>
              <select value={draft.doc_id} onChange={(e) => update('doc_id', e.target.value)}>
                <option value="">Select document</option>
                {docs.map((doc) => (
                  <option key={doc.id || doc.doc_id} value={doc.doc_id || doc.id}>
                    {(doc.doc_id || doc.id)} · {doc.name || 'Untitled'}{doc.category ? ` · ${doc.category}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Manual Doc ID</label>
              <input value={draft.doc_id} onChange={(e) => update('doc_id', e.target.value)} placeholder="e.g. VDR-0042" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={draft.role} onChange={(e) => update('role', e.target.value)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Page range start</label>
              <input type="number" value={draft.page_range_start} onChange={(e) => update('page_range_start', e.target.value)} placeholder="blank = page 1" />
            </div>
            <div className="form-group">
              <label>Page range end</label>
              <input type="number" value={draft.page_range_end} onChange={(e) => update('page_range_end', e.target.value)} placeholder="blank = last page" />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={draft.can_view} onChange={(e) => update('can_view', e.target.checked)} />
                {' '}Can view
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={draft.can_download} onChange={(e) => update('can_download', e.target.checked)} />
                {' '}Can download
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={draft.watermark_required} onChange={(e) => update('watermark_required', e.target.checked)} />
                {' '}Watermark required
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn ai" onClick={submit}>{editingId ? 'Save changes' : 'Grant'}</button>
            {editingId && <button className="btn secondary" onClick={() => { setEditingId(null); setDraft(empty); }}>Cancel</button>}
          </div>
        </div>
      )}

      <div className="card">
        <h3>Active grants</h3>
        {loading && <div className="empty-state">Loading…</div>}
        {!loading && rows.length === 0 && <div className="empty-state">No grants yet.</div>}
        {!loading && rows.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Doc ID</th>
                <th>Role</th>
                <th>View</th>
                <th>Download</th>
                <th>Watermark</th>
                <th>Pages</th>
                <th>Granted by</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="clickable-row"
                  tabIndex={0}
                  onClick={() => setSelectedGrant(r)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedGrant(r);
                    }
                  }}
                >
                  <td>{r.id}</td>
                  <td>{r.doc_id}</td>
                  <td>{r.role}</td>
                  <td>{r.can_view ? 'yes' : 'no'}</td>
                  <td>{r.can_download ? 'yes' : 'no'}</td>
                  <td>{r.watermark_required ? 'required' : 'off'}</td>
                  <td>{(r.page_range_start || 1)}–{r.page_range_end || 'end'}</td>
                  <td>{r.granted_by || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedGrant && (
        <RecordDetailModal
          record={selectedGrant}
          title="VDR Permission Details"
          onClose={() => setSelectedGrant(null)}
          onEdit={admin ? () => edit(selectedGrant) : null}
          onDelete={admin ? () => remove(selectedGrant.id) : null}
        />
      )}
    </div>
  );
}
