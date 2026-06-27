import React from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { path: '/deals',                       title: 'Deals',                       icon: 'D', color: '#3b82f6', desc: 'Active and historical M&A transactions across stages.' },
  { path: '/targets',                     title: 'Targets',                     icon: 'T', color: '#06b6d4', desc: 'Acquisition targets and financial profile.' },
  { path: '/advisors',                    title: 'Advisors',                    icon: 'A', color: '#10b981', desc: 'External M&A advisors, banking and legal contacts.' },
  { path: '/vdr-documents',               title: 'VDR Documents',               icon: 'V', color: '#f59e0b', desc: 'Virtual Data Room documents by deal and category.' },
  { path: '/q-and-a',                     title: 'Q&A',                         icon: '?', color: '#a78bfa', desc: 'Bidder questions routed through the VDR.' },
  { path: '/working-groups',              title: 'Working Groups',              icon: 'W', color: '#ec4899', desc: 'Diligence and execution workstreams.' },
  { path: '/term-sheets',                 title: 'Term Sheets',                 icon: 'S', color: '#22c55e', desc: 'Circulated term sheets and signed agreements.' },
  { path: '/lois',                        title: 'LOIs',                        icon: 'L', color: '#ef4444', desc: 'Submitted bids with value and exclusivity.' },
  { path: '/due-diligence-items',         title: 'Due Diligence',               icon: 'X', color: '#0ea5e9', desc: 'DD items with findings and ownership.' },
  { path: '/financial-models',            title: 'Financial Models',            icon: 'M', color: '#14b8a6', desc: 'DCF, LBO, project finance and SaaS models.' },
  { path: '/comps',                       title: 'Comp Transactions',           icon: 'C', color: '#fb7185', desc: 'Precedent comps for valuation triangulation.' },
  { path: '/working-capital-adjustments', title: 'Working Capital Adj',         icon: '$', color: '#facc15', desc: 'NWC true-up line items and disputes.' },
  { path: '/integration-plans',           title: 'Integration Plans',           icon: 'I', color: '#a3e635', desc: 'Day-1 to Day-180 post-merger plans.' },
  { path: '/regulatory-filings',          title: 'Regulatory Filings',          icon: 'R', color: '#60a5fa', desc: 'Merger control, banking and trade filings.' },
  { path: '/escrow-terms',                title: 'Escrow Terms',                icon: 'E', color: '#7dd3fc', desc: 'Indemnity, regulatory and milestone escrows.' },
  { path: '/closing-checklist',           title: 'Closing Checklist',           icon: 'K', color: '#f472b6', desc: 'Conditions precedent and closing deliverables.' },
  { path: '/post-close-reports',          title: 'Post-Close Reports',          icon: 'P', color: '#dc2626', desc: 'KPI tracking against deal plan after close.' },
  { path: '/audit-log',                   title: 'Audit Log',                   icon: '#', color: '#34d399', desc: 'VDR access and write-action history.' },

  { path: '/ai/synergy-model',             title: 'AI · Synergy Model',             icon: '*', color: '#8b5cf6', desc: 'Revenue + cost synergy buildouts with NPV.' },
  { path: '/ai/comp-transaction-finder',   title: 'AI · Comp Transaction Finder',   icon: '*', color: '#8b5cf6', desc: 'Precedent comps and valuation range.' },
  { path: '/ai/qofe-memo',                 title: 'AI · QofE Memo',                 icon: '*', color: '#8b5cf6', desc: 'Quality of earnings normalization bridge.' },
  { path: '/ai/redline-summarizer',        title: 'AI · Redline Summarizer',        icon: '*', color: '#8b5cf6', desc: 'Summarize material legal redline changes.' },
  { path: '/ai/integration-plan-draft',    title: 'AI · Integration Plan Draft',    icon: '*', color: '#8b5cf6', desc: 'Day-1 / 90-day / 180-day integration plan.' },
  { path: '/ai/working-capital-true-up',   title: 'AI · Working Capital True-Up',   icon: '*', color: '#8b5cf6', desc: 'NWC true-up with line items and disputes.' },
  { path: '/ai/executive-brief',           title: 'AI · Executive Brief',           icon: '*', color: '#8b5cf6', desc: 'Deal-team executive snapshot.' },
  { path: '/ai/vdr-question-router',       title: 'AI · VDR Question Router',       icon: '*', color: '#8b5cf6', desc: 'Route bidder questions, draft answer outline.' },
  { path: '/ai/regulatory-approval-check', title: 'AI · Regulatory Approval Check', icon: '*', color: '#8b5cf6', desc: 'Timelines, concerns and likely remedies.' },
  { path: '/ai/term-sheet-compare',        title: 'AI · Term Sheet Compare',        icon: '*', color: '#8b5cf6', desc: 'Side-by-side bidder comparison.' },
  { path: '/ai/closing-checklist-gen',     title: 'AI · Closing Checklist Gen',     icon: '*', color: '#8b5cf6', desc: 'Closing checklist with critical path.' },
  { path: '/ai/due-diligence-prioritize',  title: 'AI · DD Prioritize',             icon: '*', color: '#8b5cf6', desc: 'Rank DD items by value-at-risk.' },
  { path: '/ai/financial-model-sanity',    title: 'AI · Financial Model Sanity',    icon: '*', color: '#8b5cf6', desc: 'Stress tests and key model checks.' },
  { path: '/ai/anti-trust-risk',           title: 'AI · Anti-Trust Risk',           icon: '*', color: '#8b5cf6', desc: 'HHI delta, concerns, remedies.' },
  { path: '/ai/escrow-calculator',         title: 'AI · Escrow Calculator',         icon: '*', color: '#8b5cf6', desc: 'Escrow sizing, triggers, release schedule.' },
  { path: '/ai/post-close-narrative',      title: 'AI · Post-Close Narrative',      icon: '*', color: '#8b5cf6', desc: 'Board-ready post-close report.' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="dashboard-header">
        <h2>Deal Room Overview</h2>
        <p>M&A workflow + VDR snapshot · {new Date().toUTCString()}</p>
      </div>

      <h3 style={{ color: '#cbd5e1', margin: '8px 0 14px', fontSize: 15, textTransform: 'uppercase', letterSpacing: 1 }}>Capabilities</h3>
      <div className="feature-grid">
        {FEATURES.map((f) => (
          <div
            key={f.path}
            className="feature-card"
            style={{ ['--card-color']: f.color }}
            onClick={() => navigate(f.path)}
          >
            <div className="feature-card-icon" style={{ background: f.color + '22', color: f.color }}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
