import React, { useEffect, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ZAxis,
} from 'recharts';
import { API_BASE, getToken } from '../services/api';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#a78bfa', '#ef4444', '#06b6d4', '#facc15', '#fb7185'];

export default function CompScatter() {
  const [points, setPoints] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    fetch(`${API_BASE}/custom-views/comp-scatter`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setPoints(d.points || []);
        setMetrics(d.metrics || []);
        setLoading(false);
      })
      .catch((e) => { setErr(e.message); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: '#94a3b8' }}>Loading comps…</div>;
  if (err) return <div style={{ color: '#ef4444' }}>Error: {err}</div>;
  if (points.length === 0) return <div style={{ color: '#94a3b8' }}>No comp data.</div>;

  // Group by metric so each gets its own color/legend entry.
  const grouped = metrics.map((m, i) => ({
    name: m.metric,
    color: PALETTE[i % PALETTE.length],
    data: points
      .filter((p) => p.metric === m.metric)
      .map((p) => ({
        x: m.index,
        y: p.multiple,
        target: p.target,
        comp_id: p.comp_id,
        metric: p.metric,
      })),
  }));

  const xTicks = metrics.map((m) => m.index);
  const xLabel = (idx) => {
    const m = metrics.find((x) => x.index === idx);
    return m ? m.metric : '';
  };

  return (
    <div data-testid="comp-scatter" style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Metric"
            ticks={xTicks}
            tickFormatter={xLabel}
            domain={[0.5, metrics.length + 0.5]}
            stroke="#94a3b8"
            label={{ value: 'Metric', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Multiple"
            stroke="#94a3b8"
            label={{ value: 'Multiple (x)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
          />
          <ZAxis range={[80, 80]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
            formatter={(v, n, p) => {
              const pay = p && p.payload;
              if (!pay) return v;
              if (n === 'y') return [`${Number(pay.y).toFixed(1)}x`, `${pay.metric}`];
              if (n === 'x') return [pay.metric, 'Metric'];
              return v;
            }}
            labelFormatter={(_, p) => {
              const pay = p && p[0] && p[0].payload;
              return pay ? `${pay.target} (${pay.comp_id})` : '';
            }}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          {grouped.map((g) => (
            <Scatter key={g.name} name={g.name} data={g.data} fill={g.color} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
