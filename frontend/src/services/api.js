const API_BASE =
  (typeof window !== 'undefined' && window.__API_BASE__) ||
  'http://localhost:3071/api';

export { API_BASE };

const TOKEN_KEY = 'mda_token';
const USER_KEY  = 'mda_user';

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch (_) { return null; }
}
export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (_) {}
}
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}
export function setStoredUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch (_) {}
}
export function logout() {
  setToken(null);
  setStoredUser(null);
  if (typeof window !== 'undefined') {
    window.location.assign('/login');
  }
}

// Role helpers
export function getRole() {
  return (getStoredUser()?.role || 'viewer').toLowerCase();
}
export function canWrite() {
  return ['admin', 'advisor'].includes(getRole());
}
export function isAdmin() {
  return getRole() === 'admin';
}
// Backwards-compat helpers (CrudPage / Webhooks page were named for legacy roles)
export const isCommander = isAdmin;

async function request(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  let res;
  try {
    res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  } catch (e) {
    throw new Error(`Network error: ${e.message}`);
  }

  if (res.status === 401) {
    if (!url.startsWith('/auth/login')) {
      logout();
      throw new Error('Session expired');
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// Generic CRUD factory
function crud(base) {
  return {
    list:   ()       => request(`/${base}`),
    get:    (id)     => request(`/${base}/${id}`),
    create: (data)   => request(`/${base}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, d)  => request(`/${base}/${id}`, { method: 'PUT',  body: JSON.stringify(d) }),
    remove: (id)     => request(`/${base}/${id}`, { method: 'DELETE' }),
    bulkImport: (csv) => request(`/${base}/bulk-import`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/csv' },
      body: csv,
    }),
    listAttachments: (id) => request(`/${base}/${id}/attachments`),
    uploadAttachment: async (id, file) => {
      const token = getToken();
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE}/${base}/${id}/attachments`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
      return data;
    },
  };
}

// 18 CRUD entities
export const dealsApi                       = crud('deals');
export const targetsApi                     = crud('targets');
export const advisorsApi                    = crud('advisors');
export const vdrDocumentsApi                = crud('vdr-documents');
export const qAndAApi                       = crud('q-and-a');
export const workingGroupsApi               = crud('working-groups');
export const termSheetsApi                  = crud('term-sheets');
export const loisApi                        = crud('lois');
export const dueDiligenceItemsApi           = crud('due-diligence-items');
export const financialModelsApi             = crud('financial-models');
export const compsApi                       = crud('comps');
export const workingCapitalAdjustmentsApi   = crud('working-capital-adjustments');
export const integrationPlansApi            = crud('integration-plans');
export const regulatoryFilingsApi           = crud('regulatory-filings');
export const escrowTermsApi                 = crud('escrow-terms');
export const closingChecklistApi            = crud('closing-checklist');
export const postCloseReportsApi            = crud('post-close-reports');
export const auditLogApi                    = crud('audit-log');

// Dashboard
export const getDashboardStats = () => request('/dashboard');

// Auth
export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const getMe = () => request('/auth/me');

// AI endpoints — 16 verbs
export const aiSynergyModel             = (b) => request('/ai/synergy-model',             { method: 'POST', body: JSON.stringify(b || {}) });
export const aiCompTransactionFinder    = (b) => request('/ai/comp-transaction-finder',   { method: 'POST', body: JSON.stringify(b || {}) });
export const aiQofeMemo                 = (b) => request('/ai/qofe-memo',                 { method: 'POST', body: JSON.stringify(b || {}) });
export const aiRedlineSummarizer        = (b) => request('/ai/redline-summarizer',        { method: 'POST', body: JSON.stringify(b || {}) });
export const aiIntegrationPlanDraft     = (b) => request('/ai/integration-plan-draft',    { method: 'POST', body: JSON.stringify(b || {}) });
export const aiWorkingCapitalTrueUp     = (b) => request('/ai/working-capital-true-up',   { method: 'POST', body: JSON.stringify(b || {}) });
export const aiExecutiveBrief           = (b) => request('/ai/executive-brief',           { method: 'POST', body: JSON.stringify(b || {}) });
export const aiVdrQuestionRouter        = (b) => request('/ai/vdr-question-router',       { method: 'POST', body: JSON.stringify(b || {}) });
export const aiRegulatoryApprovalCheck  = (b) => request('/ai/regulatory-approval-check', { method: 'POST', body: JSON.stringify(b || {}) });
export const aiTermSheetCompare         = (b) => request('/ai/term-sheet-compare',        { method: 'POST', body: JSON.stringify(b || {}) });
export const aiClosingChecklistGen      = (b) => request('/ai/closing-checklist-gen',     { method: 'POST', body: JSON.stringify(b || {}) });
export const aiDueDiligencePrioritize   = (b) => request('/ai/due-diligence-prioritize',  { method: 'POST', body: JSON.stringify(b || {}) });
export const aiFinancialModelSanity     = (b) => request('/ai/financial-model-sanity',    { method: 'POST', body: JSON.stringify(b || {}) });
export const aiAntiTrustRisk            = (b) => request('/ai/anti-trust-risk',           { method: 'POST', body: JSON.stringify(b || {}) });
export const aiEscrowCalculator         = (b) => request('/ai/escrow-calculator',         { method: 'POST', body: JSON.stringify(b || {}) });
export const aiPostCloseNarrative       = (b) => request('/ai/post-close-narrative',      { method: 'POST', body: JSON.stringify(b || {}) });

// Pass 7 — 8 new AI verbs
export const aiDocumentClassifier       = (b) => request('/ai/document-classifier',       { method: 'POST', body: JSON.stringify(b || {}) });
export const aiQaCopilot                = (b) => request('/ai/qa-copilot',                { method: 'POST', body: JSON.stringify(b || {}) });
export const aiRedactionRecommender     = (b) => request('/ai/redaction-recommender',     { method: 'POST', body: JSON.stringify(b || {}) });
export const aiDealSummaryGenerator     = (b) => request('/ai/deal-summary-generator',    { method: 'POST', body: JSON.stringify(b || {}) });
export const aiRiskFlagExtractor        = (b) => request('/ai/risk-flag-extractor',       { method: 'POST', body: JSON.stringify(b || {}) });
export const aiNdaMatcher               = (b) => request('/ai/nda-matcher',               { method: 'POST', body: JSON.stringify(b || {}) });
export const aiDcfCopilot               = (b) => request('/ai/dcf-copilot',               { method: 'POST', body: JSON.stringify(b || {}) });
export const aiTermSheetDiffExplainer   = (b) => request('/ai/term-sheet-diff-explainer', { method: 'POST', body: JSON.stringify(b || {}) });

// Pass 7 — VDR per-doc permissions (role-based ACL)
export const vdrPermissionsApi = {
  list:        ()          => request('/vdr-permissions'),
  listForDoc:  (doc_id)    => request(`/vdr-permissions/doc/${encodeURIComponent(doc_id)}`),
  create:      (d)         => request('/vdr-permissions',           { method: 'POST', body: JSON.stringify(d) }),
  update:      (id, d)     => request(`/vdr-permissions/${id}`,     { method: 'PUT',  body: JSON.stringify(d) }),
  remove:      (id)        => request(`/vdr-permissions/${id}`,     { method: 'DELETE' }),
  check:       (doc_id, role) => request('/vdr-permissions/check', {
    method: 'POST', body: JSON.stringify({ doc_id, role }),
  }),
};

// Pass 7 — VDR in-browser viewer + analytics + audit-log export
export const vdrViewerApi = {
  fetchDoc:    (doc_id)    => request(`/vdr-viewer/doc/${encodeURIComponent(doc_id)}`),
  logView:     (doc_id, payload) => request(`/vdr-viewer/doc/${encodeURIComponent(doc_id)}/view`, {
    method: 'POST', body: JSON.stringify(payload || {}),
  }),
  analytics:        ()        => request('/vdr-viewer/analytics'),
  analyticsForDoc:  (doc_id)  => request(`/vdr-viewer/analytics/doc/${encodeURIComponent(doc_id)}`),
  auditExportUrl:   (format = 'csv') => `${API_BASE}/vdr-viewer/audit-log/export?format=${encodeURIComponent(format)}`,
};

// AI history
export const getAIHistory = (feature, limit = 25) => {
  const qs = new URLSearchParams({
    ...(feature ? { feature } : {}),
    limit: String(limit),
  }).toString();
  return request(`/ai/history?${qs}`);
};

// AI sample fills — backend returns { feature, samples: [{label, values}, ...] }
export const getAISamples = (feature) => {
  const qs = new URLSearchParams({ feature: feature || '' }).toString();
  return request(`/ai/samples?${qs}`);
};

// Notifications
export const getNotifications       = () => request('/notifications');
export const getUnreadNotifications = () => request('/notifications/unread');
export const markNotificationRead   = (id) => request(`/notifications/${id}/read`, { method: 'POST' });
export const markAllNotificationsRead = () => request('/notifications/mark-all-read', { method: 'POST' });

// Webhooks
export const webhooksApi = {
  list:    ()         => request('/webhooks'),
  create:  (d)        => request('/webhooks',          { method: 'POST', body: JSON.stringify(d) }),
  update:  (id, d)    => request(`/webhooks/${id}`,    { method: 'PUT',  body: JSON.stringify(d) }),
  remove:  (id)       => request(`/webhooks/${id}`,    { method: 'DELETE' }),
  test:    (event, payload) => request('/webhooks/test', {
    method: 'POST',
    body: JSON.stringify({ event, payload }),
  }),
  deliveries: (id)    => request(`/webhooks/${id}/deliveries`),
};
