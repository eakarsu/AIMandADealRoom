import React from 'react';
import AIPage from '../components/AIPage';
import { aiIntegrationPlanDraft } from '../services/api';

export default function AIIntegrationPlanPage() {
  return (
    <AIPage
      title="AI · Integration Plan Draft"
      feature="integration-plan-draft"
      subtitle="Day-1 / 90-day / 180-day post-merger integration plan."
      inputs={[
        { key: 'deal_summary', label: 'Deal Summary', type: 'textarea' },
        { key: 'scope_notes',  label: 'Scope & Constraints', type: 'textarea' },
      ]}
      run={(v) => aiIntegrationPlanDraft(v)}
    />
  );
}
