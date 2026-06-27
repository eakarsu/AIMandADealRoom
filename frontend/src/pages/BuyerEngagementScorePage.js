import React, { useEffect, useState } from 'react';
import RecordDetailModal from '../components/RecordDetailModal';

export default function BuyerEngagementScorePage() {
  const [data, setData] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const token = localStorage.getItem('mand_a_token') || localStorage.getItem('token');
  useEffect(() => { fetch('/api/buyer-engagement-score', { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r => r.json()).then(setData).catch(() => {}); }, [token]);
  return (
    <div>
      <h1>Buyer Engagement Score</h1>
      <p>Ranks buyers from VDR views, Q&A activity, and financial model downloads.</p>
      {data?.buyers?.map((buyer) => (
        <section
          className="card clickable-card"
          key={buyer.buyer}
          tabIndex={0}
          onClick={() => setSelectedBuyer(buyer)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setSelectedBuyer(buyer);
            }
          }}
        >
          <h2>{buyer.buyer}</h2>
          <p>{buyer.action} - score {buyer.engagement_score}</p>
        </section>
      ))}
      {selectedBuyer && (
        <RecordDetailModal
          record={selectedBuyer}
          title={selectedBuyer.buyer || 'Buyer Details'}
          onClose={() => setSelectedBuyer(null)}
        />
      )}
    </div>
  );
}
