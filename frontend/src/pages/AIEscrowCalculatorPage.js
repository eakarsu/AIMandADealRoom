import React from 'react';
import AIPage from '../components/AIPage';
import { aiEscrowCalculator } from '../services/api';

export default function AIEscrowCalculatorPage() {
  return (
    <AIPage
      title="AI · Escrow Calculator"
      feature="escrow-calculator"
      subtitle="Recommended escrow sizing, triggers and release schedule."
      inputs={[
        { key: 'deal_summary', label: 'Deal Summary', type: 'textarea' },
        { key: 'risk_profile', label: 'Risk Profile', type: 'textarea' },
      ]}
      run={(v) => aiEscrowCalculator(v)}
    />
  );
}
