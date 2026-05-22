# Audit Note — AIMandADealRoom

Domain: M&A virtual data room (document organization, due-diligence Q&A, deal pipeline, redactions, audit trails).
Stack: Node + Express + React + Postgres + OpenRouter.

## Inventory
- **CRUD entities (18)**: deals, targets, advisors, vdr-documents, q-and-a, working-groups, term-sheets, lois, due-diligence-items, financial-models, comps, working-capital-adjustments, integration-plans, regulatory-filings, escrow-terms, closing-checklist, post-close-reports, audit-log (via `_crudFactory` w/ RBAC + bulk-import + attachments).
- **AI endpoints (16) under `/api/ai`**: `synergy-model`, `comp-transaction-finder`, `qofe-memo`, `redline-summarizer`, `integration-plan-draft`, `working-capital-true-up`, `executive-brief`, `vdr-question-router`, `regulatory-approval-check`, `term-sheet-compare`, `closing-checklist-gen`, `due-diligence-prioritize`, `financial-model-sanity`, `anti-trust-risk`, `escrow-calculator`, `post-close-narrative` (+ `/samples`, `/history`).
- **Cross-cutting**: `notifications`, `attachments`, `webhooks`, `dashboard`, `custom-views` (Deal Funnel, Comp Scatter, Synergy Waterfall, Closing Gantt, VDR viewer Q&A).

## Gaps

### Missing AI (MECHANICAL)
- Document classifier (auto-tag VDR docs by type).
- Due-diligence Q&A copilot (assisted answer drafting on `q-and-a`).
- Redaction recommender (PII / privileged spans).
- Deal-summary generator (one-pager from deal + linked entities).
- Risk-flag extractor (cross-doc red flags).
- NDA matcher (clause-level NDA vs template diff).

### Missing Non-AI (MECHANICAL / NEEDS-PRODUCT-DECISION)
- Granular per-doc / per-folder permissions (RBAC is entity-level only).
- Watermarking (dynamic per-viewer overlay on doc serve).
- In-browser doc viewer w/ page-level access control.
- Audit-log export (CSV/PDF) endpoint.

### Custom (NEEDS-PRODUCT-DECISION)
- Dataroom analytics — who viewed what, when, dwell time.
- DCF copilot — guided model build + sensitivity.
- Term-sheet diff explainer — natural-language redline narration over `term-sheet-compare`.

## Status
- Implemented (this round): **None — audit-only**.
- Counts: 18 CRUD routes, 16 AI endpoints, 0 net-new implementations.

## Apply pass 7 (full backlog implementation)

Implemented all backlog items from the Gaps section. No new npm deps, no breaking
changes to existing endpoints or schemas (all additive).

### New AI endpoints (8 verbs under /api/ai)
| Verb | Endpoint | Backlog item |
|---|---|---|
| Document Classifier        | `POST /api/ai/document-classifier`       | Missing AI |
| Q&A Copilot                | `POST /api/ai/qa-copilot`                | Missing AI |
| Redaction Recommender      | `POST /api/ai/redaction-recommender`     | Missing AI |
| Deal Summary Generator     | `POST /api/ai/deal-summary-generator`    | Missing AI |
| Risk-Flag Extractor        | `POST /api/ai/risk-flag-extractor`       | Missing AI |
| NDA Matcher                | `POST /api/ai/nda-matcher`               | Missing AI |
| DCF Copilot                | `POST /api/ai/dcf-copilot`               | Custom (NEEDS-PRODUCT-DECISION) |
| Term-Sheet Diff Explainer  | `POST /api/ai/term-sheet-diff-explainer` | Custom (NEEDS-PRODUCT-DECISION) |

All 8 also expose `/api/ai/samples?feature=<verb>` sample fills (5 each) and flow
through the existing `/api/ai/history` pipeline via `record(...)`.

### New non-AI endpoints
- **Per-doc permissions (role-based ACL)** — `routes/vdrPermissions.js`:
  - `GET /api/vdr-permissions`
  - `GET /api/vdr-permissions/doc/:doc_id`
  - `POST /api/vdr-permissions` (admin)
  - `PUT /api/vdr-permissions/:id` (admin)
  - `DELETE /api/vdr-permissions/:id` (admin)
  - `POST /api/vdr-permissions/check` — `{doc_id, role}` → `{can_view, can_download, page_range, watermark_required}`
