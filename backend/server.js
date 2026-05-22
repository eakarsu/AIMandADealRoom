const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { authenticateToken } = require('./middleware/auth');
const pool = require('./config/database');
const { fireWebhook } = require('./services/webhooks');

const app = express();
const PORT = process.env.BACKEND_PORT || 3071;

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3070,http://localhost:3071,http://localhost:3000')
  .split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health check (public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth (public)
app.use('/api/auth', require('./routes/auth'));

// Everything below this line requires a Bearer token.
app.use('/api', authenticateToken);

// CRUD routes (18 M&A entities — all via _crudFactory, RBAC + bulk-import + attachments built in)
app.use('/api/deals',                       require('./routes/deals'));
app.use('/api/targets',                     require('./routes/targets'));
app.use('/api/advisors',                    require('./routes/advisors'));
app.use('/api/vdr-documents',               require('./routes/vdrDocuments'));
app.use('/api/q-and-a',                     require('./routes/qAndA'));
app.use('/api/working-groups',              require('./routes/workingGroups'));
app.use('/api/term-sheets',                 require('./routes/termSheets'));
app.use('/api/lois',                        require('./routes/lois'));
app.use('/api/due-diligence-items',         require('./routes/dueDiligenceItems'));
app.use('/api/financial-models',            require('./routes/financialModels'));
app.use('/api/comps',                       require('./routes/comps'));
app.use('/api/working-capital-adjustments', require('./routes/workingCapitalAdjustments'));
app.use('/api/integration-plans',           require('./routes/integrationPlans'));
app.use('/api/regulatory-filings',          require('./routes/regulatoryFilings'));
app.use('/api/escrow-terms',                require('./routes/escrowTerms'));
app.use('/api/closing-checklist',           require('./routes/closingChecklist'));
app.use('/api/post-close-reports',          require('./routes/postCloseReports'));
app.use('/api/audit-log',                   require('./routes/auditLog'));

// AI routes (16 sub-endpoints + history + samples under /api/ai)
app.use('/api/ai', require('./routes/ai'));

// Cross-cutting
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/attachments',   require('./routes/attachments'));
app.use('/api/webhooks',      require('./routes/webhooks'));

// Dashboard stats
app.use('/api/dashboard', require('./routes/dashboard'));

// Custom analytics views (Deal Funnel, Comp Scatter, Synergy Waterfall, Closing Gantt)
app.use('/api/custom-views', require('./routes/customViews'));

// Pass 7 — full backlog implementation:
//   per-doc permissions (role-based ACL), in-browser viewer w/ watermark + page ACL,
//   view analytics, audit-log export.
app.use('/api/vdr-permissions', require('./routes/vdrPermissions'));
app.use('/api/vdr-viewer',      require('./routes/vdrViewer'));
app.use('/api/buyer-engagement-score', require('./routes/buyerEngagementScore'));

app.listen(PORT, () => {
  console.log(`\nAI M&A Deal Room API running on http://localhost:${PORT}\n`);
});
