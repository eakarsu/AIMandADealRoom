import React from 'react';
import AIPage from '../components/AIPage';
import { aiQaCopilot } from '../services/api';

export default function AIQaCopilotPage() {
  return (
    <AIPage
      title="AI · Q&A Copilot"
      feature="qa-copilot"
      subtitle="Draft an assisted answer for a VDR diligence question."
      inputs={[
        { key: 'question',                label: 'Question',         type: 'textarea', placeholder: 'Paste the incoming diligence question.' },
        { key: 'existing_partial_answer', label: 'Existing Partial', type: 'textarea', placeholder: 'Optional — partial answer to refine.' },
        { key: 'vdr_notes',               label: 'VDR Notes',        type: 'textarea', placeholder: 'Pointers to relevant docs / workstreams / dataroom folders.' },
      ]}
      run={(v) => aiQaCopilot({
        question: v.question,
        existing_partial_answer: v.existing_partial_answer,
        vdr_notes: v.vdr_notes,
      })}
    />
  );
}
