import React from 'react';
import AIPage from '../components/AIPage';
import { aiRiskFlagExtractor } from '../services/api';

export default function AIRiskFlagExtractorPage() {
  return (
    <AIPage
      title="AI · Risk Flag Extractor"
      feature="risk-flag-extractor"
      subtitle="Scan a multi-document corpus and extract cross-doc red flags."
      inputs={[
        { key: 'corpus_notes', label: 'Corpus Notes', type: 'textarea', placeholder: 'Brief summary of the docs in scope (SPA, DD memos, schedules).' },
        { key: 'focus',        label: 'Focus Area',   type: 'text',     placeholder: 'e.g. Legal + regulatory' },
      ]}
      run={(v) => aiRiskFlagExtractor({ corpus_notes: v.corpus_notes, focus: v.focus })}
    />
  );
}
