import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';

// 18 CRUD pages
import DealsPage                       from './pages/DealsPage';
import TargetsPage                     from './pages/TargetsPage';
import AdvisorsPage                    from './pages/AdvisorsPage';
import VdrDocumentsPage                from './pages/VdrDocumentsPage';
import QAndAPage                       from './pages/QAndAPage';
import WorkingGroupsPage               from './pages/WorkingGroupsPage';
import TermSheetsPage                  from './pages/TermSheetsPage';
import LoisPage                        from './pages/LoisPage';
import DueDiligenceItemsPage           from './pages/DueDiligenceItemsPage';
import FinancialModelsPage             from './pages/FinancialModelsPage';
import CompsPage                       from './pages/CompsPage';
import WorkingCapitalAdjustmentsPage   from './pages/WorkingCapitalAdjustmentsPage';
import IntegrationPlansPage            from './pages/IntegrationPlansPage';
import RegulatoryFilingsPage           from './pages/RegulatoryFilingsPage';
import EscrowTermsPage                 from './pages/EscrowTermsPage';
import ClosingChecklistPage            from './pages/ClosingChecklistPage';
import PostCloseReportsPage            from './pages/PostCloseReportsPage';
import AuditLogPage                    from './pages/AuditLogPage';

// 16 AI pages
import AISynergyModelPage              from './pages/AISynergyModelPage';
import AICompTransactionPage           from './pages/AICompTransactionPage';
import AIQofeMemoPage                  from './pages/AIQofeMemoPage';
import AIRedlineSummarizerPage         from './pages/AIRedlineSummarizerPage';
import AIIntegrationPlanPage           from './pages/AIIntegrationPlanPage';
import AIWorkingCapitalPage            from './pages/AIWorkingCapitalPage';
import AIExecutiveBriefPage            from './pages/AIExecutiveBriefPage';
import AIVdrQuestionRouterPage         from './pages/AIVdrQuestionRouterPage';
import AIRegulatoryCheckPage           from './pages/AIRegulatoryCheckPage';
import AITermSheetComparePage          from './pages/AITermSheetComparePage';
import AIClosingChecklistPage          from './pages/AIClosingChecklistPage';
import AIDueDiligencePrioritizePage    from './pages/AIDueDiligencePrioritizePage';
import AIFinancialModelSanityPage      from './pages/AIFinancialModelSanityPage';
import AIAntiTrustRiskPage             from './pages/AIAntiTrustRiskPage';
import AIEscrowCalculatorPage          from './pages/AIEscrowCalculatorPage';
import AIPostCloseNarrativePage        from './pages/AIPostCloseNarrativePage';

// Admin
import WebhooksPage from './pages/WebhooksPage';

// Custom analytics views
import CustomViewsPage from './pages/CustomViewsPage';

import LoginPage from './pages/LoginPage';
import { getToken } from './services/api';

import './App.css';

import CodexCustomVizFeature from './pages/CodexCustomVizFeature';
import CodexOperationsFeature from './pages/CodexOperationsFeature';

// Pass 7 — backlog implementation: 8 new AI pages + 3 new VDR pages
import AIDocumentClassifierPage      from './pages/AIDocumentClassifierPage';
import AIQaCopilotPage               from './pages/AIQaCopilotPage';
import AIRedactionRecommenderPage    from './pages/AIRedactionRecommenderPage';
import AIDealSummaryPage             from './pages/AIDealSummaryPage';
import AIRiskFlagExtractorPage       from './pages/AIRiskFlagExtractorPage';
import AINdaMatcherPage              from './pages/AINdaMatcherPage';
import AIDcfCopilotPage              from './pages/AIDcfCopilotPage';
import AITermSheetDiffExplainerPage  from './pages/AITermSheetDiffExplainerPage';
import VdrPermissionsPage            from './pages/VdrPermissionsPage';
import VdrViewerPage                 from './pages/VdrViewerPage';
import VdrAnalyticsPage              from './pages/VdrAnalyticsPage';
import BuyerEngagementScorePage      from './pages/BuyerEngagementScorePage';

