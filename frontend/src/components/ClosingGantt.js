import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend,
} from 'recharts';
import { API_BASE, getToken } from '../services/api';

const OWNER_PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#a78bfa', '#ef4444', '#06b6d4', '#facc15', '#fb7185', '#22c55e', '#0ea5e9'];

function ownerColor(owner, ownerIndex) {
  return OWNER_PALETTE[ownerIndex[owner] % OWNER_PALETTE.length];
}

export default function ClosingGantt() {
  const [items, setItems] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    fetch(`${API_BASE}/custom-views/closing-gantt`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setMinDate(d.min_date);
        setMaxDate(d.max_date);
        setLoading(false);
      })
      .catch((e) => { setErr(e.message); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: '#94a3b8' }}>Loading checklist…</div>;
  if (err) return <div style={{ color: '#ef4444' }}>Error: {err}</div>;
  if (items.length === 0) return <div style={{ color: '#94a3b8' }}>No closing-checklist items.</div>;

  // Group by owner so coloring is consistent
  const ownerIndex = {};
  let idx = 0;
  items.forEach((it) => {
    if (!(it.owner in ownerIndex)) ownerIndex[it.owner] = idx++;
  });

  const data = items.slice(0, 30).map((it) => ({
    label: `${it.item.length > 28 ? it.item.slice(0, 27) + '…' : it.item}`,
    fullItem: it.item,
    owner: it.owner,
    status: it.status,
    start: it.start,
    due: it.due,
    offset: it.offset_days,
    duration: it.duration_days,
  }));

  const owners = Object.keys(ownerIndex);

  return (
    <div data-testid="closing-gantt" style={{ width: '100%', height: Math.max(360, data.length * 28) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, bottom: 30, left: 160 }}
        >
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis
            type="number"
            stroke="#94a3b8"
            label={{ value: `Days from ${minDate || 'start'}`, position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
          />
          <YAxis
            type="category"
            dataKey="label"
            stroke="#cbd5e1"
            width={155}
            fontSize={11}
          />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
            formatter={(v, n, p) => {
              const pay = p && p.payload;
              if (!pay) return v;
              if (n === 'duration') return [`${pay.duration} days (${pay.start} → ${pay.due})`, `${pay.owner} · ${pay.status}`];
              return null;
            }}
            labelFormatter={(_, p) => {
              const pay = p && p[0] && p[0].payload;
              return pay ? pay.fullItem : '';
            }}
          />
          <Legend
            payload={owners.map((o) => ({
              value: o,
              type: 'square',
              color: ownerColor(o, ownerIndex),
              id: o,
            }))}
            wrapperStyle={{ color: '#cbd5e1' }}
          />
          <Bar dataKey="offset" stackId="g" fill="transparent" />
          <Bar dataKey="duration" stackId="g" radius={[3, 3, 3, 3]}>
            {data.map((d, i) => (
              <Cell key={`g-${i}`} fill={ownerColor(d.owner, ownerIndex)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
