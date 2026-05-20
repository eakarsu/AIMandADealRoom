const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [
      deals, targets, advisors, docs, qa, wg, ts, lois,
      dd, fm, comps, wca, ip, rf, esc, cl, pcr, audit,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) AS total, COALESCE(SUM(deal_value_usd),0) AS total_value, COUNT(*) FILTER (WHERE stage='closing') AS closing, COUNT(*) FILTER (WHERE stage='diligence') AS diligence FROM deals"),
      pool.query("SELECT COUNT(*) AS total, COALESCE(SUM(revenue_usd),0) AS total_revenue, COALESCE(SUM(ebitda_usd),0) AS total_ebitda FROM targets"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='active') AS active FROM advisors"),
      pool.query("SELECT COUNT(*) AS total FROM vdr_documents"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='open') AS open, COUNT(*) FILTER (WHERE status='answered') AS answered FROM q_and_a"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='active') AS active FROM working_groups"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='signed') AS signed, COUNT(*) FILTER (WHERE status='circulating') AS circulating FROM term_sheets"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='signed') AS signed, COUNT(*) FILTER (WHERE status='under_review') AS under_review FROM lois"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='open') AS open, COUNT(*) FILTER (WHERE status='in_review') AS in_review FROM due_diligence_items"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='approved') AS approved FROM financial_models"),
      pool.query("SELECT COUNT(*) AS total FROM comps"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='disputed') AS disputed FROM working_capital_adjustments"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='at_risk') AS at_risk FROM integration_plans"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='cleared') AS cleared, COUNT(*) FILTER (WHERE status='under_review') AS under_review FROM regulatory_filings"),
      pool.query("SELECT COUNT(*) AS total, COALESCE(SUM(amount_usd),0) AS total_amount FROM escrow_terms"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='complete') AS complete, COUNT(*) FILTER (WHERE status='open') AS open FROM closing_checklist"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='at_risk') AS at_risk, COUNT(*) FILTER (WHERE status='behind') AS behind FROM post_close_reports"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE result='denied') AS denied FROM audit_log"),
    ]);
    res.json({
      deals:                       deals.rows[0],
      targets:                     targets.rows[0],
      advisors:                    advisors.rows[0],
      vdr_documents:               docs.rows[0],
      q_and_a:                     qa.rows[0],
      working_groups:              wg.rows[0],
      term_sheets:                 ts.rows[0],
      lois:                        lois.rows[0],
      due_diligence_items:         dd.rows[0],
      financial_models:            fm.rows[0],
      comps:                       comps.rows[0],
      working_capital_adjustments: wca.rows[0],
      integration_plans:           ip.rows[0],
      regulatory_filings:          rf.rows[0],
      escrow_terms:                esc.rows[0],
      closing_checklist:           cl.rows[0],
      post_close_reports:          pcr.rows[0],
      audit_log:                   audit.rows[0],
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
