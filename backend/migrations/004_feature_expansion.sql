-- AIMandADealRoom feature expansion
-- Adds buyer CRM, milestone calendar, data request workflow, document
-- comparison, group permissions, bid rounds, marketing materials tracking,
-- document comments, approval workflows, and closing binder exports.

CREATE TABLE IF NOT EXISTS buyer_pipeline (
  id                 SERIAL PRIMARY KEY,
  buyer_id           VARCHAR(50) UNIQUE,
  deal_id            VARCHAR(50),
  buyer_name         VARCHAR(180),
  buyer_type         VARCHAR(80),
  contact_name       VARCHAR(160),
  contact_email      VARCHAR(180),
  stage              VARCHAR(60),
  interest_score     NUMERIC(6,2) DEFAULT 0,
  last_touch_date    DATE,
  next_step          VARCHAR(240),
  notes              TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_buyer_pipeline_deal ON buyer_pipeline (deal_id);

CREATE TABLE IF NOT EXISTS deal_milestones (
  id              SERIAL PRIMARY KEY,
  milestone_id    VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  title           VARCHAR(220),
  category        VARCHAR(80),
  owner           VARCHAR(120),
  start_date      DATE,
  due_date        DATE,
  status          VARCHAR(50) DEFAULT 'not_started',
  dependency      VARCHAR(160),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_deal_milestones_deal ON deal_milestones (deal_id);

CREATE TABLE IF NOT EXISTS data_requests (
  id                 SERIAL PRIMARY KEY,
  request_id          VARCHAR(50) UNIQUE,
  deal_id             VARCHAR(50),
  workstream          VARCHAR(80),
  requested_item      VARCHAR(240),
  requested_from      VARCHAR(160),
  owner               VARCHAR(120),
  priority            VARCHAR(40),
  due_date            DATE,
  status              VARCHAR(50) DEFAULT 'open',
  response_summary    TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_data_requests_deal ON data_requests (deal_id);

CREATE TABLE IF NOT EXISTS document_comparisons (
  id                 SERIAL PRIMARY KEY,
  comparison_id       VARCHAR(50) UNIQUE,
  deal_id             VARCHAR(50),
  base_doc_id         VARCHAR(50),
  revised_doc_id      VARCHAR(50),
  comparison_type     VARCHAR(80),
  risk_level          VARCHAR(40),
  material_changes    TEXT,
  reviewer            VARCHAR(120),
  status              VARCHAR(50) DEFAULT 'queued',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_document_comparisons_deal ON document_comparisons (deal_id);

CREATE TABLE IF NOT EXISTS permission_groups (
  id              SERIAL PRIMARY KEY,
  group_id        VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  group_name      VARCHAR(160),
  group_type      VARCHAR(80),
  members_count   INTEGER DEFAULT 0,
  access_level    VARCHAR(60),
  watermark       BOOLEAN DEFAULT TRUE,
  status          VARCHAR(50) DEFAULT 'active',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_permission_groups_deal ON permission_groups (deal_id);

CREATE TABLE IF NOT EXISTS bid_rounds (
  id                    SERIAL PRIMARY KEY,
  round_id               VARCHAR(50) UNIQUE,
  deal_id                VARCHAR(50),
  round_name             VARCHAR(120),
  bid_deadline           DATE,
  invited_buyers         INTEGER DEFAULT 0,
  bids_received          INTEGER DEFAULT 0,
  top_bid_usd            BIGINT DEFAULT 0,
  status                 VARCHAR(50) DEFAULT 'planned',
  decision_summary       TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bid_rounds_deal ON bid_rounds (deal_id);

CREATE TABLE IF NOT EXISTS marketing_materials (
  id              SERIAL PRIMARY KEY,
  material_id     VARCHAR(50) UNIQUE,
  deal_id         VARCHAR(50),
  material_type   VARCHAR(80),
  title           VARCHAR(220),
  owner           VARCHAR(120),
  version         VARCHAR(40),
  status          VARCHAR(50) DEFAULT 'draft',
  shared_at       DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_marketing_materials_deal ON marketing_materials (deal_id);

CREATE TABLE IF NOT EXISTS document_comments (
  id              SERIAL PRIMARY KEY,
  comment_id      VARCHAR(50) UNIQUE,
  doc_id          VARCHAR(50),
  deal_id         VARCHAR(50),
  author          VARCHAR(120),
  visibility      VARCHAR(50) DEFAULT 'internal',
  page_ref        VARCHAR(40),
  comment_body    TEXT,
  status          VARCHAR(50) DEFAULT 'open',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_document_comments_doc ON document_comments (doc_id);

CREATE TABLE IF NOT EXISTS approval_workflows (
  id                 SERIAL PRIMARY KEY,
  approval_id         VARCHAR(50) UNIQUE,
  deal_id             VARCHAR(50),
  artifact_type       VARCHAR(80),
  artifact_id         VARCHAR(80),
  approver            VARCHAR(120),
  approval_step       VARCHAR(120),
  due_date            DATE,
  status              VARCHAR(50) DEFAULT 'pending',
  decision_notes      TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_approval_workflows_deal ON approval_workflows (deal_id);

CREATE TABLE IF NOT EXISTS closing_binders (
  id                SERIAL PRIMARY KEY,
  binder_id          VARCHAR(50) UNIQUE,
  deal_id            VARCHAR(50),
  binder_name        VARCHAR(180),
  binder_type        VARCHAR(80),
  document_count     INTEGER DEFAULT 0,
  owner              VARCHAR(120),
  export_format      VARCHAR(40),
  status             VARCHAR(50) DEFAULT 'draft',
  exported_at        TIMESTAMPTZ,
  notes              TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_closing_binders_deal ON closing_binders (deal_id);
