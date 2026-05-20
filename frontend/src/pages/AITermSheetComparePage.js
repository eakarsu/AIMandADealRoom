import React from 'react';
import AIPage from '../components/AIPage';
import { aiTermSheetCompare } from '../services/api';

export default function AITermSheetComparePage() {
  return (
    <AIPage
      title="AI · Term Sheet Compare"
      feature="term-sheet-compare"
      subtitle="Side-by-side comparison and recommended negotiation targets."
      inputs={[
        { key: 'deal',             label: 'Deal Name' },
        { key: 'term_sheets_json', label: 'Term Sheets (JSON array)', type: 'textarea',
          placeholder: '[{ "bidder": "GSK", "value_usd": 1850000000, "exclusivity_days": 45, "earn_out": "None", "escrow_pct": 8 }]' },
      ]}
      run={(v) => aiTermSheetCompare(v)}
    />
  );
}
