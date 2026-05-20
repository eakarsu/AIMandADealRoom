import React from 'react';
import AIPage from '../components/AIPage';
import { aiWorkingCapitalTrueUp } from '../services/api';

export default function AIWorkingCapitalPage() {
  return (
    <AIPage
      title="AI · Working Capital True-Up"
      feature="working-capital-true-up"
      subtitle="Compute NWC true-up with line items and disputed items."
      inputs={[
        { key: 'target',              label: 'Target' },
        { key: 'balance_sheet_notes', label: 'Balance Sheet & Peg', type: 'textarea' },
      ]}
      run={(v) => aiWorkingCapitalTrueUp(v)}
    />
  );
}
