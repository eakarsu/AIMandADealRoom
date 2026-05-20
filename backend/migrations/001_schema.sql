-- AIMandADealRoom schema — 18 M&A entities + ai_results + RBAC + cross-cutting

CREATE TABLE IF NOT EXISTS deals (
  id              SERIAL PRIMARY KEY,
  deal_id         VARCHAR(50) UNIQUE,
  target_name     VARCHAR(200),
  sector          VARCHAR(80),
  deal_value_usd  BIGINT DEFAULT 0,
  stage           VARCHAR(40) DEFAULT 'sourcing',
  lead_advisor    VARCHAR(150),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS targets (
  id              SERIAL PRIMARY KEY,
  target_id       VARCHAR(50) UNIQUE,
  name            VARCHAR(200),
  sector          VARCHAR(80),
  country         VARCHAR(80),
  revenue_usd     BIGINT DEFAULT 0,
  ebitda_usd      BIGINT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS advisors (
  id              SERIAL PRIMARY KEY,
  advisor_id      VARCHAR(50) UNIQUE,
  name            VARCHAR(150),
  firm            VARCHAR(150),
  role            VARCHAR(100),
  contact         VARCHAR(200),
  status          VARCHAR(30) DEFAULT 'active',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vdr_documents (
  id              SERIAL PRIMARY KEY,
  doc_id          VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  name            VARCHAR(250),
  category        VARCHAR(80),
  uploaded_at     TIMESTAMPTZ,
  version         VARCHAR(20),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS q_and_a (
  id              SERIAL PRIMARY KEY,
  qa_id           VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  question        TEXT,
  asker           VARCHAR(150),
  answer          TEXT,
  status          VARCHAR(30) DEFAULT 'open',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS working_groups (
  id              SERIAL PRIMARY KEY,
  group_id        VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  workstream      VARCHAR(120),
  lead            VARCHAR(150),
  members_count   INTEGER DEFAULT 0,
  status          VARCHAR(30) DEFAULT 'active',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS term_sheets (
  id              SERIAL PRIMARY KEY,
  ts_id           VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  version         VARCHAR(20),
  valuation_usd   BIGINT DEFAULT 0,
  status          VARCHAR(30) DEFAULT 'draft',
  signed_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lois (
  id              SERIAL PRIMARY KEY,
  loi_id          VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  buyer           VARCHAR(200),
  value_usd       BIGINT DEFAULT 0,
  exclusivity_days INTEGER DEFAULT 0,
  status          VARCHAR(30) DEFAULT 'submitted',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS due_diligence_items (
  id              SERIAL PRIMARY KEY,
  dd_id           VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  area            VARCHAR(80),
  owner           VARCHAR(150),
  status          VARCHAR(30) DEFAULT 'open',
  findings        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_models (
  id              SERIAL PRIMARY KEY,
  model_id        VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  name            VARCHAR(200),
  version         VARCHAR(20),
  base_case_irr   NUMERIC(6,3) DEFAULT 0,
  status          VARCHAR(30) DEFAULT 'draft',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comps (
  id              SERIAL PRIMARY KEY,
  comp_id         VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  target          VARCHAR(200),
  multiple        NUMERIC(8,2) DEFAULT 0,
  metric          VARCHAR(40),
  source          VARCHAR(150),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS working_capital_adjustments (
  id              SERIAL PRIMARY KEY,
  wca_id          VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  item            VARCHAR(200),
  amount_usd      BIGINT DEFAULT 0,
  direction       VARCHAR(20),
  status          VARCHAR(30) DEFAULT 'pending',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration_plans (
  id              SERIAL PRIMARY KEY,
  plan_id         VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  workstream      VARCHAR(120),
  lead            VARCHAR(150),
  deadline        DATE,
  status          VARCHAR(30) DEFAULT 'planning',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS regulatory_filings (
  id              SERIAL PRIMARY KEY,
  filing_id       VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  authority       VARCHAR(150),
  type            VARCHAR(80),
  status          VARCHAR(30) DEFAULT 'prepared',
  filed_at        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escrow_terms (
  id              SERIAL PRIMARY KEY,
  escrow_id       VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  amount_usd      BIGINT DEFAULT 0,
  term_months     INTEGER DEFAULT 0,
  trigger         VARCHAR(200),
  status          VARCHAR(30) DEFAULT 'proposed',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS closing_checklist (
  id              SERIAL PRIMARY KEY,
  check_id        VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  item            VARCHAR(250),
  owner           VARCHAR(150),
  due_date        DATE,
  status          VARCHAR(30) DEFAULT 'open',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_close_reports (
  id              SERIAL PRIMARY KEY,
  report_id       VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  period          VARCHAR(40),
  kpi             VARCHAR(120),
  value           VARCHAR(120),
  status          VARCHAR(30) DEFAULT 'reported',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id              SERIAL PRIMARY KEY,
  entry_id        VARCHAR(50) UNIQUE,
  actor           VARCHAR(150),
  target          VARCHAR(200),
  action          VARCHAR(100),
  result          VARCHAR(80),
  ts              TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_results (
  id              SERIAL PRIMARY KEY,
  feature         VARCHAR(80) NOT NULL,
  input           JSONB,
  output          JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_results_feature_created
  ON ai_results (feature, created_at DESC);
