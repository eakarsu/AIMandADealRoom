import React from 'react';
import AIPage from '../components/AIPage';
import { aiExecutiveBrief } from '../services/api';

export default function AIExecutiveBriefPage() {
  return (
    <AIPage
      title="AI · Executive Brief"
      feature="executive-brief"
      subtitle="Deal-team executive snapshot across the active portfolio."
      inputs={[
        { key: 'notes', label: 'Optional Bias / Notes', type: 'textarea' },
      ]}
      run={(v) => aiExecutiveBrief({ notes: v.notes })}
    />
  );
}
