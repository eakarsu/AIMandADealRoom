import React from 'react';
import AIPage from '../components/AIPage';
import { aiRedlineSummarizer } from '../services/api';

export default function AIRedlineSummarizerPage() {
  return (
    <AIPage
      title="AI · Redline Summarizer"
      feature="redline-summarizer"
      subtitle="Summarize material changes in marked-up legal documents."
      inputs={[
        { key: 'document', label: 'Document Title' },
        { key: 'redline',  label: 'Redline / Change List', type: 'textarea' },
      ]}
      run={(v) => aiRedlineSummarizer(v)}
    />
  );
}
