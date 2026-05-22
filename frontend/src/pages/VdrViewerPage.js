import React, { useEffect, useRef, useState } from 'react';
import { vdrViewerApi } from '../services/api';

// In-browser doc viewer with page-level ACL + server-side watermark overlay metadata.
// Renders a placeholder page list (the app stores doc metadata, not full PDF bodies),
// plus an overlay banner whose text is provided by the server response.
export default function VdrViewerPage() {
  const [docId, setDocId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const openedAtRef = useRef(null);

  const load = async () => {
    if (!docId.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    openedAtRef.current = Date.now();
    try {
      const r = await vdrViewerApi.fetchDoc(docId.trim());
      setData(r);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  // On unmount / doc change: log view event with dwell time.
  useEffect(() => {
    return () => {
      if (data && openedAtRef.current) {
        const dwell = Math.round((Date.now() - openedAtRef.current) / 1000);
        vdrViewerApi.logView(data.doc?.doc_id || docId, {
          dwell_seconds: dwell,
          page_count: (data.pages || []).length,
          watermark_id: data.watermark?.watermark_id,
        }).catch(() => {});
      }
    };
  }, [data, docId]);

  const finishViewing = async () => {
    if (!data) return;
    const dwell = Math.round((Date.now() - (openedAtRef.current || Date.now())) / 1000);
    try {
      await vdrViewerApi.logView(data.doc?.doc_id || docId, {
        dwell_seconds: dwell,
        page_count: (data.pages || []).length,
        watermark_id: data.watermark?.watermark_id,
      });
      alert(`View logged · ${dwell}s dwell · ${(data.pages || []).length} pages.`);
    } catch (e) { alert(`Log failed: ${e.message}`); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>VDR Viewer</h2>
          <p>In-browser doc viewer with page-level access control + watermarking + dwell tracking.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="form-grid">
          <div className="form-group">
            <label>Doc ID</label>
            <input value={docId} onChange={(e) => setDocId(e.target.value)} placeholder="e.g. VDR-0042" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ai" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Open'}</button>
          {data && <button className="btn secondary" onClick={finishViewing}>Log view now</button>}
        </div>
      </div>

      {error && <div className="ai-error">{error}</div>}

      {data && (
        <>
          <div className="card" style={{ marginBottom: 12 }}>
            <h3>Permission</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
              {JSON.stringify(data.permission, null, 2)}
            </pre>
          </div>

          {data.watermark && (
            <div className="card" style={{
              marginBottom: 12,
              background: 'rgba(255, 200, 0, 0.06)',
              border: '1px dashed rgba(255, 200, 0, 0.6)',
            }}>
              <strong>Watermark overlay (server-issued):</strong>
              <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: 12 }}>{data.watermark.overlay_text}</div>
              <div style={{ marginTop: 4, opacity: 0.7, fontSize: 11 }}>id: {data.watermark.watermark_id}</div>
            </div>
          )}

          <div className="card">
            <h3>{data.doc?.name || data.doc?.doc_id}</h3>
            <p style={{ opacity: 0.7, fontSize: 12 }}>
              {data.doc?.category || 'uncategorized'} · {data.pages?.length || 0} pages served (range {data.permission?.page_range?.start}–{data.permission?.page_range?.end || 'end'})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {(data.pages || []).map((p) => (
                <div key={p.page} style={{
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: '24px 16px',
                  minHeight: 120,
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  {data.watermark && (
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      opacity: 0.18,
                      transform: 'rotate(-22deg)',
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: 1,
                      whiteSpace: 'nowrap',
                    }}>
                      {data.watermark.overlay_text}
                    </div>
                  )}
                  <div style={{ fontSize: 13, opacity: 0.85 }}>Page {p.page}</div>
                  <div style={{ fontSize: 12, opacity: 0.55, marginTop: 6 }}>{p.placeholder}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