function RequireAuth({ children }) {
  const location = useLocation();
  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function ShellRoutes() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main" style={{ padding: 0 }}>
        <Topbar />
        <div style={{ padding: '24px 32px' }}>
          <Routes>
        <Route path="/codex/custom-viz" element={<CodexCustomVizFeature />} />
        <Route path="/codex/operations" element={<CodexOperationsFeature />} />

            <Route path="/" element={<Dashboard />} />

            <Route path="/deals"                       element={<DealsPage />} />
            <Route path="/targets"                     element={<TargetsPage />} />
            <Route path="/advisors"                    element={<AdvisorsPage />} />
            <Route path="/vdr-documents"               element={<VdrDocumentsPage />} />
            <Route path="/q-and-a"                     element={<QAndAPage />} />
            <Route path="/working-groups"              element={<WorkingGroupsPage />} />
            <Route path="/term-sheets"                 element={<TermSheetsPage />} />
            <Route path="/lois"                        element={<LoisPage />} />
            <Route path="/due-diligence-items"         element={<DueDiligenceItemsPage />} />
            <Route path="/financial-models"            element={<FinancialModelsPage />} />
            <Route path="/comps"                       element={<CompsPage />} />
            <Route path="/working-capital-adjustments" element={<WorkingCapitalAdjustmentsPage />} />
            <Route path="/integration-plans"           element={<IntegrationPlansPage />} />
            <Route path="/regulatory-filings"          element={<RegulatoryFilingsPage />} />
            <Route path="/escrow-terms"                element={<EscrowTermsPage />} />
            <Route path="/closing-checklist"           element={<ClosingChecklistPage />} />
            <Route path="/post-close-reports"          element={<PostCloseReportsPage />} />
            <Route path="/audit-log"                   element={<AuditLogPage />} />

            <Route path="/ai/synergy-model"             element={<AISynergyModelPage />} />
            <Route path="/ai/comp-transaction-finder"   element={<AICompTransactionPage />} />
            <Route path="/ai/qofe-memo"                 element={<AIQofeMemoPage />} />
            <Route path="/ai/redline-summarizer"        element={<AIRedlineSummarizerPage />} />
            <Route path="/ai/integration-plan-draft"    element={<AIIntegrationPlanPage />} />
            <Route path="/ai/working-capital-true-up"   element={<AIWorkingCapitalPage />} />
            <Route path="/ai/executive-brief"           element={<AIExecutiveBriefPage />} />
            <Route path="/ai/vdr-question-router"       element={<AIVdrQuestionRouterPage />} />
            <Route path="/ai/regulatory-approval-check" element={<AIRegulatoryCheckPage />} />
            <Route path="/ai/term-sheet-compare"        element={<AITermSheetComparePage />} />
            <Route path="/ai/closing-checklist-gen"     element={<AIClosingChecklistPage />} />
            <Route path="/ai/due-diligence-prioritize"  element={<AIDueDiligencePrioritizePage />} />
            <Route path="/ai/financial-model-sanity"    element={<AIFinancialModelSanityPage />} />
            <Route path="/ai/anti-trust-risk"           element={<AIAntiTrustRiskPage />} />
            <Route path="/ai/escrow-calculator"         element={<AIEscrowCalculatorPage />} />
            <Route path="/ai/post-close-narrative"      element={<AIPostCloseNarrativePage />} />

            <Route path="/webhooks" element={<WebhooksPage />} />
            <Route path="/buyer-engagement-score" element={<BuyerEngagementScorePage />} />

            <Route path="/custom-views" element={<CustomViewsPage />} />

            {/* Pass 7 — 8 new AI verbs */}
            <Route path="/ai/document-classifier"       element={<AIDocumentClassifierPage />} />
            <Route path="/ai/qa-copilot"                element={<AIQaCopilotPage />} />
            <Route path="/ai/redaction-recommender"     element={<AIRedactionRecommenderPage />} />
            <Route path="/ai/deal-summary-generator"    element={<AIDealSummaryPage />} />
            <Route path="/ai/risk-flag-extractor"       element={<AIRiskFlagExtractorPage />} />
            <Route path="/ai/nda-matcher"               element={<AINdaMatcherPage />} />
            <Route path="/ai/dcf-copilot"               element={<AIDcfCopilotPage />} />
            <Route path="/ai/term-sheet-diff-explainer" element={<AITermSheetDiffExplainerPage />} />

            {/* Pass 7 — VDR per-doc permissions, viewer, analytics */}
            <Route path="/vdr-permissions" element={<VdrPermissionsPage />} />
            <Route path="/vdr-viewer"      element={<VdrViewerPage />} />
            <Route path="/vdr-analytics"   element={<VdrAnalyticsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <ShellRoutes />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
