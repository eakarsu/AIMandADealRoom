-- AIMandADealRoom v3 schema additions (Apply pass 7 — full backlog implementation)
-- Adds: per-doc permissions, dataroom view analytics, watermark log, ai_results extras.
-- All new tables are additive and use IF NOT EXISTS so re-running is safe.

-- ─────────────────────────────────────────────
-- Per-document permissions (role-based access list)
-- One row = one (vdr_document, role) grant.
-- Page-level access enforced via page_range_start/page_range_end (NULL = all).
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vdr_doc_permissions (
  id                 SERIAL PRIMARY KEY,
  doc_id             VARCHAR(50) NOT NULL,
  role               VARCHAR(40) NOT NULL,          -- admin|advisor|viewer (or any custom)
  can_view           BOOLEAN DEFAULT TRUE,
  can_download       BOOLEAN DEFAULT FALSE,
  watermark_required BOOLEAN DEFAULT TRUE,
  page_range_start   INTEGER,                       -- NULL = from page 1
  page_range_end     INTEGER,                       -- NULL = through last page
  granted_by         VARCHAR(150),
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vdr_doc_permissions_doc
  ON vdr_doc_permissions (doc_id);
CREATE INDEX IF NOT EXISTS idx_vdr_doc_permissions_role
  ON vdr_doc_permissions (doc_id, role);

-- ─────────────────────────────────────────────
-- Dataroom view analytics (who viewed what, when, dwell time)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vdr_doc_views (
  id              SERIAL PRIMARY KEY,
  doc_id          VARCHAR(50) NOT NULL,
  viewer_email    VARCHAR(150),
  viewer_role     VARCHAR(40),
  viewed_at       TIMESTAMPTZ DEFAULT NOW(),
  dwell_seconds   INTEGER DEFAULT 0,
  page_count      INTEGER DEFAULT 0,
  watermark_id    VARCHAR(80),
  client_ip       VARCHAR(64),
  user_agent      VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_vdr_doc_views_doc
  ON vdr_doc_views (doc_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_vdr_doc_views_viewer
  ON vdr_doc_views (viewer_email, viewed_at DESC);

-- ─────────────────────────────────────────────
-- Watermark issuance log (one row per served-viewer watermarked render)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vdr_watermarks (
  id              SERIAL PRIMARY KEY,
  watermark_id    VARCHAR(80) UNIQUE,
  doc_id          VARCHAR(50) NOT NULL,
  viewer_email    VARCHAR(150),
  viewer_role     VARCHAR(40),
  overlay_text    TEXT,
  issued_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vdr_watermarks_doc
  ON vdr_watermarks (doc_id, issued_at DESC);

-- ─────────────────────────────────────────────
-- ai_results table (already created in 001 / 002 chain but guarded here)
-- (Used by AI history endpoint for new verbs below as well.)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_results (
  id          SERIAL PRIMARY KEY,
  feature     VARCHAR(80) NOT NULL,
  input       JSONB,
  output      JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_results_feature
  ON ai_results (feature, created_at DESC);
