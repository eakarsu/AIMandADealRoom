import React from 'react';
import AIPage from '../components/AIPage';
import { aiSynergyModel } from '../services/api';

export default function AISynergyModelPage() {
  return (
    <AIPage
      title="AI · Synergy Model"
      feature="synergy-model"
      subtitle="Build revenue/cost synergy buildouts with NPV and run-rate."
      inputs={[
        { key: 'deal_summary',  label: 'Deal Summary',  type: 'textarea', placeholder: 'e.g. Strategic acquires SaaS target for $1.2B.' },
        { key: 'context_notes', label: 'Context Notes', type: 'textarea', placeholder: 'Synergy levers, integration constraints, prior playbook results.' },
      ]}
      run={(v) => aiSynergyModel({ deal_summary: v.deal_summary, context_notes: v.context_notes })}
    />
  );
}
