import React from 'react';
import AIPage from '../components/AIPage';
import { aiDealSummaryGenerator } from '../services/api';

export default function AIDealSummaryPage() {
  return (
    <AIPage
      title="AI · Deal Summary Generator"
      feature="deal-summary-generator"
      subtitle="Produce a one-page deal summary from the deal plus linked entities."
      inputs={[
        { key: 'deal_summary', label: 'Deal Summary', type: 'textarea', placeholder: 'High-level transaction description (buyer, target, EV, structure).' },
        { key: 'linked_notes', label: 'Linked Notes', type: 'textarea', placeholder: 'Workstream highlights, QofE, regulatory, milestones.' },
      ]}
      run={(v) => aiDealSummaryGenerator({ deal_summary: v.deal_summary, linked_notes: v.linked_notes })}
    />
  );
}
