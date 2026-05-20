import React from 'react';
import AIPage from '../components/AIPage';
import { aiDueDiligencePrioritize } from '../services/api';

export default function AIDueDiligencePrioritizePage() {
  return (
    <AIPage
      title="AI · Due Diligence Prioritize"
      feature="due-diligence-prioritize"
      subtitle="Rank DD items by value-at-risk and timeline impact."
      inputs={[
        { key: 'notes', label: 'Optional Bias / Notes', type: 'textarea' },
      ]}
      run={(v) => aiDueDiligencePrioritize({ notes: v.notes })}
    />
  );
}
