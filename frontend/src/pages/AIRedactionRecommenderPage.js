import React from 'react';
import AIPage from '../components/AIPage';
import { aiRedactionRecommender } from '../services/api';

export default function AIRedactionRecommenderPage() {
  return (
    <AIPage
      title="AI · Redaction Recommender"
      feature="redaction-recommender"
      subtitle="Flag PII, privileged, trade-secret, and financial spans for redaction."
      inputs={[
        { key: 'doc_name', label: 'Document Name', type: 'text',     placeholder: 'e.g. Top-5 exec compensation memo.pdf' },
        { key: 'body',     label: 'Document Body', type: 'textarea', placeholder: 'Paste the document text (first ~4k chars are analyzed).' },
      ]}
      run={(v) => aiRedactionRecommender({ doc_name: v.doc_name, body: v.body })}
    />
  );
}
