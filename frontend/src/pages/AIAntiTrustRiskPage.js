import React from 'react';
import AIPage from '../components/AIPage';
import { aiAntiTrustRisk } from '../services/api';

export default function AIAntiTrustRiskPage() {
  return (
    <AIPage
      title="AI · Anti-Trust Risk"
      feature="anti-trust-risk"
      subtitle="HHI delta, market concerns, likely remedies, second-request probability."
      inputs={[
        { key: 'deal_summary',   label: 'Deal Summary',   type: 'textarea' },
        { key: 'market_context', label: 'Market Context', type: 'textarea' },
      ]}
      run={(v) => aiAntiTrustRisk(v)}
    />
  );
}
