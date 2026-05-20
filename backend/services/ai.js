// AI helper service for AIMandADealRoom
// Reads OPENROUTER_API_KEY and OPENROUTER_MODEL from:
//   1. this project's .env (already loaded by server.js)
//   2. fallback: /Users/erolakarsu/projects/beauty-wellness-ai/.env (canonical source)
// Never overwrites or wipes credentials.

const fs = require('fs');
const path = require('path');

const FALLBACK_ENV = '/Users/erolakarsu/projects/beauty-wellness-ai/.env';

function readFallbackEnv() {
  try {
    if (!fs.existsSync(FALLBACK_ENV)) return {};
    const raw = fs.readFileSync(FALLBACK_ENV, 'utf8');
    const out = {};
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let val = m[2];
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      out[m[1]] = val;
    }
    return out;
  } catch (e) {
    console.warn('[ai] fallback env read failed:', e.message);
    return {};
  }
}

function getOpenRouterCreds() {
  const fb = readFallbackEnv();
  const key = process.env.OPENROUTER_API_KEY || fb.OPENROUTER_API_KEY || '';
  const model = process.env.OPENROUTER_MODEL || fb.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5';
  return { key, model };
}

const SYSTEM_PROMPT =
  'You are a senior M&A deal advisor supporting a virtual data room and deal-execution platform. ' +
  'You provide rigorous, banker-grade reasoning on diligence, valuation (DCF, LBO, comps), QofE, ' +
  'integration planning, regulatory clearance, and closing mechanics. Always return strict JSON in the ' +
  'exact schema requested. Treat all inputs as illustrative; never produce material non-public information ' +
  'or actionable trading advice.';

function callOpenRouter(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const { key, model } = getOpenRouterCreds();
    if (!key) {
      return resolve({ error: 'OPENROUTER_API_KEY not configured' });
    }
    const https = require('https');
    const payload = JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 2000,
    });

    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Authorization: `Bearer ${key}`,
        'HTTP-Referer': 'http://localhost:3070',
        'X-Title': 'AI M&A Deal Room',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.error) {
            return resolve({ error: parsed.error.message || 'OpenRouter error', raw: body });
          }
          const content = parsed.choices?.[0]?.message?.content || '';
          resolve(content);
        } catch (e) {
          resolve({ error: 'AI response parse failed', raw: body });
        }
      });
    });
    req.on('error', (e) => resolve({ error: e.message }));
    req.write(payload);
    req.end();
  });
}

function safeJsonParse(response, fallback) {
  if (response && typeof response === 'object' && response.error) {
    return { ...fallback, error: response.error };
  }
  if (response == null) return { ...fallback, summary: '' };
  if (typeof response === 'object') return response;
  const text = String(response).trim();
  try { return JSON.parse(text); } catch (_) {}
  try {
    const start = text.indexOf('{');
    if (start !== -1) {
      let depth = 0, inStr = false, esc = false;
      for (let i = start; i < text.length; i++) {
        const ch = text[i];
        if (esc) { esc = false; continue; }
        if (ch === '\\') { esc = true; continue; }
        if (ch === '"') { inStr = !inStr; continue; }
        if (inStr) continue;
        if (ch === '{') depth++;
        else if (ch === '}') { depth--; if (depth === 0) return JSON.parse(text.slice(start, i + 1)); }
      }
    }
  } catch (_) {}
  try {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced && fenced[1]) return JSON.parse(fenced[1].trim());
  } catch (_) {}
  return { ...fallback, summary: text };
}

