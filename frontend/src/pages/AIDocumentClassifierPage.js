import React from 'react';
import AIPage from '../components/AIPage';
import { aiDocumentClassifier } from '../services/api';

export default function AIDocumentClassifierPage() {
  return (
    <AIPage
      title="AI · Document Classifier"
      feature="document-classifier"
      subtitle="Auto-tag a VDR document by category, sensitivity, and workstream."
      inputs={[
        { key: 'name',         label: 'Document Name',  type: 'text',     placeholder: 'e.g. Master Supplier Agreement v3.docx' },
        { key: 'body_snippet', label: 'Body Snippet',   type: 'textarea', placeholder: 'Paste the first paragraph or summary of the document.' },
        { key: 'deal_context', label: 'Deal Context',   type: 'textarea', placeholder: 'Which deal does this doc belong to and which workstream is reviewing it?' },
      ]}
      run={(v) => aiDocumentClassifier({
        name: v.name,
        body_snippet: v.body_snippet,
        deal_context: v.deal_context,
      })}
    />
  );
}
