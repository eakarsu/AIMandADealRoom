import React from 'react';
import AIPage from '../components/AIPage';
import { aiClosingChecklistGen } from '../services/api';

export default function AIClosingChecklistPage() {
  return (
    <AIPage
      title="AI · Closing Checklist Generator"
      feature="closing-checklist-gen"
      subtitle="Categorized checklist with critical path and close-risk score."
      inputs={[
        { key: 'deal_summary', label: 'Deal Summary', type: 'textarea' },
        { key: 'signing_date', label: 'Signing Date', type: 'date' },
        { key: 'closing_date', label: 'Closing Date', type: 'date' },
      ]}
      run={(v) => aiClosingChecklistGen(v)}
    />
  );
}