// ──────────────────────────────────────────────────────────────
// AI Verb 1: Synergy Model
// ──────────────────────────────────────────────────────────────
async function synergyModel(deal, context = {}) {
  const sys = `${SYSTEM_PROMPT} Build a deal synergy model. Return strict JSON:
{
  "deal": object,
  "revenue_synergies": [{ "category": string, "annual_impact_usd": number, "year_realized": number, "confidence": "low"|"medium"|"high", "rationale": string }],
  "cost_synergies": [{ "category": string, "annual_impact_usd": number, "year_realized": number, "one_time_cost_usd": number, "confidence": "low"|"medium"|"high", "rationale": string }],
  "dis_synergies": [{ "category": string, "annual_impact_usd": number, "rationale": string }],
  "total_year3_run_rate_usd": number,
  "npv_synergies_usd": number,
  "key_risks": [string],
  "summary": string
}`;
  const usr = `Deal:\n${JSON.stringify(deal, null, 2)}\nContext: ${JSON.stringify(context)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', revenue_synergies: [], cost_synergies: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 2: Comp Transaction Finder
// ──────────────────────────────────────────────────────────────
async function compTransactionFinder(target, criteria = {}) {
  const sys = `${SYSTEM_PROMPT} Suggest precedent transaction comps. Return strict JSON:
{
  "target": object,
  "comps": [{ "deal": string, "year": number, "buyer": string, "seller": string, "ev_usd": number, "multiple": number, "metric": "EV/Revenue"|"EV/EBITDA"|"EV/ARR"|"P/E"|"P/B", "rationale": string, "source": string }],
  "implied_valuation_range": { "low_usd": number, "mid_usd": number, "high_usd": number },
  "comp_quality": "low"|"medium"|"high",
  "summary": string
}`;
  const usr = `Target:\n${JSON.stringify(target, null, 2)}\nCriteria:\n${JSON.stringify(criteria)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', comps: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 3: QofE Memo
// ──────────────────────────────────────────────────────────────
async function qofeMemo(financials, context = {}) {
  const sys = `${SYSTEM_PROMPT} Draft a Quality of Earnings memo. Return strict JSON:
{
  "target": string,
  "reported_ebitda_usd": number,
  "normalizations": [{ "item": string, "adjustment_usd": number, "direction": "add"|"subtract", "rationale": string }],
  "adjusted_ebitda_usd": number,
  "ebitda_bridge_narrative": string,
  "quality_score": number,
  "red_flags": [{ "flag": string, "severity": "low"|"medium"|"high", "narrative": string }],
  "deferred_revenue_notes": string,
  "working_capital_notes": string,
  "summary": string
}`;
  const usr = `Financials:\n${JSON.stringify(financials, null, 2)}\nContext: ${JSON.stringify(context)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', normalizations: [], red_flags: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 4: Redline Summarizer
// ──────────────────────────────────────────────────────────────
async function redlineSummarizer(document, redline = '') {
  const sys = `${SYSTEM_PROMPT} Summarize redline changes against a base document. Return strict JSON:
{
  "document": string,
  "total_changes": number,
  "material_changes": [{ "section": string, "change_type": "added"|"removed"|"modified", "impact": "low"|"medium"|"high", "summary": string, "deal_implication": string }],
  "non_material_changes_count": number,
  "open_issues": [string],
  "recommended_response": string,
  "summary": string
}`;
  const usr = `Document: ${document}\nRedline:\n${redline}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', material_changes: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 5: Integration Plan Draft
// ──────────────────────────────────────────────────────────────
async function integrationPlanDraft(deal, scope = {}) {
  const sys = `${SYSTEM_PROMPT} Draft a Day-1 to Day-180 integration plan. Return strict JSON:
{
  "deal": object,
  "day_1_actions": [{ "workstream": string, "action": string, "owner": string }],
  "first_90_days": [{ "workstream": string, "milestone": string, "deadline_day": number, "owner": string }],
  "first_180_days": [{ "workstream": string, "milestone": string, "deadline_day": number, "owner": string }],
  "synergy_capture_phasing": [{ "quarter": string, "expected_run_rate_usd": number }],
  "key_risks": [{ "risk": string, "mitigation": string }],
  "tom_recommendation": string,
  "summary": string
}`;
  const usr = `Deal:\n${JSON.stringify(deal, null, 2)}\nScope:\n${JSON.stringify(scope, null, 2)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', day_1_actions: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 6: Working Capital True-Up
// ──────────────────────────────────────────────────────────────
async function workingCapitalTrueUp(target, balanceSheet = {}) {
  const sys = `${SYSTEM_PROMPT} Compute a working capital true-up. Return strict JSON:
{
  "target": string,
  "target_nwc_usd": number,
  "actual_nwc_usd": number,
  "delta_usd": number,
  "direction": "purchaser_owes"|"seller_owes"|"neutral",
  "line_items": [{ "item": string, "actual_usd": number, "target_usd": number, "delta_usd": number, "note": string }],
  "disputed_items": [{ "item": string, "amount_usd": number, "reason": string }],
  "summary": string
}`;
  const usr = `Target: ${target}\nBalance sheet:\n${JSON.stringify(balanceSheet, null, 2)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', line_items: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 7: Executive Brief
// ──────────────────────────────────────────────────────────────
async function executiveBrief(snapshot = {}) {
  const sys = `${SYSTEM_PROMPT} Produce a deal-team executive brief. Return strict JSON:
{
  "headline": string,
  "portfolio_status": string,
  "pipeline": { "sourcing": number, "diligence": number, "loi_signed": number, "term_sheet": number, "closing": number, "closed": number, "narrative": string },
  "top_deals": [{ "deal": string, "stage": string, "ev_usd": number, "narrative": string }],
  "top_risks": [{ "risk": string, "deal": string, "severity": "low"|"medium"|"high"|"critical" }],
  "decisions_required": [{ "decision": string, "deadline": string, "options": [string], "recommendation": string }],
  "next_2_weeks_outlook": string,
  "summary": string
}`;
  const usr = `Portfolio snapshot:\n${JSON.stringify(snapshot, null, 2)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response' });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 8: VDR Question Router
// ──────────────────────────────────────────────────────────────
async function vdrQuestionRouter(question, vdrContext = {}) {
  const sys = `${SYSTEM_PROMPT} Route an incoming VDR question to the right working group. Return strict JSON:
{
  "question": string,
  "primary_workstream": string,
  "secondary_workstreams": [string],
  "recommended_owner": string,
  "priority": "low"|"medium"|"high"|"urgent",
  "suggested_documents": [{ "name": string, "category": string, "why": string }],
  "draft_answer_outline": string,
  "estimated_response_hours": number,
  "summary": string
}`;
  const usr = `Question: ${question}\nVDR context:\n${JSON.stringify(vdrContext, null, 2)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', secondary_workstreams: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 9: Regulatory Approval Check
// ──────────────────────────────────────────────────────────────
async function regulatoryApprovalCheck(deal, jurisdictions = []) {
  const sys = `${SYSTEM_PROMPT} Assess regulatory approval likelihood. Return strict JSON:
{
  "deal": object,
  "required_filings": [{ "authority": string, "filing_type": string, "jurisdiction": string, "expected_review_days": number, "complexity": "low"|"medium"|"high" }],
  "approval_likelihood_pct": number,
  "key_concerns": [{ "concern": string, "authority": string, "severity": "low"|"medium"|"high" }],
  "remedies_likely": [string],
  "expected_total_timeline_days": number,
  "summary": string
}`;
  const usr = `Deal:\n${JSON.stringify(deal, null, 2)}\nJurisdictions: ${JSON.stringify(jurisdictions)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', required_filings: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 10: Term Sheet Compare
// ──────────────────────────────────────────────────────────────
async function termSheetCompare(termSheets = []) {
  const sys = `${SYSTEM_PROMPT} Compare multiple term sheets / LOIs side-by-side. Return strict JSON:
{
  "deal": string,
  "comparison_table": [{
    "term": string,
    "values_by_bidder": [{ "bidder": string, "value": string, "favorable": "yes"|"no"|"neutral" }]
  }],
  "best_offer_overall": string,
  "best_offer_rationale": string,
  "negotiation_targets": [{ "term": string, "current_best": string, "target": string }],
  "summary": string
}`;
  const usr = `Term sheets:\n${JSON.stringify(termSheets, null, 2)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', comparison_table: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 11: Closing Checklist Generator
// ──────────────────────────────────────────────────────────────
async function closingChecklistGen(deal, signingDate = '', closingDate = '') {
  const sys = `${SYSTEM_PROMPT} Generate a closing checklist. Return strict JSON:
{
  "deal": object,
  "signing_date": string,
  "closing_date": string,
  "categories": [{
    "category": string,
    "items": [{ "item": string, "owner": string, "due_date": string, "status": "open"|"in_progress"|"complete", "dependency": string }]
  }],
  "critical_path": [string],
  "estimated_close_risk": "low"|"medium"|"high",
  "summary": string
}`;
  const usr = `Deal:\n${JSON.stringify(deal, null, 2)}\nSigning: ${signingDate}\nClosing: ${closingDate}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', categories: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 12: Due Diligence Prioritize
// ──────────────────────────────────────────────────────────────
async function dueDiligencePrioritize(items = [], context = {}) {
  const sys = `${SYSTEM_PROMPT} Prioritize a list of DD items by value-at-risk and timeline impact. Return strict JSON:
{
  "prioritized": [{ "dd_id": string, "rank": number, "area": string, "value_at_risk_usd": number, "blocker_for_close": "yes"|"no"|"maybe", "rationale": string, "recommended_owner": string }],
  "low_priority_deferred": [{ "dd_id": string, "reason": string }],
  "critical_blockers": [string],
  "summary": string
}`;
  const usr = `DD items:\n${JSON.stringify(items, null, 2)}\nContext: ${JSON.stringify(context)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', prioritized: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 13: Financial Model Sanity
// ──────────────────────────────────────────────────────────────
async function financialModelSanity(model, context = {}) {
  const sys = `${SYSTEM_PROMPT} Sanity-check a financial model output. Return strict JSON:
{
  "model": object,
  "verdict": "reasonable"|"questionable"|"unreasonable",
  "key_checks": [{ "check": string, "result": "pass"|"fail"|"warn", "narrative": string }],
  "implied_metrics": { "exit_multiple": number, "money_multiple": number, "irr_pct": number },
  "stress_tests": [{ "scenario": string, "outcome": string }],
  "recommendations": [string],
  "summary": string
}`;
  const usr = `Model:\n${JSON.stringify(model, null, 2)}\nContext: ${JSON.stringify(context)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', key_checks: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 14: Anti-Trust Risk
// ──────────────────────────────────────────────────────────────
async function antiTrustRisk(deal, marketContext = {}) {
  const sys = `${SYSTEM_PROMPT} Assess anti-trust risk. Return strict JSON:
{
  "deal": object,
  "combined_market_share_pct": number,
  "hhi_pre": number,
  "hhi_post": number,
  "hhi_delta": number,
  "risk_level": "low"|"medium"|"high"|"critical",
  "concerns_by_market": [{ "market": string, "concern": string, "severity": "low"|"medium"|"high" }],
  "likely_remedies": [{ "remedy": string, "type": "divestiture"|"behavioral"|"structural", "feasibility": "low"|"medium"|"high" }],
  "second_request_probability_pct": number,
  "summary": string
}`;
  const usr = `Deal:\n${JSON.stringify(deal, null, 2)}\nMarket context:\n${JSON.stringify(marketContext, null, 2)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', concerns_by_market: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 15: Escrow Calculator
// ──────────────────────────────────────────────────────────────
async function escrowCalculator(deal, riskProfile = {}) {
  const sys = `${SYSTEM_PROMPT} Recommend escrow sizing and triggers. Return strict JSON:
{
  "deal": object,
  "recommended_escrows": [{
    "type": string,
    "amount_usd": number,
    "pct_of_deal": number,
    "term_months": number,
    "trigger": string,
    "rationale": string
  }],
  "total_escrow_usd": number,
  "total_escrow_pct": number,
  "release_schedule": [{ "month": number, "amount_usd": number, "condition": string }],
  "summary": string
}`;
  const usr = `Deal:\n${JSON.stringify(deal, null, 2)}\nRisk profile:\n${JSON.stringify(riskProfile, null, 2)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', recommended_escrows: [] });
}

// ──────────────────────────────────────────────────────────────
// AI Verb 16: Post-Close Narrative
// ──────────────────────────────────────────────────────────────
async function postCloseNarrative(deal, kpis = []) {
  const sys = `${SYSTEM_PROMPT} Produce a board-ready post-close narrative. Return strict JSON:
{
  "deal": object,
  "period": string,
  "headline": string,
  "kpi_performance": [{ "kpi": string, "value": string, "vs_plan": string, "status": "on_track"|"at_risk"|"behind" }],
  "synergy_realization_pct": number,
  "integration_health": "green"|"amber"|"red",
  "wins": [string],
  "issues": [string],
  "next_quarter_priorities": [string],
  "summary": string
}`;
  const usr = `Deal:\n${JSON.stringify(deal, null, 2)}\nKPIs:\n${JSON.stringify(kpis, null, 2)}`;
  const r = await callOpenRouter(sys, usr);
  return safeJsonParse(r, { summary: typeof r === 'string' ? r : 'No response', kpi_performance: [] });
}

module.exports = {
  callOpenRouter,
  safeJsonParse,
  synergyModel,
  compTransactionFinder,
  qofeMemo,
  redlineSummarizer,
  integrationPlanDraft,
  workingCapitalTrueUp,
  executiveBrief,
  vdrQuestionRouter,
  regulatoryApprovalCheck,
  termSheetCompare,
  closingChecklistGen,
  dueDiligencePrioritize,
  financialModelSanity,
  antiTrustRisk,
  escrowCalculator,
  postCloseNarrative,
};
