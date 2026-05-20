import React from 'react';
import DealFunnel from '../components/DealFunnel';
import CompScatter from '../components/CompScatter';
import SynergyWaterfall from '../components/SynergyWaterfall';
import ClosingGantt from '../components/ClosingGantt';
import VDRViewerQA from '../components/VDRViewerQA';

function Card({ title, subtitle, children }) {
  return (
    <section style={{
      background: '#0b1220',
      border: '1px solid #1e293b',
      borderRadius: 8,
      padding: 20,
      marginBottom: 24,
    }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ color: '#e2e8f0', margin: 0, fontSize: 18 }}>{title}</h2>
        {subtitle && (
          <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: 13 }}>{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function CustomViewsPage() {
  return (
    <div data-testid="custom-views-page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#e2e8f0', margin: 0 }}>Deal Analytics</h1>
        <p style={{ color: '#94a3b8', margin: '6px 0 0 0' }}>
          Cross-cutting visual analytics: funnel, comps, synergies and closing critical path.
        </p>
      </div>

      <Card
        title="Deal Pipeline Funnel"
        subtitle="Deals by lifecycle stage: sourcing → LOI → diligence → signing → closed."
      >
        <DealFunnel />
      </Card>

      <Card
        title="Comp Transactions — Multiple vs Metric"
        subtitle="Each point is a precedent comp; color encodes the valuation metric."
      >
        <CompScatter />
      </Card>

      <Card
        title="Synergy Waterfall"
        subtitle="Revenue + cost synergies − dis-synergies = net synergy value."
      >
        <SynergyWaterfall />
      </Card>

      <Card
        title="Closing Checklist Gantt"
        subtitle="Horizontal bars showing each closing-checklist item by owner over time."
      >
        <ClosingGantt />
      </Card>

      <Card
        title="VDR Viewer & Q&A"
        subtitle="Browse vault documents on the left; preview each one and post deal-scoped questions on the right."
      >
        <VDRViewerQA />
      </Card>
    </div>
  );
}
