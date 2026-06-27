import React from 'react';
import CrudPage from '../components/CrudPage';
import { bidRoundsApi } from '../services/api';

export default function BidRoundsPage() {
  return (
    <CrudPage
      title="Bid Rounds"
      subtitle="Process management for teaser, IOI, management presentation, LOI, and final bid rounds."
      api={bidRoundsApi}
      statusKey="status"
      fields={[
        { key: 'round_id', label: 'Round ID' },
        { key: 'deal_id', label: 'Deal ID' },
        { key: 'round_name', label: 'Round' },
        { key: 'bid_deadline', label: 'Deadline', type: 'date' },
        { key: 'invited_buyers', label: 'Invited Buyers', type: 'number' },
        { key: 'bids_received', label: 'Bids Received', type: 'number' },
        { key: 'top_bid_usd', label: 'Top Bid (USD)', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['planned','open','evaluating','shortlisted','closed'] },
        { key: 'decision_summary', label: 'Decision Summary', type: 'textarea' },
      ]}
    />
  );
}