- **In-browser viewer + watermark + analytics + audit-log export** — `routes/vdrViewer.js`:
  - `GET /api/vdr-viewer/doc/:doc_id` — enforces ACL, issues per-viewer server-side text watermark in the response payload, returns page list bounded by the ACL page range.
  - `POST /api/vdr-viewer/doc/:doc_id/view` — logs dwell-time view event.
  - `GET /api/vdr-viewer/analytics` — totals + by-doc + by-viewer rollups (writer-only).
  - `GET /api/vdr-viewer/analytics/doc/:doc_id` — single-doc analytics.
  - `GET /api/vdr-viewer/audit-log/export?format=csv|pdf` — streamed CSV or PDF-shaped text export of `audit_log`.

### New frontend pages
- 8 AI pages: `AIDocumentClassifierPage`, `AIQaCopilotPage`, `AIRedactionRecommenderPage`, `AIDealSummaryPage`, `AIRiskFlagExtractorPage`, `AINdaMatcherPage`, `AIDcfCopilotPage`, `AITermSheetDiffExplainerPage`.
- 3 VDR pages: `VdrPermissionsPage` (admin CRUD on grants), `VdrViewerPage` (in-browser viewer with rotated text-overlay watermark + dwell logging), `VdrAnalyticsPage` (dataroom analytics + audit-log CSV/PDF download).
- Sidebar grouping refreshed: new VDR links + new AI Modeling / AI Drafting links.
- `frontend/src/services/api.js` extended with the 8 AI verb wrappers, `vdrPermissionsApi`, and `vdrViewerApi`.

### Schema (additive — `migrations/003_schema.sql`)
| Table | Purpose |
|---|---|
| `vdr_doc_permissions` | Per-doc role-based ACL (doc_id, role, can_view/download, watermark_required, page_range_start/_end). |
| `vdr_doc_views`       | Analytics events (viewer_email, role, dwell_seconds, page_count, watermark_id, ip, ua). |
| `vdr_watermarks`      | Per-render watermark issuance log (watermark_id, overlay_text, viewer). |
| `ai_results`          | Guarded re-declare (used by new AI verbs through existing `record(...)`). |

### Product decisions applied
- **Per-doc permissions** = role-based access list with optional page-range constraint (no per-user grants in this pass — roles are admin/advisor/viewer plus arbitrary custom roles a grant row may name). Default policy when no row exists: admin+advisor can view, viewer can not.
- **Watermarking** = server-side text overlay metadata in the response (`watermark.overlay_text` + `watermark_id`); frontend renders a rotated translucent overlay per page. The overlay text is `CONFIDENTIAL • <email> • <role> • <ISO timestamp> • <wm_id>`. Each render logs a row in `vdr_watermarks`.

### Server wiring
- Two new mounts in `backend/server.js` added immediately after `/api/custom-views` and before `app.listen(...)` (server.js has no 404 handler, so "before 404" is satisfied by mounting before `listen`).

### Skips / notes
- No real PDF rendering — `vdr_documents` stores metadata only, so the viewer surfaces synthetic page placeholders with the watermark overlay. A future pass could plumb actual files through the existing `attachments` table.
- "PDF" export for audit log is emitted as `text/plain` (no PDF library — `pdfkit` would be a new dep, which the constraint forbids). The CSV export is full.
- No per-user (vs per-role) grants in this pass. The grant row's `role` column is free-text so callers can grant a single named workstream or per-user role string if they choose to extend.

### Syntax verification
`node --check` passed on every modified backend `.js`:
`backend/server.js`, `backend/services/ai.js`, `backend/routes/ai.js`,
`backend/routes/vdrPermissions.js`, `backend/routes/vdrViewer.js`,
`frontend/src/services/api.js`. All new frontend JSX pages also pass `node --check`.

### Counts after this pass
- CRUD routes: 18 (unchanged).
- AI endpoints: **24** (16 → 24) + `/samples` + `/history`.
- Non-AI service routes: +2 (`vdr-permissions`, `vdr-viewer`).
- Frontend pages: +11 (8 AI + 3 VDR).
- New tables: 3 (+1 guarded).
- Net-new implementations: **22**.
