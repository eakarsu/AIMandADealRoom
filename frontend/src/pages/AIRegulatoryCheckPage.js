import React from 'react';
import AIPage from '../components/AIPage';
import { aiRegulatoryApprovalCheck } from '../services/api';

export default function AIRegulatoryCheckPage() {
  return (
    <AIPage
      title="AI · Regulatory Approval Check"
      feature="regulatory-approval-check"
      subtitle="Estimate timelines, concerns and likely remedies."
      inputs={[
        { key: 'deal_summary',  label: 'Deal Summary', type: 'textarea' },
        { key: 'jurisdictions', label: 'Jurisdictions (comma-separated)', type: 'textarea' },
      ]}
      run={(v) => aiRegulatoryApprovalCheck(v)}
    />
  );
}
