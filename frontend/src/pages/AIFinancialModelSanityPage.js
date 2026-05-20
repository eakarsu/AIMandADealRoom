import React from 'react';
import AIPage from '../components/AIPage';
import { aiFinancialModelSanity } from '../services/api';

export default function AIFinancialModelSanityPage() {
  return (
    <AIPage
      title="AI · Financial Model Sanity"
      feature="financial-model-sanity"
      subtitle="Sanity-check a model summary with stress tests and red flags."
      inputs={[
        { key: 'model_summary', label: 'Model Summary',  type: 'textarea' },
        { key: 'context',       label: 'Context Notes',  type: 'textarea' },
      ]}
      run={(v) => aiFinancialModelSanity(v)}
    />
  );
}
