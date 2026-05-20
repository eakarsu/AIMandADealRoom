const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const ai = require('../services/ai');

async function record(feature, input, output) {
  try {
    await pool.query(
      'INSERT INTO ai_results (feature, input, output) VALUES ($1, $2, $3)',
      [feature, input || {}, output || {}]
    );
  } catch (e) {
    console.warn(`[ai] failed to record ${feature}:`, e.message);
  }
}

// ──────────────────────────────────────────────────────────────
// Sample fills — realistic M&A scenarios for each AI verb.
// Returned values map 1:1 to the field `key`s used by the frontend
// AI page components (see frontend/src/pages/AI*Page.js).
// ──────────────────────────────────────────────────────────────
const SAMPLES = {
  'synergy-model': [
    {
      label: 'Verdant Foods + Smucker — consumer roll-up',
      values: {
        deal_summary: 'Smucker acquires Verdant Foods Holdings ($640M EV) to expand premium frozen-food shelf presence in North America. Combined entity 14% category share.',
        context_notes: 'Overlapping DSD routes in 22 metro markets; shared cold-chain network; modest revenue cross-sell via Smucker private-label customers.',
      },
    },
    {
      label: 'Atlas Renewable + Brookfield — platform extension',
      values: {
        deal_summary: 'Brookfield Renewable acquires Atlas Renewable Power ($2.2B EV) — 1.4 GW Spanish solar + storage portfolio with 12-year PPA backlog.',
        context_notes: 'Brookfield already has 800 MW Iberian operating team; O&M consolidation feasible. EUR-denominated PPAs hedged. Integration of Spanish regulatory team.',
      },
    },
    {
      label: 'Quantum Edge + Vista — SaaS platform play',
      values: {
        deal_summary: 'Vista Equity acquires Quantum Edge Analytics ($1.25B EV; $310M ARR). Plug into Vista enterprise GTM portfolio.',
        context_notes: 'High SaaS gross margin (78%); CSM cost reductions via Vista shared services. Cross-sell to 11 Vista portcos using business intelligence stack.',
      },
    },
    {
      label: 'Sterling Aerospace + TransDigm — aero parts',
      values: {
        deal_summary: 'TransDigm acquires Sterling Aerospace Parts ($980M EV) — proprietary aerospace components with aftermarket attach.',
        context_notes: 'Pricing optimization on 240 SKUs in TransDigm playbook; SG&A consolidation; manufacturing overhead absorption at Sterling Cleveland plant.',
      },
    },
    {
      label: 'Polaris EV + Toyota Tsusho — drivetrain',
      values: {
        deal_summary: 'Toyota Tsusho acquires Polaris EV Drivetrain ($1.1B EV). Captive supplier role within Toyota Group EV roadmap.',
        context_notes: 'Toyota EV demand replaces non-captive OEM exposure; Aichi plant capex optimization; engineering merge with Toyota Powertrain.',
      },
    },
  ],

  'comp-transaction-finder': [
    {
      label: 'Helios Therapeutics — mid-cap biotech',
      values: {
        target_name: 'Helios Therapeutics',
        sector: 'biotech (rare disease)',
        metric_preference: 'EV/Revenue (pre-revenue heavy weight on EV/peak-sales)',
        notes: 'Two phase-III rare disease assets; $420M revenue TTM; partnered with Pfizer on Helios-002.',
      },
    },
    {
      label: 'Quantum Edge — enterprise SaaS',
      values: {
        target_name: 'Quantum Edge Analytics',
        sector: 'enterprise SaaS (analytics)',
        metric_preference: 'EV/ARR',
        notes: '$310M ARR, 122% NDR, 78% gross margin, rule-of-50 (28% growth + 22% FCF margin).',
      },
    },
    {
      label: 'Crescent Capital Bank — US regional bank',
      values: {
        target_name: 'Crescent Capital Bank',
        sector: 'US regional bank',
        metric_preference: 'P/B and P/E',
        notes: '$48B assets, $540M net income, 11.2% CET1, deposit franchise concentrated in Southeast US.',
      },
    },
    {
      label: 'Atlas Renewable — Iberian renewables',
      values: {
        target_name: 'Atlas Renewable Power',
        sector: 'renewable energy (solar + storage)',
        metric_preference: 'EV/EBITDA',
        notes: '1.4 GW Spanish operating, $220M EBITDA, contracted PPA tenor 12yr, merchant exposure 18%.',
      },
    },
    {
      label: 'Harbor Insurance — reinsurance',
      values: {
        target_name: 'Harbor Insurance Holdings',
        sector: 'specialty insurance (Bermuda)',
        metric_preference: 'P/B and P/E',
        notes: '$880M revenue, $198M EBITDA, combined ratio 92%, FL hurricane exposure 18% of net WP.',
      },
    },
  ],

  'qofe-memo': [
    {
      label: 'Sterling Aerospace QofE',
      values: {
        target: 'Sterling Aerospace Parts',
        financials_notes: 'Reported EBITDA $90M FY2025. Management adjustments: +$6M for non-recurring legal settlement, +$4M for one-time facility move, -$2M for owner compensation differential.',
        context: 'Standard Deloitte FAS workpapers reviewed; revenue rec policy conservative; no channel stuffing.',
      },
    },
    {
      label: 'Helios Therapeutics QofE',
      values: {
        target: 'Helios Therapeutics',
        financials_notes: 'Reported EBITDA $78M FY2025. Adjustments include reclassifying $12M R&D capitalization as expense, $5M Pfizer milestone treated as non-recurring, normalizing -$8M one-time clinical write-offs.',
        context: 'Biotech with milestone revenue lumpiness; pipeline burn rate stable; deferred revenue from Pfizer partnership $34M.',
      },
    },
    {
      label: 'Northwind Logistics QofE',
      values: {
        target: 'Northwind Logistics Group',
        financials_notes: 'Reported EBITDA $145M FY2025. Add-backs: +$8M fuel hedge mark, -$11M deferred customer rebates, +$3M IT separation prep costs.',
        context: 'Asset-heavy 3PL; lease accounting under ASC 842 reviewed; customer concentration top-10 = 41%.',
      },
    },
    {
      label: 'Quantum Edge QofE',
      values: {
        target: 'Quantum Edge Analytics',
        financials_notes: 'Reported EBITDA $88M. SaaS metrics: $310M ARR, 122% NDR, magic number 1.4. Capitalized contract acquisition costs reviewed under ASC 606.',
        context: 'Subscription revenue 94%, services 6%; bookings ahead of revenue by $42M; sales commission deferral.',
      },
    },
    {
      label: 'Crescent Capital Bank QofE',
      values: {
        target: 'Crescent Capital Bank',
        financials_notes: 'Pre-provision net revenue $720M. CECL provision $124M. NIM 3.6%. Efficiency ratio 56%. OCC consent order Q2-2024 disclosed.',
        context: 'Bank QofE focuses on NIM sustainability, deposit beta, and loan loss reserve adequacy versus DFAST.',
      },
    },
  ],

  'redline-summarizer': [
    {
      label: 'SPA — purchase price + indemnity',
      values: {
        document: 'Stock Purchase Agreement — Sterling Aerospace v6',
        redline: 'Seller deleted MAC clause carve-out for cybersecurity events; buyer added new escrow holdback of $20M for FY2026 EBITDA shortfall; survival period for fundamental reps extended from 3 to 6 years; tax indemnity cap raised from $40M to $55M.',
      },
    },
    {
      label: 'NDA — exclusivity',
      values: {
        document: 'Non-Disclosure & Exclusivity Agreement — Helios Therapeutics',
        redline: 'Exclusivity period reduced from 60 days to 45 days; standstill carved out for white-knight defense; remedy for breach changed from injunction-only to injunction + $25M liquidated damages.',
      },
    },
    {
      label: 'LOI — earn-out terms',
      values: {
        document: 'Letter of Intent — Polaris EV Drivetrain',
        redline: 'Earn-out tied to 2027 EBITDA threshold lowered from $140M to $122M; payout cap raised from $80M to $110M; dispute resolution shifted from PWC to E&Y; seller protection for operational interference added.',
      },
    },
    {
      label: 'Stockholders Agreement — governance',
      values: {
        document: 'Stockholders Agreement — Atlas Renewable Power',
        redline: 'Board size reduced from 11 to 9; founder retains 2 seats but loses tag-along right above 25% sale; veto rights expanded over $50M capex; transfer restrictions modified to permit estate planning transfers.',
      },
    },
    {
      label: 'Disclosure Schedule — DD findings',
      values: {
        document: 'Disclosure Schedule — Crescent Capital Bank',
        redline: 'Added new disclosure of pending HUD whistleblower claim ($14M est.); updated OCC consent order timeline; removed two material customer disputes that were resolved; added 3 new pending FLSA class actions.',
      },
    },
  ],

  'integration-plan-draft': [
    {
      label: 'Sterling Aerospace Day-1 to Day-180',
      values: {
        deal_summary: 'TransDigm acquires Sterling Aerospace Parts ($980M EV). Aero parts roll-up with proprietary content.',
        scope_notes: 'Functional integration: finance, IT, HR, commercial pricing, manufacturing footprint. No customer-facing brand change in year 1.',
      },
    },
    {
      label: 'Atlas Renewable platform integration',
      values: {
        deal_summary: 'Brookfield Renewable acquires Atlas Renewable Power ($2.2B EV). Spanish solar + storage platform.',
        scope_notes: 'Integrate into Brookfield Iberian platform; consolidate O&M; harmonize SCADA; legal entity rationalization in Madrid.',
      },
    },
    {
      label: 'Quantum Edge SaaS tuck-in',
      values: {
        deal_summary: 'Vista Equity acquires Quantum Edge Analytics ($1.25B EV; $310M ARR). Operating platform tuck-in.',
        scope_notes: 'Vista Value Creation Office leads; standardize on Vista back-office (NetSuite); deploy Vista RevOps benchmarks; G&A optimization 12-month target.',
      },
    },
    {
      label: 'Polaris EV captive supplier integration',
      values: {
        deal_summary: 'Toyota Tsusho acquires Polaris EV Drivetrain ($1.1B EV). Captive supplier within Toyota Group.',
        scope_notes: 'Engineering integration with Toyota Powertrain; Aichi plant consolidation; ERP migration to Toyota CIS; commercial reorientation to captive demand.',
      },
    },
    {
      label: 'Northwind Logistics 3PL integration',
      values: {
        deal_summary: 'Strategic acquires Northwind Logistics Group ($920M EV). Fleet + customer book + DC network.',
        scope_notes: 'Customer migration top-20 first; TMS consolidation Q2 2027; DC network rationalization 3 of 18 sites; fleet utilization push from 71% to 79%.',
      },
    },
  ],

  'working-capital-true-up': [
    {
      label: 'Sterling Aerospace NWC true-up',
      values: {
        target: 'Sterling Aerospace Parts',
        balance_sheet_notes: 'Target NWC: $112M (peg). Closing NWC estimate: $124M. Inventory +$8M, AR +$5M, AP +$1M.',
      },
    },
    {
      label: 'Helios Therapeutics NWC true-up',
      values: {
        target: 'Helios Therapeutics',
        balance_sheet_notes: 'Target NWC: $58M. Closing NWC: $46M. Deferred revenue -$8M (Pfizer milestone earned), prepaid R&D -$4M.',
      },
    },
    {
      label: 'Northwind Logistics NWC true-up',
      values: {
        target: 'Northwind Logistics Group',
        balance_sheet_notes: 'Target NWC: $84M. Closing NWC: $61M. Customer rebate accruals +$22M (disputed), AR aging worsening.',
      },
    },
    {
      label: 'Quantum Edge NWC true-up',
      values: {
        target: 'Quantum Edge Analytics',
        balance_sheet_notes: 'Target NWC: -$48M (negative because of unearned revenue). Closing NWC: -$62M. Unearned revenue grew $15M (good news, but lowers NWC).',
      },
    },
    {
      label: 'Atlas Renewable NWC true-up',
      values: {
        target: 'Atlas Renewable Power',
        balance_sheet_notes: 'Target NWC: $34M. Closing NWC: $26M. Capex accruals lower than expected, PPA receivables down due to Q2 settlement timing.',
      },
    },
  ],

  'executive-brief': [
    { label: 'Default snapshot — full portfolio', values: { notes: '' } },
    { label: 'Bias toward closing-stage deals',   values: { notes: 'Focus on closing-stage deals (Atlas Renewable, Polaris EV, Sterling Aerospace).' } },
    { label: 'Bias toward regulatory risk',       values: { notes: 'Focus on deals with regulatory complexity (Crescent Bank, Atlas Renewable, Pioneer Auto).' } },
    { label: 'Bias toward LP / fundraising lens', values: { notes: 'Bias the brief toward LP reporting: realized MOIC, unrealized gains, deployment pace YTD.' } },
    { label: 'Bias toward sector concentration',  values: { notes: 'Highlight sector concentration and pipeline gaps; especially aerospace, EV, and US regional banks.' } },
  ],

  'vdr-question-router': [
    {
      label: 'Customer concentration question',
      values: {
        question: 'What % of revenue is concentrated in the top-5 customers as of FY2025? Provide a breakdown by customer and product line.',
        vdr_notes: 'Northwind Logistics — Top-10 = 41%, contains FedEx, Walmart, Maersk.',
      },
    },
    {
      label: 'Cyber posture question',
      values: {
        question: 'Provide SOC2 Type II report and last 24 months of penetration test summaries; confirm any unreported security incidents.',
        vdr_notes: 'Nimbus Cloud Hosting — SOC2 Type II report uploaded; Mandiant cyber DD complete.',
      },
    },
    {
      label: 'Regulatory consent order question',
      values: {
        question: 'Provide full text of the OCC consent order from Q2 2024 and any subsequent quarterly remediation status reports.',
        vdr_notes: 'Crescent Capital Bank — OCC consent order under regulatory DD workstream led by S&C.',
      },
    },
    {
      label: 'IP / patent question',
      values: {
        question: 'Please confirm freedom-to-operate analysis on the next-gen EV motor design; provide any third-party patent challenges.',
        vdr_notes: 'Polaris EV Drivetrain — IP schedule uploaded; Wilson Sonsini doing FTO.',
      },
    },
    {
      label: 'Clinical trial timeline question',
      values: {
        question: 'Provide updated Gantt chart for Helios-001 Phase III enrollment and confirm timeline to BLA submission.',
        vdr_notes: 'Helios Therapeutics — Clinical DD led by IQVIA; enrollment behind plan ~14%.',
      },
    },
  ],

  'regulatory-approval-check': [
    {
      label: 'Crescent Bank — US bank regulatory',
      values: {
        deal_summary: 'KKR acquires Crescent Capital Bank ($3.4B EV). Private equity acquisition of bank holding company.',
        jurisdictions: 'Federal Reserve, OCC, FDIC, state regulators (GA, FL, SC, NC, TN)',
      },
    },
    {
      label: 'Atlas Renewable — EU merger control',
      values: {
        deal_summary: 'Brookfield acquires Atlas Renewable Power ($2.2B) — Spanish solar + storage.',
        jurisdictions: 'European Commission (DG COMP), Spanish CNMC, US DOJ HSR',
      },
    },
    {
      label: 'Polaris EV — Japan + US',
      values: {
        deal_summary: 'Toyota Tsusho acquires Polaris EV Drivetrain ($1.1B).',
        jurisdictions: 'Japan Fair Trade Commission, US DOJ Antitrust (HSR), CFIUS (target has US engineering workforce)',
      },
    },
    {
      label: 'Sterling Aerospace — CFIUS + HSR',
      values: {
        deal_summary: 'TransDigm acquires Sterling Aerospace Parts ($980M). Aero parts with DoD content.',
        jurisdictions: 'CFIUS (DoD covered contracts), US DOJ Antitrust (HSR), UK CMA (UK subsidiary)',
      },
    },
    {
      label: 'Pioneer Auto — Germany + EU',
      values: {
        deal_summary: 'ZF acquires Pioneer Auto Components ($580M) — German Tier-1 auto supplier.',
        jurisdictions: 'Bundeskartellamt, BaFin, European Commission, Chinese SAMR (China revenue threshold)',
      },
    },
  ],

  'term-sheet-compare': [
    {
      label: 'Helios Therapeutics — 2 bids',
      values: {
        deal: 'Helios Therapeutics',
        term_sheets_json: JSON.stringify([
          { bidder: 'GSK plc',    value_usd: 1850000000, exclusivity_days: 45, earn_out: 'None', escrow_pct: 8, financing: 'Cash', conditions: 'CFIUS, HSR, antitrust' },
          { bidder: 'Sanofi SA',  value_usd: 1800000000, exclusivity_days: 30, earn_out: '$100M tied to Helios-001 BLA approval', escrow_pct: 6, financing: 'Cash + stock 70/30', conditions: 'HSR, EU merger, Sanofi board approval' },
        ], null, 2),
      },
    },
    {
      label: 'Polaris EV — 2 bids',
      values: {
        deal: 'Polaris EV Drivetrain',
        term_sheets_json: JSON.stringify([
          { bidder: 'Toyota Tsusho', value_usd: 1100000000, exclusivity_days: 75, earn_out: '$60M tied to 2027 EBITDA', escrow_pct: 5, financing: 'Cash', conditions: 'JFTC, HSR, CFIUS' },
          { bidder: 'BorgWarner',    value_usd: 1080000000, exclusivity_days: 30, earn_out: 'None', escrow_pct: 8, financing: 'Cash + term loan', conditions: 'HSR, lender consent' },
        ], null, 2),
      },
    },
    {
      label: 'Atlas Renewable — 2 bids',
      values: {
        deal: 'Atlas Renewable Power',
        term_sheets_json: JSON.stringify([
          { bidder: 'Brookfield Renewable', value_usd: 2200000000, exclusivity_days: 90, earn_out: 'None', escrow_pct: 3, financing: 'Cash from fund commitments', conditions: 'EU merger, Spanish CNMC, HSR' },
          { bidder: 'EDF Renewables',       value_usd: 2150000000, exclusivity_days: 45, earn_out: '$50M tied to merchant power realization', escrow_pct: 5, financing: 'Cash + project finance', conditions: 'EU merger, French foreign investment, HSR' },
        ], null, 2),
      },
    },
    {
      label: 'Northwind Logistics — 2 bids',
      values: {
        deal: 'Northwind Logistics Group',
        term_sheets_json: JSON.stringify([
          { bidder: 'Maersk Logistics', value_usd: 920000000, exclusivity_days: 60, earn_out: 'None', escrow_pct: 6, financing: 'Cash', conditions: 'HSR' },
          { bidder: 'XPO Logistics',    value_usd: 880000000, exclusivity_days: 30, earn_out: '$40M tied to fleet utilization', escrow_pct: 8, financing: 'Cash + bridge', conditions: 'HSR, financing condition' },
        ], null, 2),
      },
    },
    {
      label: 'Crescent Capital Bank — single bid view',
      values: {
        deal: 'Crescent Capital Bank',
        term_sheets_json: JSON.stringify([
          { bidder: 'KKR Financial Services', value_usd: 3400000000, exclusivity_days: 60, earn_out: 'None', escrow_pct: 5, financing: 'KKR fund + co-invest', conditions: 'Fed CIC, OCC, FDIC, state, antitrust' },
        ], null, 2),
      },
    },
  ],

  'closing-checklist-gen': [
    {
      label: 'Sterling Aerospace closing',
      values: {
        deal_summary: 'TransDigm acquires Sterling Aerospace Parts ($980M).',
        signing_date: '2026-05-15',
        closing_date: '2026-06-30',
      },
    },
    {
      label: 'Atlas Renewable closing',
      values: {
        deal_summary: 'Brookfield acquires Atlas Renewable Power ($2.2B) — Spanish solar + storage.',
        signing_date: '2026-04-22',
        closing_date: '2026-07-15',
      },
    },
    {
      label: 'Polaris EV closing',
      values: {
        deal_summary: 'Toyota Tsusho acquires Polaris EV Drivetrain ($1.1B).',
        signing_date: '2026-04-30',
        closing_date: '2026-08-15',
      },
    },
    {
      label: 'Northwind Logistics closing',
      values: {
        deal_summary: 'Maersk acquires Northwind Logistics ($920M).',
        signing_date: '2026-06-01',
        closing_date: '2026-09-30',
      },
    },
    {
      label: 'Crescent Bank closing (regulatory)',
      values: {
        deal_summary: 'KKR acquires Crescent Capital Bank ($3.4B). Long regulatory runway.',
        signing_date: '2026-05-30',
        closing_date: '2027-03-31',
      },
    },
  ],

  'due-diligence-prioritize': [
    { label: 'Use current DD items (default)', values: { notes: '' } },
    { label: 'Bias toward financial findings', values: { notes: 'Weight financial DD items higher; deprioritize HR.' } },
    { label: 'Bias toward regulatory blockers', values: { notes: 'Weight regulatory and EH&S items higher; treat as binary blockers.' } },
    { label: 'Bias toward sell-side perspective', values: { notes: 'Prioritize items the seller can resolve quickly to keep deal momentum.' } },
    { label: 'Bias toward LP reporting',       values: { notes: 'Bias prioritization toward items LPs will ask about in next quarterly meeting.' } },
  ],

  'financial-model-sanity': [
    {
      label: 'Northwind Logistics LBO',
      values: {
        model_summary: 'Northwind LBO base case: $920M EV, 7.0x entry, 6.5x exit Year 5, 22% IRR, 2.7x MoM. Revenue CAGR 4.8%, EBITDA margin 14.0% → 16.5%.',
        context: 'PE acquirer, 50% debt, SOFR + 425bps. Customer concentration top-10 = 41%. Fleet utilization upside.',
      },
    },
    {
      label: 'Sterling Aerospace LBO + QofE',
      values: {
        model_summary: 'Sterling LBO base case: $980M EV, 11.7x entry, 11.0x exit Year 5, 21% IRR, 2.5x MoM. QofE-adj EBITDA $84M → $112M Y5.',
        context: 'Strategic acquirer with cost synergies; pricing optimization on 240 SKUs; manufacturing absorption upside.',
      },
    },
    {
      label: 'Quantum Edge SaaS DCF',
      values: {
        model_summary: 'Quantum Edge DCF: $1.25B EV at 4.0x EV/ARR (Year 0). 25% revenue CAGR Y1-Y5, exit at 7x EV/ARR Year 5, 30% IRR.',
        context: 'Rule-of-50, NDR 122%, terminal margin 35%, WACC 11%.',
      },
    },
    {
      label: 'Atlas Renewable project finance',
      values: {
        model_summary: 'Atlas Renewable PF model: $2.2B EV, 10x EV/EBITDA, 13% project IRR, 60% leverage, DSCR 1.65x.',
        context: 'PPA blended €58/MWh through 2035; merchant exposure $18/MWh downside; FX hedged.',
      },
    },
    {
      label: 'Crescent Bank DDM',
      values: {
        model_summary: 'Crescent DDM: $3.4B EV at 1.6x P/B, 8.0x P/E forward. Cost of equity 11.5%, ROE 14.1%, payout 35%.',
        context: 'Tier 1 capital 11.2%; CECL build $124M FY2025; NIM 3.6%; OCC consent order ongoing.',
      },
    },
  ],

  'anti-trust-risk': [
    {
      label: 'Atlas Renewable — EU + Spain',
      values: {
        deal_summary: 'Brookfield Renewable acquires Atlas Renewable Power. Combined Spanish solar share ~8%.',
        market_context: 'Iberian renewable market fragmented; top-5 = 38% share. Combined HHI delta modest.',
      },
    },
    {
      label: 'Northwind Logistics — US 3PL',
      values: {
        deal_summary: 'Maersk acquires Northwind. Combined US road freight share ~6%.',
        market_context: 'US road freight extremely fragmented; HHI < 800 pre and post. Lane-level overlaps in 12 metros.',
      },
    },
    {
      label: 'Polaris EV — auto components',
      values: {
        deal_summary: 'Toyota Tsusho acquires Polaris EV Drivetrain.',
        market_context: 'EV drivetrain supplier market 5-6 global players (Bosch, ZF, BorgWarner, Polaris, Magna). Combined would be #3.',
      },
    },
    {
      label: 'Sterling Aerospace — proprietary parts',
      values: {
        deal_summary: 'TransDigm acquires Sterling. Concerns about repeat TransDigm aero roll-up scrutiny.',
        market_context: 'TransDigm prior settlements with DoD on overpricing; FTC sensitivity to single-source proprietary aerospace parts.',
      },
    },
    {
      label: 'Crescent Bank — US regional',
      values: {
        deal_summary: 'KKR acquires Crescent Capital Bank. Geographic deposit overlap with KKR portfolio bank in 3 MSAs.',
        market_context: 'HHI overlap in Atlanta, Charlotte, Tampa MSAs requires branch divestiture analysis.',
      },
    },
  ],

  'escrow-calculator': [
    {
      label: 'Sterling Aerospace — strategic buyer',
      values: {
        deal_summary: 'TransDigm acquires Sterling Aerospace ($980M). Strategic buyer, mature target.',
        risk_profile: 'Low operational risk; medium IP/regulatory risk; tax exposure moderate.',
      },
    },
    {
      label: 'Crescent Bank — regulatory heavy',
      values: {
        deal_summary: 'KKR acquires Crescent Capital Bank ($3.4B).',
        risk_profile: 'High regulatory risk (OCC consent order); medium reserve adequacy risk; meaningful FLSA litigation exposure.',
      },
    },
    {
      label: 'Helios Therapeutics — milestone heavy',
      values: {
        deal_summary: 'GSK acquires Helios Therapeutics ($1.85B). Biotech with pipeline-dependent value.',
        risk_profile: 'High clinical risk (Phase III enrollment); medium IP risk; low tax exposure.',
      },
    },
    {
      label: 'Polaris EV — operational risk',
      values: {
        deal_summary: 'Toyota Tsusho acquires Polaris EV ($1.1B).',
        risk_profile: 'Medium operational risk (EV validation gates); medium customer concentration risk; low tax exposure.',
      },
    },
    {
      label: 'Atlas Renewable — operating PPA',
      values: {
        deal_summary: 'Brookfield acquires Atlas Renewable ($2.2B). Operating assets.',
        risk_profile: 'Low operational risk; medium environmental risk; low tax exposure.',
      },
    },
  ],

  'post-close-narrative': [
    {
      label: 'Sterling Aerospace — Q3 2026 post-close',
      values: {
        deal_summary: 'Sterling Aerospace post-close Q3 2026. Closed Jun 2026.',
        kpi_notes: 'Adj EBITDA 102.4% of plan; synergy capture $14.2M run-rate (target $18M Y1); customer retention 96.8%; integration on schedule.',
      },
    },
    {
      label: 'Atlas Renewable — Q3 2026',
      values: {
        deal_summary: 'Atlas Renewable post-close Q3 2026. Closed Jul 2026.',
        kpi_notes: 'Plant availability 94.1%; PPA realized price €57.20/MWh; merchant exposure realized below downside scenario; environmental remediation on plan.',
      },
    },
    {
      label: 'Polaris EV — Q4 2026',
      values: {
        deal_summary: 'Polaris EV post-close Q4 2026. Behind plan on production.',
        kpi_notes: 'EV unit production 18,400 units (target 22,000); cost-per-unit $3,840 (target $3,600); engineering integration delayed; supply chain issues at Aichi.',
      },
    },
    {
      label: 'Quantum Edge — Q4 2026',
      values: {
        deal_summary: 'Quantum Edge post-close Q4 2026. SaaS scale-up.',
        kpi_notes: 'NDR 119%; ARR $352M (target $345M); gross margin 79.1%; CSM cost reductions per Vista playbook delivered.',
      },
    },
    {
      label: 'Crescent Bank — Q1 2027',
      values: {
        deal_summary: 'Crescent Bank post-close Q1 2027.',
        kpi_notes: 'CET1 10.4%; cost-to-income 54.1% (above target 52%); OCC consent order remediation 60% complete; branch network rationalization announced.',
      },
    },
  ],
};

