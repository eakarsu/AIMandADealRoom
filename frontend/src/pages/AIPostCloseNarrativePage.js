import React from 'react';
import AIPage from '../components/AIPage';
import { aiPostCloseNarrative } from '../services/api';

export default function AIPostCloseNarrativePage() {
  return (
    <AIPage
      title="AI · Post-Close Narrative"
      feature="post-close-narrative"
      subtitle="Board-ready post-close report with KPI performance and next-Q priorities."
      inputs={[
        { key: 'deal_summary', label: 'Deal Summary', type: 'textarea' },
        { key: 'kpi_notes',    label: 'KPI Notes',    type: 'textarea' },
      ]}
      run={(v) => aiPostCloseNarrative(v)}
    />
  );
}
