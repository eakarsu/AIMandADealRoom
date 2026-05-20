import React from 'react';
import AIPage from '../components/AIPage';
import { aiVdrQuestionRouter } from '../services/api';

export default function AIVdrQuestionRouterPage() {
  return (
    <AIPage
      title="AI · VDR Question Router"
      feature="vdr-question-router"
      subtitle="Route incoming bidder questions and draft an answer outline."
      inputs={[
        { key: 'question', label: 'Bidder Question', type: 'textarea' },
        { key: 'vdr_notes', label: 'VDR Context Notes', type: 'textarea' },
      ]}
      run={(v) => aiVdrQuestionRouter(v)}
    />
  );
}
