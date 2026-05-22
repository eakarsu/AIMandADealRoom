import React from 'react';
import { NavLink } from 'react-router-dom';
import { logout, getStoredUser } from '../services/api';

// Menu structure: Overview / Deals / VDR / Diligence / Comps / Integration / Closing / Governance / AI Modeling / AI Drafting / Admin
const DEALS_LINKS = [
  { to: '/deals',    label: 'Deals' },
  { to: '/targets',  label: 'Targets' },
  { to: '/advisors', label: 'Advisors' },
];

const VDR_LINKS = [
  { to: '/vdr-documents',   label: 'VDR Documents' },
  { to: '/vdr-viewer',      label: 'VDR Viewer' },
  { to: '/vdr-permissions', label: 'VDR Permissions' },
  { to: '/vdr-analytics',   label: 'Dataroom Analytics' },
  { to: '/q-and-a',         label: 'Q&A' },
  { to: '/working-groups',  label: 'Working Groups' },
];

const DILIGENCE_LINKS = [
  { to: '/due-diligence-items', label: 'DD Items' },
  { to: '/financial-models',    label: 'Financial Models' },
];

const COMPS_LINKS = [
  { to: '/comps',         label: 'Comp Transactions' },
  { to: '/term-sheets',   label: 'Term Sheets' },
  { to: '/lois',          label: 'LOIs' },
];

const INTEGRATION_LINKS = [
  { to: '/integration-plans',            label: 'Integration Plans' },
  { to: '/working-capital-adjustments',  label: 'Working Capital Adj' },
];

const CLOSING_LINKS = [
  { to: '/escrow-terms',       label: 'Escrow Terms' },
  { to: '/closing-checklist',  label: 'Closing Checklist' },
  { to: '/regulatory-filings', label: 'Regulatory Filings' },
  { to: '/post-close-reports', label: 'Post-Close Reports' },
];

const GOVERNANCE_LINKS = [
  { to: '/audit-log', label: 'Audit Log' },
];

const AI_MODELING_LINKS = [
  { to: '/ai/synergy-model',            label: 'AI · Synergy Model' },
  { to: '/ai/comp-transaction-finder',  label: 'AI · Comp Transaction Finder' },
  { to: '/ai/financial-model-sanity',   label: 'AI · Financial Model Sanity' },
  { to: '/ai/working-capital-true-up',  label: 'AI · Working Capital True-Up' },
  { to: '/ai/escrow-calculator',        label: 'AI · Escrow Calculator' },
  { to: '/ai/anti-trust-risk',          label: 'AI · Anti-Trust Risk' },
  { to: '/ai/regulatory-approval-check',label: 'AI · Regulatory Approval Check' },
  { to: '/ai/due-diligence-prioritize', label: 'AI · DD Prioritize' },
  { to: '/ai/dcf-copilot',              label: 'AI · DCF Copilot' },
];

const AI_DRAFTING_LINKS = [
  { to: '/ai/qofe-memo',                 label: 'AI · QofE Memo' },
  { to: '/ai/redline-summarizer',        label: 'AI · Redline Summarizer' },
  { to: '/ai/integration-plan-draft',    label: 'AI · Integration Plan Draft' },
  { to: '/ai/term-sheet-compare',        label: 'AI · Term Sheet Compare' },
  { to: '/ai/term-sheet-diff-explainer', label: 'AI · Term Sheet Diff Explainer' },
  { to: '/ai/closing-checklist-gen',     label: 'AI · Closing Checklist Gen' },
  { to: '/ai/vdr-question-router',       label: 'AI · VDR Question Router' },
  { to: '/ai/executive-brief',           label: 'AI · Executive Brief' },
  { to: '/ai/post-close-narrative',      label: 'AI · Post-Close Narrative' },
  { to: '/ai/deal-summary-generator',    label: 'AI · Deal Summary Generator' },
  { to: '/ai/document-classifier',       label: 'AI · Document Classifier' },
  { to: '/ai/qa-copilot',                label: 'AI · Q&A Copilot' },
  { to: '/ai/redaction-recommender',     label: 'AI · Redaction Recommender' },
  { to: '/ai/risk-flag-extractor',       label: 'AI · Risk Flag Extractor' },
  { to: '/ai/nda-matcher',               label: 'AI · NDA Matcher' },
];

export default function Sidebar() {
  const user = getStoredUser();
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <h1>M&amp;A DEAL ROOM</h1>
        <p>VDR · Diligence · Closing</p>
      </div>

      <NavLink to="/" end>Overview</NavLink>

      <div className="sidebar-group-label">Deals</div>
      {DEALS_LINKS.map((l) => (
        <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
      ))}

      <div className="sidebar-group-label">VDR</div>
      {VDR_LINKS.map((l) => (
        <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
      ))}

      <div className="sidebar-group-label">Diligence</div>
      {DILIGENCE_LINKS.map((l) => (
        <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
      ))}

      <div className="sidebar-group-label">Comps</div>
      {COMPS_LINKS.map((l) => (
        <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
      ))}

      <div className="sidebar-group-label">Integration</div>
      {INTEGRATION_LINKS.map((l) => (
        <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
      ))}

      <div className="sidebar-group-label">Closing</div>
      {CLOSING_LINKS.map((l) => (
        <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
      ))}

      <div className="sidebar-group-label">Governance</div>
      {GOVERNANCE_LINKS.map((l) => (
        <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
      ))}

      <div className="sidebar-group-label">AI Modeling</div>
      {AI_MODELING_LINKS.map((l) => (
        <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
      ))}

      <div className="sidebar-group-label">AI Drafting</div>
      {AI_DRAFTING_LINKS.map((l) => (
        <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
      ))}

      <div className="sidebar-group-label">Analytics</div>
      <NavLink to="/custom-views">Deal Analytics</NavLink>

      <div className="sidebar-group-label">Admin</div>
      <NavLink to="/webhooks">Webhooks</NavLink>

      <div className="sidebar-user">
        {user && (
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name || user.email}</div>
            <div className="sidebar-user-role">{user.role || 'user'}</div>
          </div>
        )}
        <button className="btn secondary sidebar-logout" onClick={logout}>Sign Out</button>
      </div>
    </nav>
  );
}
