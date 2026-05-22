import React from 'react';
import AIPage from '../components/AIPage';
import { aiTermSheetDiffExplainer } from '../services/api';

export default function AITermSheetDiffExplainerPage() {
  return (
    <AIPage
      title="AI · Term Sheet Diff Explainer"
      feature="term-sheet-diff-explainer"
      subtitle="Natural-language narration over a term-sheet redline."
      inputs={[
        { key: 'diff_notes', label: 'Diff Notes', type: 'textarea', placeholder: 'Summarize the changes between term-sheet versions.' },
        { key: 'context',    label: 'Context',    type: 'textarea', placeholder: 'Deal context, what changed in DD, buyer/seller motivations.' },
      ]}
      run={(v) => aiTermSheetDiffExplainer({ diff_notes: v.diff_notes, context: v.context })}
    />
  );
}
