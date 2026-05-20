import React, { useEffect, useState } from 'react';
import {
  FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { API_BASE, getToken } from '../services/api';

const STAGE_COLORS = {
  sourcing:  '#3b82f6',
  loi:       '#06b6d4',
  diligence: '#a78bfa',
  signing:   '#f59e0b',
  closed:    '#10b981',
};

function formatUsd(n) {
  if (!n) return '$0';
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}

export default function DealFunnel() {
  const [stages, setStages] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    fetch(`${API_BASE}/custom-views/deal-funnel`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setStages(d.stages || []);
        setLoading(false);
      })
      .catch((e) => { setErr(e.message); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: '#94a3b8' }}>Loading funnel…</div>;
  if (err) return <div style={{ color: '#ef4444' }}>Error: {err}</div>;

  // Synthesize a baseline of 1 so empty stages still render a thin slice for visual continuity.
  const maxCount = Math.max(1, ...stages.map((s) => s.count));
  const data = stages.map((s) => ({
    name: s.stage.toUpperCase(),
    value: s.count > 0 ? s.count : Math.max(1, Math.round(maxCount * 0.05)),
    realCount: s.count,
    realValue: s.value,
    fill: STAGE_COLORS[s.stage] || '#64748b',
  }));

  return (
    <div data-testid="deal-funnel" style={{ width: '100%', height: 380 }}>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip
            formatter={(_, __, p) => {
              const payload = p && p.payload;
              if (!payload) return null;
              return [`${payload.realCount} deals · ${formatUsd(payload.realValue)}`, payload.name];
            }}
          />
          <Funnel dataKey="value" data={data} isAnimationActive>
            {data.map((entry, idx) => (
              <Cell key={`c-${idx}`} fill={entry.fill} />
            ))}
            <LabelList
              position="right"
              dataKey="name"
              fill="#e2e8f0"
              stroke="none"
            />
            <LabelList
              position="center"
              fill="#0f172a"
              stroke="none"
              dataKey="realCount"
              formatter={(v) => `${v}`}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
        {stages.map((s) => (
          <div key={s.stage} style={{
            padding: '8px 12px',
            background: '#1e293b',
            borderLeft: `3px solid ${STAGE_COLORS[s.stage] || '#64748b'}`,
            borderRadius: 4,
            minWidth: 130,
          }}>
            <div style={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>{s.stage}</div>
            <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{s.count} deals</div>
            <div style={{ color: '#cbd5e1', fontSize: 12 }}>{formatUsd(s.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
