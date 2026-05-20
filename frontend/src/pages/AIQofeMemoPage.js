import React from 'react';
import AIPage from '../components/AIPage';
import { aiQofeMemo } from '../services/api';

export default function AIQofeMemoPage() {
  return (
    <AIPage
      title="AI · QofE Memo"
      feature="qofe-memo"
      subtitle="Draft a Quality of Earnings memo with normalization bridge."
      inputs={[
        { key: 'target',           label: 'Target' },
        { key: 'financials_notes', label: 'Reported Financials & Adjustments', type: 'textarea' },
        { key: 'context',          label: 'Context Notes', type: 'textarea' },
      ]}
      run={(v) => aiQofeMemo(v)}
    />
  );
}
