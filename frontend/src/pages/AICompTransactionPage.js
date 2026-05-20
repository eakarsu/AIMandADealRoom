import React from 'react';
import AIPage from '../components/AIPage';
import { aiCompTransactionFinder } from '../services/api';

export default function AICompTransactionPage() {
  return (
    <AIPage
      title="AI · Comp Transaction Finder"
      feature="comp-transaction-finder"
      subtitle="Find precedent transactions and triangulate valuation range."
      inputs={[
        { key: 'target_name',       label: 'Target Name' },
        { key: 'sector',            label: 'Sector' },
        { key: 'metric_preference', label: 'Preferred Multiples' },
        { key: 'notes',             label: 'Notes', type: 'textarea' },
      ]}
      run={(v) => aiCompTransactionFinder(v)}
    />
  );
}
