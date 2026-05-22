import React, { useEffect, useState } from 'react';
export default function BuyerEngagementScorePage() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem('mand_a_token') || localStorage.getItem('token');
  useEffect(() => { fetch('/api/buyer-engagement-score', { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r => r.json()).then(setData).catch(() => {}); }, [token]);
  return <div><h1>Buyer Engagement Score</h1><p>Ranks buyers from VDR views, Q&A activity, and financial model downloads.</p>{data?.buyers?.map(b => <section className="card" key={b.buyer}><h2>{b.buyer}</h2><p>{b.action} - score {b.engagement_score}</p></section>)}</div>;
}