// GET /api/ai/samples?feature=<verb>
router.get('/samples', (req, res) => {
  try {
    const feature = (req.query.feature || '').toString();
    if (!feature) {
      return res.json({ features: Object.keys(SAMPLES) });
    }
    const samples = SAMPLES[feature];
    if (!samples) {
      return res.status(404).json({ error: `unknown feature: ${feature}` });
    }
    res.json({ feature, samples });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/ai/history?feature=<name>&limit=<n>
router.get('/history', async (req, res) => {
  try {
    const feature = (req.query.feature || '').toString();
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 200);
    let r;
    if (feature) {
      r = await pool.query(
        'SELECT id, feature, input, output, created_at FROM ai_results WHERE feature = $1 ORDER BY created_at DESC LIMIT $2',
        [feature, limit]
      );
    } else {
      r = await pool.query(
        'SELECT id, feature, input, output, created_at FROM ai_results ORDER BY created_at DESC LIMIT $1',
        [limit]
      );
    }
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 1. POST /api/ai/synergy-model
router.post('/synergy-model', async (req, res) => {
  try {
    const { deal_summary, deal, context, context_notes } = req.body || {};
    const dealInput = deal || { summary: deal_summary || 'Use current portfolio defaults' };
    const ctx = context || { notes: context_notes || '' };
    const result = await ai.synergyModel(dealInput, ctx);
    await record('synergy-model', { deal: dealInput, context: ctx }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. POST /api/ai/comp-transaction-finder
router.post('/comp-transaction-finder', async (req, res) => {
  try {
    const { target_name, sector, metric_preference, notes, target, criteria } = req.body || {};
    const tgt = target || { name: target_name, sector };
    const crit = criteria || { metric_preference, notes };
    const result = await ai.compTransactionFinder(tgt, crit);
    await record('comp-transaction-finder', { target: tgt, criteria: crit }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 3. POST /api/ai/qofe-memo
router.post('/qofe-memo', async (req, res) => {
  try {
    const { target, financials_notes, context, financials } = req.body || {};
    if (!target && !financials) return res.status(400).json({ error: 'target is required' });
    const fin = financials || { target, notes: financials_notes };
    const ctx = typeof context === 'string' ? { notes: context } : (context || {});
    const result = await ai.qofeMemo(fin, ctx);
    await record('qofe-memo', { financials: fin, context: ctx }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 4. POST /api/ai/redline-summarizer
router.post('/redline-summarizer', async (req, res) => {
  try {
    const { document, redline } = req.body || {};
    if (!document) return res.status(400).json({ error: 'document is required' });
    const result = await ai.redlineSummarizer(document, redline || '');
    await record('redline-summarizer', { document, redline_length: (redline || '').length }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 5. POST /api/ai/integration-plan-draft
router.post('/integration-plan-draft', async (req, res) => {
  try {
    const { deal_summary, scope_notes, deal, scope } = req.body || {};
    const dealInput = deal || { summary: deal_summary };
    const sc = scope || { notes: scope_notes };
    const result = await ai.integrationPlanDraft(dealInput, sc);
    await record('integration-plan-draft', { deal: dealInput, scope: sc }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 6. POST /api/ai/working-capital-true-up
router.post('/working-capital-true-up', async (req, res) => {
  try {
    const { target, balance_sheet_notes, balance_sheet } = req.body || {};
    if (!target) return res.status(400).json({ error: 'target is required' });
    const bs = balance_sheet || { notes: balance_sheet_notes };
    const result = await ai.workingCapitalTrueUp(target, bs);
    await record('working-capital-true-up', { target, balance_sheet: bs }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 7. POST /api/ai/executive-brief
router.post('/executive-brief', async (req, res) => {
  try {
    const [deals, lois, ts, dd, rf, cl] = await Promise.all([
      pool.query("SELECT COUNT(*) FILTER (WHERE stage='sourcing') AS sourcing, COUNT(*) FILTER (WHERE stage='diligence') AS diligence, COUNT(*) FILTER (WHERE stage='loi_signed') AS loi_signed, COUNT(*) FILTER (WHERE stage='term_sheet') AS term_sheet, COUNT(*) FILTER (WHERE stage='closing') AS closing, COUNT(*) FILTER (WHERE stage='closed') AS closed, COUNT(*) AS total FROM deals"),
      pool.query("SELECT COUNT(*) FILTER (WHERE status='signed') AS signed, COUNT(*) AS total FROM lois"),
      pool.query("SELECT COUNT(*) FILTER (WHERE status='signed') AS signed, COUNT(*) AS total FROM term_sheets"),
      pool.query("SELECT COUNT(*) FILTER (WHERE status='open') AS open, COUNT(*) AS total FROM due_diligence_items"),
      pool.query("SELECT COUNT(*) FILTER (WHERE status='under_review') AS under_review, COUNT(*) AS total FROM regulatory_filings"),
      pool.query("SELECT COUNT(*) FILTER (WHERE status='complete') AS complete, COUNT(*) FILTER (WHERE status='open') AS open, COUNT(*) AS total FROM closing_checklist"),
    ]);
    const snapshot = {
      deals: deals.rows[0],
      lois: lois.rows[0],
      term_sheets: ts.rows[0],
      due_diligence: dd.rows[0],
      regulatory_filings: rf.rows[0],
      closing_checklist: cl.rows[0],
      ...(req.body?.notes ? { notes: req.body.notes } : {}),
    };
    const result = await ai.executiveBrief(snapshot);
    const out = { snapshot, brief: result };
    await record('executive-brief', { notes: req.body?.notes || null }, out);
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 8. POST /api/ai/vdr-question-router
router.post('/vdr-question-router', async (req, res) => {
  try {
    const { question, vdr_notes, vdr_context } = req.body || {};
    if (!question) return res.status(400).json({ error: 'question is required' });
    const ctx = vdr_context || { notes: vdr_notes };
    const result = await ai.vdrQuestionRouter(question, ctx);
    await record('vdr-question-router', { question, vdr_context: ctx }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 9. POST /api/ai/regulatory-approval-check
router.post('/regulatory-approval-check', async (req, res) => {
  try {
    const { deal_summary, jurisdictions, deal } = req.body || {};
    const dealInput = deal || { summary: deal_summary };
    let jurs = jurisdictions;
    if (typeof jurs === 'string') jurs = jurs.split(',').map((s) => s.trim()).filter(Boolean);
    if (!Array.isArray(jurs)) jurs = [];
    const result = await ai.regulatoryApprovalCheck(dealInput, jurs);
    await record('regulatory-approval-check', { deal: dealInput, jurisdictions: jurs }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 10. POST /api/ai/term-sheet-compare
router.post('/term-sheet-compare', async (req, res) => {
  try {
    const { deal, term_sheets_json, term_sheets } = req.body || {};
    let sheets = term_sheets;
    if (!sheets && term_sheets_json) {
      try { sheets = JSON.parse(term_sheets_json); } catch (_) { sheets = []; }
    }
    if (!Array.isArray(sheets) || sheets.length === 0) {
      return res.status(400).json({ error: 'term_sheets_json (array string) or term_sheets array required' });
    }
    const result = await ai.termSheetCompare(sheets.map((s) => ({ ...s, deal })));
    await record('term-sheet-compare', { deal, count: sheets.length }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 11. POST /api/ai/closing-checklist-gen
router.post('/closing-checklist-gen', async (req, res) => {
  try {
    const { deal_summary, signing_date, closing_date, deal } = req.body || {};
    const dealInput = deal || { summary: deal_summary };
    const result = await ai.closingChecklistGen(dealInput, signing_date || '', closing_date || '');
    await record('closing-checklist-gen', { deal: dealInput, signing_date, closing_date }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 12. POST /api/ai/due-diligence-prioritize
router.post('/due-diligence-prioritize', async (req, res) => {
  try {
    let items = req.body?.items;
    if (!items) {
      const r = await pool.query("SELECT * FROM due_diligence_items WHERE status IN ('open','in_review') ORDER BY id ASC LIMIT 30");
      items = r.rows;
    }
    const ctx = req.body?.context || { notes: req.body?.notes || '' };
    const result = await ai.dueDiligencePrioritize(items, ctx);
    await record('due-diligence-prioritize', { count: items.length }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 13. POST /api/ai/financial-model-sanity
router.post('/financial-model-sanity', async (req, res) => {
  try {
    const { model_summary, context, model } = req.body || {};
    const modelInput = model || { summary: model_summary };
    const ctx = typeof context === 'string' ? { notes: context } : (context || {});
    const result = await ai.financialModelSanity(modelInput, ctx);
    await record('financial-model-sanity', { model: modelInput, context: ctx }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 14. POST /api/ai/anti-trust-risk
router.post('/anti-trust-risk', async (req, res) => {
  try {
    const { deal_summary, market_context, deal } = req.body || {};
    const dealInput = deal || { summary: deal_summary };
    const mc = typeof market_context === 'string' ? { notes: market_context } : (market_context || {});
    const result = await ai.antiTrustRisk(dealInput, mc);
    await record('anti-trust-risk', { deal: dealInput, market_context: mc }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 15. POST /api/ai/escrow-calculator
router.post('/escrow-calculator', async (req, res) => {
  try {
    const { deal_summary, risk_profile, deal } = req.body || {};
    const dealInput = deal || { summary: deal_summary };
    const rp = typeof risk_profile === 'string' ? { notes: risk_profile } : (risk_profile || {});
    const result = await ai.escrowCalculator(dealInput, rp);
    await record('escrow-calculator', { deal: dealInput, risk_profile: rp }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 16. POST /api/ai/post-close-narrative
router.post('/post-close-narrative', async (req, res) => {
  try {
    const { deal_summary, kpi_notes, deal, kpis } = req.body || {};
    const dealInput = deal || { summary: deal_summary };
    const k = Array.isArray(kpis) && kpis.length > 0 ? kpis : (kpi_notes ? [{ note: kpi_notes }] : []);
    const result = await ai.postCloseNarrative(dealInput, k);
    await record('post-close-narrative', { deal: dealInput, kpis_count: k.length }, result);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
