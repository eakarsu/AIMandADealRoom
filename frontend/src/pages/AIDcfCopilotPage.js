import React from 'react';
import AIPage from '../components/AIPage';
import { aiDcfCopilot } from '../services/api';

export default function AIDcfCopilotPage() {
  return (
    <AIPage
      title="AI · DCF Copilot"
      feature="dcf-copilot"
      subtitle="Guided DCF build with sensitivity matrix."
      inputs={[
        { key: 'target_summary',     label: 'Target Summary',     type: 'textarea', placeholder: 'Revenue / EBITDA / growth profile of the target.' },
        { key: 'assumptions_notes',  label: 'Assumptions',        type: 'textarea', placeholder: 'Projection horizon, WACC, exit multiple, tax rate, terminal growth.' },
      ]}
      run={(v) => aiDcfCopilot({ target_summary: v.target_summary, assumptions_notes: v.assumptions_notes })}
    />
  );
}
