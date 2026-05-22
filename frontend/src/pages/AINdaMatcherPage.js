import React from 'react';
import AIPage from '../components/AIPage';
import { aiNdaMatcher } from '../services/api';

export default function AINdaMatcherPage() {
  return (
    <AIPage
      title="AI · NDA Matcher"
      feature="nda-matcher"
      subtitle="Clause-level diff of an NDA against an in-house template."
      inputs={[
        { key: 'nda_excerpt',      label: 'NDA Excerpt',      type: 'textarea', placeholder: 'Paste key clauses from the counterparty NDA.' },
        { key: 'template_excerpt', label: 'Template Excerpt', type: 'textarea', placeholder: 'Paste matching clauses from your standard template.' },
      ]}
      run={(v) => aiNdaMatcher({ nda_excerpt: v.nda_excerpt, template_excerpt: v.template_excerpt })}
    />
  );
}
