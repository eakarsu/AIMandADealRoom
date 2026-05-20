import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LabelList,
} from 'recharts';
import { API_BASE, getToken } from '../services/api';

const TYPE_COLORS = {
  positive: '#10b981',
  negative: '#ef4444',
  total:    '#3b82f6',
};

function formatUsd(n) {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs}`;
}

export default function SynergyWaterfall() {
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    fetch(`${API_BASE}/custom-views/synergy-waterfall`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setTotals(d.totals || null);
        setLoading(false);
      })
      .catch((e) => { setErr(e.message); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: '#94a3b8' }}>Loading waterfall…</div>;
  if (err) return <div style={{ color: '#ef4444' }}>Error: {err}</div>;

  // Recharts waterfall: stack invisible "base" then visible "delta"
  const data = items.map((it) => ({
    name: it.name,
    base: it.base,
    delta: it.delta,
    type: it.type,
    label: formatUsd(it.value),
    rawValue: it.value,
  }));

  return (
    <div data-testid="synergy-waterfall" style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 30, right: 30, bottom: 20, left: 40 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" tickFormatter={formatUsd} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
            formatter={(v, n, p) => {
              const pay = p && p.payload;
              if (!pay) return v;
              if (n === 'delta') return [formatUsd(pay.rawValue), pay.name];
              return null;
            }}
          />
          <Bar dataKey="base" stackId="w" fill="transparent" />
          <Bar dataKey="delta" stackId="w">
            {data.map((d, i) => (
              <Cell key={`c-${i}`} fill={TYPE_COLORS[d.type] || '#64748b'} />
            ))}
            <LabelList dataKey="label" position="top" fill="#e2e8f0" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {totals && (
        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          <div style={{ padding: '8px 12px', background: '#0f172a', borderLeft: '3px solid #10b981', borderRadius: 4 }}>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>REVENUE SYN</div>
            <div style={{ color: '#10b981', fontWeight: 600 }}>{formatUsd(totals.revenue)}</div>
          </div>
          <div style={{ padding: '8px 12px', background: '#0f172a', borderLeft: '3px solid #10b981', borderRadius: 4 }}>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>COST SYN</div>
            <div style={{ color: '#10b981', fontWeight: 600 }}>{formatUsd(totals.cost)}</div>
          </div>
          <div style={{ padding: '8px 12px', background: '#0f172a', borderLeft: '3px solid #ef4444', borderRadius: 4 }}>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>DIS-SYN</div>
            <div style={{ color: '#ef4444', fontWeight: 600 }}>{formatUsd(totals.dis)}</div>
          </div>
          <div style={{ padding: '8px 12px', background: '#0f172a', borderLeft: '3px solid #3b82f6', borderRadius: 4 }}>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>NET</div>
            <div style={{ color: '#3b82f6', fontWeight: 600 }}>{formatUsd(totals.net)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
