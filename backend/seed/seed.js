const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'manda_deal_room',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('[seed] resetting tables...');
    await client.query(`
      DROP TABLE IF EXISTS deals                       CASCADE;
      DROP TABLE IF EXISTS targets                     CASCADE;
      DROP TABLE IF EXISTS advisors                    CASCADE;
      DROP TABLE IF EXISTS vdr_documents               CASCADE;
      DROP TABLE IF EXISTS q_and_a                     CASCADE;
      DROP TABLE IF EXISTS working_groups              CASCADE;
      DROP TABLE IF EXISTS term_sheets                 CASCADE;
      DROP TABLE IF EXISTS lois                        CASCADE;
      DROP TABLE IF EXISTS due_diligence_items         CASCADE;
      DROP TABLE IF EXISTS financial_models            CASCADE;
      DROP TABLE IF EXISTS comps                       CASCADE;
      DROP TABLE IF EXISTS working_capital_adjustments CASCADE;
      DROP TABLE IF EXISTS integration_plans           CASCADE;
      DROP TABLE IF EXISTS regulatory_filings          CASCADE;
      DROP TABLE IF EXISTS escrow_terms                CASCADE;
      DROP TABLE IF EXISTS closing_checklist           CASCADE;
      DROP TABLE IF EXISTS post_close_reports          CASCADE;
      DROP TABLE IF EXISTS audit_log                   CASCADE;
      DROP TABLE IF EXISTS ai_results                  CASCADE;

      DROP TABLE IF EXISTS users                       CASCADE;
      DROP TABLE IF EXISTS notifications               CASCADE;
      DROP TABLE IF EXISTS attachments                 CASCADE;
      DROP TABLE IF EXISTS webhooks                    CASCADE;
      DROP TABLE IF EXISTS webhook_deliveries          CASCADE;
    `);

    console.log('[seed] applying migrations...');
    const schema1 = fs.readFileSync(path.join(__dirname, '..', 'migrations', '001_schema.sql'), 'utf8');
    await client.query(schema1);
    const schema2 = fs.readFileSync(path.join(__dirname, '..', 'migrations', '002_schema.sql'), 'utf8');
    await client.query(schema2);

    console.log('[seed] inserting deals...');
    const deals = [
      ['DEAL-2026-001', 'Helios Therapeutics',        'biotech',         1850000000, 'diligence',    'Morgan Stanley'],
      ['DEAL-2026-002', 'Northwind Logistics Group',  'logistics',        920000000, 'loi_signed',   'Goldman Sachs'],
      ['DEAL-2026-003', 'Verdant Foods Holdings',     'consumer',         640000000, 'sourcing',     'Lazard'],
      ['DEAL-2026-004', 'Kestrel Cyber Defense',      'cybersecurity',    410000000, 'term_sheet',   'Evercore'],
      ['DEAL-2026-005', 'Quantum Edge Analytics',     'enterprise saas',  1250000000,'diligence',    'JPMorgan'],
      ['DEAL-2026-006', 'Atlas Renewable Power',      'energy',           2200000000,'closing',      'Citi'],
      ['DEAL-2026-007', 'Marlin Diagnostics',         'medtech',          380000000, 'sourcing',     'Centerview'],
      ['DEAL-2026-008', 'Crescent Capital Bank',      'financial svcs',   3400000000,'regulatory',   'BofA'],
      ['DEAL-2026-009', 'Pioneer Auto Components',    'industrials',      580000000, 'loi_signed',   'Houlihan Lokey'],
      ['DEAL-2026-010', 'Nimbus Cloud Hosting',       'cloud infra',      870000000, 'diligence',    'Qatalyst Partners'],
      ['DEAL-2026-011', 'Saffron Specialty Chemicals','chemicals',        720000000, 'term_sheet',   'Rothschild'],
      ['DEAL-2026-012', 'Beacon Hospitality Group',   'hospitality',      490000000, 'sourcing',     'PJT Partners'],
      ['DEAL-2026-013', 'Polaris EV Drivetrain',      'automotive',       1100000000,'closing',      'Moelis'],
      ['DEAL-2026-014', 'Sterling Aerospace Parts',   'aerospace',        980000000, 'closed',       'Jefferies'],
      ['DEAL-2026-015', 'Harbor Insurance Holdings',  'insurance',        1450000000,'diligence',    'UBS'],
    ];
    for (const r of deals) {
      await client.query(
        `INSERT INTO deals (deal_id,target_name,sector,deal_value_usd,stage,lead_advisor) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting targets...');
    const targets = [
      ['TGT-001', 'Helios Therapeutics',         'biotech',          'USA',     420000000,  78000000],
      ['TGT-002', 'Northwind Logistics Group',   'logistics',        'USA',     1200000000, 145000000],
      ['TGT-003', 'Verdant Foods Holdings',      'consumer',         'CAN',     780000000,  98000000],
      ['TGT-004', 'Kestrel Cyber Defense',       'cybersecurity',    'ISR',     180000000,  42000000],
      ['TGT-005', 'Quantum Edge Analytics',      'enterprise saas',  'USA',     310000000,  88000000],
      ['TGT-006', 'Atlas Renewable Power',       'energy',           'ESP',     980000000,  220000000],
      ['TGT-007', 'Marlin Diagnostics',          'medtech',          'GBR',     145000000,  29000000],
      ['TGT-008', 'Crescent Capital Bank',       'financial svcs',   'USA',     2400000000, 540000000],
      ['TGT-009', 'Pioneer Auto Components',     'industrials',      'DEU',     680000000,  88000000],
      ['TGT-010', 'Nimbus Cloud Hosting',        'cloud infra',      'IRL',     220000000,  62000000],
      ['TGT-011', 'Saffron Specialty Chemicals', 'chemicals',        'IND',     410000000,  74000000],
      ['TGT-012', 'Beacon Hospitality Group',    'hospitality',      'USA',     520000000,  68000000],
      ['TGT-013', 'Polaris EV Drivetrain',       'automotive',       'JPN',     480000000,  102000000],
      ['TGT-014', 'Sterling Aerospace Parts',    'aerospace',        'USA',     390000000,  84000000],
      ['TGT-015', 'Harbor Insurance Holdings',   'insurance',        'BMU',     880000000,  198000000],
    ];
    for (const r of targets) {
      await client.query(
        `INSERT INTO targets (target_id,name,sector,country,revenue_usd,ebitda_usd) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting advisors...');
    const advisors = [
      ['ADV-001', 'Sarah Whitman',     'Morgan Stanley',  'Lead M&A Banker',      'swhitman@ms.com',           'active'],
      ['ADV-002', 'David Chen',        'Goldman Sachs',   'Sector Lead',          'dchen@gs.com',              'active'],
      ['ADV-003', 'Marie Dubois',      'Lazard',          'Vice Chairman',        'mdubois@lazard.com',        'active'],
      ['ADV-004', 'Raj Patel',         'Evercore',        'Managing Director',    'rpatel@evercore.com',       'active'],
      ['ADV-005', 'Elena Rossi',       'JPMorgan',        'Tech M&A Head',        'erossi@jpm.com',            'active'],
      ['ADV-006', 'Michael O\'Brien',  'Citi',            'Energy M&A Lead',      'mobrien@citi.com',          'active'],
      ['ADV-007', 'Hannah Sullivan',   'Centerview',      'Partner',              'hsullivan@centerview.com',  'active'],
      ['ADV-008', 'Thomas Becker',     'BofA',            'FIG Banker',           'tbecker@bofa.com',          'active'],
      ['ADV-009', 'Jin Park',          'Houlihan Lokey',  'Industrial MD',        'jpark@hl.com',              'active'],
      ['ADV-010', 'Sofia Reyes',       'Qatalyst',        'Founding Partner',     'sreyes@qatalyst.com',       'active'],
      ['ADV-011', 'Lukas Werner',      'Rothschild',      'Chemicals MD',         'lwerner@rothschild.com',    'active'],
      ['ADV-012', 'Olivia Carter',     'PJT Partners',    'Hospitality Banker',   'ocarter@pjt.com',           'on_leave'],
      ['ADV-013', 'Ben Goldberg',      'Moelis',          'Auto M&A Lead',        'bgoldberg@moelis.com',      'active'],
      ['ADV-014', 'Priya Iyer',        'Jefferies',       'Aerospace MD',         'piyer@jefferies.com',       'active'],
      ['ADV-015', 'James Holt',        'UBS',             'Insurance Lead',       'jholt@ubs.com',             'active'],
    ];
    for (const r of advisors) {
      await client.query(
        `INSERT INTO advisors (advisor_id,name,firm,role,contact,status) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting vdr_documents...');
    const docs = [
      ['DOC-0001','DEAL-2026-001','CIM_Helios_Therapeutics_v3.pdf',          'CIM',                '2026-03-12 09:00+00','3.0'],
      ['DOC-0002','DEAL-2026-001','Audited_Financials_2023-2025.xlsx',       'Financials',         '2026-03-14 11:30+00','1.0'],
      ['DOC-0003','DEAL-2026-002','LOI_Northwind_executed.pdf',              'LOI',                '2026-03-18 16:20+00','1.0'],
      ['DOC-0004','DEAL-2026-002','Customer_Contracts_Top20.zip',            'Commercial',         '2026-03-19 09:00+00','1.0'],
      ['DOC-0005','DEAL-2026-005','Cohort_Analysis_Quantum.xlsx',            'Commercial',         '2026-04-02 14:45+00','2.1'],
      ['DOC-0006','DEAL-2026-006','HSR_filing_draft_Atlas.docx',             'Regulatory',         '2026-04-10 10:00+00','0.9'],
      ['DOC-0007','DEAL-2026-006','Asset_Register_Spain_Portfolio.pdf',      'Operational',        '2026-04-11 13:00+00','1.0'],
      ['DOC-0008','DEAL-2026-008','Reg_capital_disclosure_Crescent.pdf',     'Regulatory',         '2026-04-15 08:30+00','1.0'],
      ['DOC-0009','DEAL-2026-008','OCC_correspondence_2024-2026.pdf',        'Regulatory',         '2026-04-15 08:45+00','1.0'],
      ['DOC-0010','DEAL-2026-010','SOC2_Type2_Nimbus_2025.pdf',              'Compliance',         '2026-04-22 15:00+00','1.0'],
      ['DOC-0011','DEAL-2026-013','EV_drivetrain_patent_schedule.pdf',       'IP',                 '2026-04-28 10:15+00','1.0'],
      ['DOC-0012','DEAL-2026-014','Sterling_QofE_Deloitte_v2.pdf',           'QofE',               '2026-05-01 12:00+00','2.0'],
      ['DOC-0013','DEAL-2026-014','Closing_doc_index_Sterling.xlsx',         'Closing',            '2026-05-08 09:00+00','1.0'],
      ['DOC-0014','DEAL-2026-015','Loss_triangles_Harbor_Insurance.xlsx',    'Actuarial',          '2026-05-09 17:30+00','1.1'],
      ['DOC-0015','DEAL-2026-015','Reinsurance_treaties_2026.pdf',           'Commercial',         '2026-05-09 18:00+00','1.0'],
    ];
    for (const r of docs) {
      await client.query(
        `INSERT INTO vdr_documents (doc_id,deal_id,name,category,uploaded_at,version) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting q_and_a...');
    const qa = [
      ['QA-0001','DEAL-2026-001','Please provide breakdown of R&D spend by program for FY2024-2025.','David Chen, Goldman Sachs','Breakdown delivered in folder /Financials/RD/. Helios-001 was 62% of spend.','answered'],
      ['QA-0002','DEAL-2026-001','Have any clinical trial holds been received from FDA in last 24 months?','Sarah Whitman, MS','None received; one partial clinical hold was lifted in Aug 2024.','answered'],
      ['QA-0003','DEAL-2026-002','Top-10 customer concentration as % of 2025 revenue.','Raj Patel, Evercore','Top-10 = 41%; Top-3 = 18%. Walmart, FedEx, Maersk.','answered'],
      ['QA-0004','DEAL-2026-005','Net dollar retention by ARR cohort?','Elena Rossi, JPM','NDR 122% (2023 cohort), 118% (2024 cohort). See cohort file in VDR.','answered'],
      ['QA-0005','DEAL-2026-006','Spanish renewable PPA pricing assumptions in base model?','Michael O\'Brien, Citi','PPA: €58/MWh blended 2026-2035, €45/MWh merchant exposure post-2035.','answered'],
      ['QA-0006','DEAL-2026-008','Detail on consent order from OCC dated Q2 2024.','Thomas Becker, BofA','Open — legal team gathering full text; tentative response by EOW.','open'],
      ['QA-0007','DEAL-2026-008','Tier-1 capital ratio under stress scenario?','Hannah Sullivan, Centerview','Stressed CET1 stays above 9.2% in adverse DFAST scenario.','answered'],
      ['QA-0008','DEAL-2026-010','Confirm GDPR DPO and EU data residency assertions.','Sofia Reyes, Qatalyst','Open — Nimbus pulling DPA + DPIA package.','open'],
      ['QA-0009','DEAL-2026-013','EV drivetrain unit economics at 100k units/year?','Ben Goldberg, Moelis','Open — finance team rerunning unit cost model.','open'],
      ['QA-0010','DEAL-2026-013','Have any vehicle OEMs initiated termination talks?','Sarah Whitman, MS','No active terminations; one OEM (Mazda) in renegotiation.','answered'],
      ['QA-0011','DEAL-2026-014','Confirm aerospace Boeing single-source exposure.','Priya Iyer, Jefferies','Boeing single-source on 4 SKUs; dual-sourcing initiative underway.','answered'],
      ['QA-0012','DEAL-2026-015','Reserve adequacy for hurricane catastrophe layer?','James Holt, UBS','Loss reserves +12% vs Aon best-estimate; full actuarial memo in VDR.','answered'],
      ['QA-0013','DEAL-2026-007','FDA 510(k) submission timeline for next-gen device?','Hannah Sullivan, Centerview','Open — regulatory affairs to provide updated Gantt.','open'],
      ['QA-0014','DEAL-2026-011','EH&S incident history at Indian plant?','Lukas Werner, Rothschild','Zero LTI in last 36 months; two reportable releases under threshold.','answered'],
      ['QA-0015','DEAL-2026-009','German works council position on transaction?','Jin Park, HL','Open — initial briefing scheduled with IG Metall counsel.','open'],
    ];
    for (const r of qa) {
      await client.query(
        `INSERT INTO q_and_a (qa_id,deal_id,question,asker,answer,status) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting working_groups...');
    const wg = [
      ['WG-001','DEAL-2026-001','Financial Diligence',  'Deloitte FAS',           7, 'active'],
      ['WG-002','DEAL-2026-001','Legal Diligence',      'Skadden, Arps',          9, 'active'],
      ['WG-003','DEAL-2026-002','Commercial Diligence', 'Bain & Company',         6, 'active'],
      ['WG-004','DEAL-2026-005','Tech Diligence',       'Accenture Tech DD',      5, 'active'],
      ['WG-005','DEAL-2026-006','Environmental DD',     'ERM',                    4, 'active'],
      ['WG-006','DEAL-2026-008','Regulatory',           'Sullivan & Cromwell',    8, 'active'],
      ['WG-007','DEAL-2026-008','Capital Markets',      'BofA Cap Mkts',          6, 'active'],
      ['WG-008','DEAL-2026-010','Cyber DD',             'Mandiant',               4, 'active'],
      ['WG-009','DEAL-2026-013','Operational DD',       'AlixPartners',           6, 'active'],
      ['WG-010','DEAL-2026-014','Closing Mechanics',    'Latham & Watkins',       7, 'paused'],
      ['WG-011','DEAL-2026-015','Actuarial DD',         'Milliman',               5, 'active'],
      ['WG-012','DEAL-2026-009','HR / Labor',           'Mercer',                 4, 'active'],
      ['WG-013','DEAL-2026-011','EH&S',                 'Ramboll',                3, 'active'],
      ['WG-014','DEAL-2026-007','Clinical DD',          'IQVIA',                  4, 'active'],
      ['WG-015','DEAL-2026-012','Tax Structuring',      'PwC Tax',                5, 'active'],
    ];
    for (const r of wg) {
      await client.query(
        `INSERT INTO working_groups (group_id,deal_id,workstream,lead,members_count,status) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting term_sheets...');
    const ts = [
      ['TS-001','DEAL-2026-001','v3.2', 1850000000, 'circulating','2026-04-05 09:00+00'],
      ['TS-002','DEAL-2026-002','v2.0', 920000000,  'signed',     '2026-03-18 17:00+00'],
      ['TS-003','DEAL-2026-004','v1.1', 410000000,  'draft',      null],
      ['TS-004','DEAL-2026-005','v2.4', 1250000000, 'circulating','2026-04-15 14:00+00'],
      ['TS-005','DEAL-2026-006','v4.0', 2200000000, 'signed',     '2026-04-22 11:00+00'],
      ['TS-006','DEAL-2026-008','v1.3', 3400000000, 'circulating','2026-04-18 16:30+00'],
      ['TS-007','DEAL-2026-009','v1.0', 580000000,  'draft',      null],
      ['TS-008','DEAL-2026-010','v2.1', 870000000,  'circulating','2026-04-28 10:00+00'],
      ['TS-009','DEAL-2026-011','v1.2', 720000000,  'draft',      null],
      ['TS-010','DEAL-2026-013','v3.0', 1100000000, 'signed',     '2026-04-30 13:00+00'],
      ['TS-011','DEAL-2026-014','v4.5', 980000000,  'signed',     '2026-04-25 18:00+00'],
      ['TS-012','DEAL-2026-015','v2.0', 1450000000, 'circulating','2026-05-02 09:30+00'],
      ['TS-013','DEAL-2026-001','v3.3', 1820000000, 'draft',      null],
      ['TS-014','DEAL-2026-008','v1.4', 3380000000, 'draft',      null],
      ['TS-015','DEAL-2026-006','v4.1', 2210000000, 'circulating','2026-05-08 11:00+00'],
    ];
    for (const r of ts) {
      await client.query(
        `INSERT INTO term_sheets (ts_id,deal_id,version,valuation_usd,status,signed_at) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting lois...');
    const lois = [
      ['LOI-001','DEAL-2026-002','Maersk Logistics Holdings',  920000000, 60,'signed'],
      ['LOI-002','DEAL-2026-002','XPO Logistics',              880000000, 30,'rejected'],
      ['LOI-003','DEAL-2026-005','Vista Equity Partners',     1250000000, 45,'signed'],
      ['LOI-004','DEAL-2026-006','Brookfield Renewable',      2200000000, 90,'signed'],
      ['LOI-005','DEAL-2026-006','EDF Renewables',            2150000000, 45,'rejected'],
      ['LOI-006','DEAL-2026-008','KKR Financial Services',    3400000000, 60,'under_review'],
      ['LOI-007','DEAL-2026-009','ZF Friedrichshafen AG',      580000000, 45,'signed'],
      ['LOI-008','DEAL-2026-010','Silver Lake Partners',       870000000, 60,'under_review'],
      ['LOI-009','DEAL-2026-013','Toyota Tsusho',             1100000000, 75,'signed'],
      ['LOI-010','DEAL-2026-013','BorgWarner',                1080000000, 30,'rejected'],
      ['LOI-011','DEAL-2026-014','TransDigm Group',            980000000, 60,'signed'],
      ['LOI-012','DEAL-2026-015','Berkshire Hathaway Re',     1450000000, 90,'under_review'],
      ['LOI-013','DEAL-2026-001','GSK plc',                   1850000000, 45,'submitted'],
      ['LOI-014','DEAL-2026-001','Sanofi SA',                 1800000000, 30,'submitted'],
      ['LOI-015','DEAL-2026-011','SABIC',                      720000000, 60,'submitted'],
    ];
    for (const r of lois) {
      await client.query(
        `INSERT INTO lois (loi_id,deal_id,buyer,value_usd,exclusivity_days,status) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting due_diligence_items...');
    const dd = [
      ['DD-001','DEAL-2026-001','Financial',    'Deloitte FAS',         'in_review','EBITDA bridge supports management adj of +$12M for one-time clinical write-offs.'],
      ['DD-002','DEAL-2026-001','Legal',        'Skadden, Arps',        'open',     'Two open patent infringement suits — both <$5M exposure based on outside counsel review.'],
      ['DD-003','DEAL-2026-002','Commercial',   'Bain & Company',       'in_review','Customer NPS strong (62); contract churn 4.2% TTM.'],
      ['DD-004','DEAL-2026-002','Operational',  'AlixPartners',         'open',     'Fleet utilization 71% — 8-10 pts upside identified via routing optimization.'],
      ['DD-005','DEAL-2026-005','Tech',         'Accenture Tech DD',    'closed',   'Codebase modern (Go/TS); CI/CD mature; one critical Snyk finding remediated during DD.'],
      ['DD-006','DEAL-2026-006','Environmental','ERM',                  'in_review','3 sites with legacy soil contamination — remediation estimate $18M.'],
      ['DD-007','DEAL-2026-008','Regulatory',   'Sullivan & Cromwell',  'open',     'OCC consent order requires Tier 1 remediation by Dec 2026; ongoing.'],
      ['DD-008','DEAL-2026-008','Financial',    'EY',                   'in_review','CECL reserves consistent with peer banks; modest provision build expected.'],
      ['DD-009','DEAL-2026-010','Cyber',        'Mandiant',             'closed',   'No active compromise; one historical 2023 phishing event remediated.'],
      ['DD-010','DEAL-2026-013','Operational',  'AlixPartners',         'in_review','Manufacturing footprint to be consolidated post-close — 2 plants in Aichi.'],
      ['DD-011','DEAL-2026-014','Financial',    'Deloitte FAS',         'closed',   'QofE confirms $84M EBITDA with $6M of normalization adjustments.'],
      ['DD-012','DEAL-2026-015','Actuarial',    'Milliman',             'in_review','Reserve adequacy good; CAT exposure to FL hurricane is in line with Aon.'],
      ['DD-013','DEAL-2026-009','HR',           'Mercer',               'open',     'IG Metall negotiations on plant closures pending; could delay close 30-45 days.'],
      ['DD-014','DEAL-2026-011','EH&S',         'Ramboll',              'in_review','Pune plant air emissions within consent; one waste stream needs reclassification.'],
      ['DD-015','DEAL-2026-007','Clinical',     'IQVIA',                'open',     'Phase III enrollment behind plan by ~14%; FDA pre-submission meeting scheduled.'],
    ];
    for (const r of dd) {
      await client.query(
        `INSERT INTO due_diligence_items (dd_id,deal_id,area,owner,status,findings) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting financial_models...');
    const fm = [
      ['FM-001','DEAL-2026-001','Helios DCF + synergy build',     'v4.2', 0.182, 'in_review'],
      ['FM-002','DEAL-2026-002','Northwind LBO base + downside',  'v3.0', 0.241, 'approved'],
      ['FM-003','DEAL-2026-005','Quantum ARR rule-of-40 build',   'v2.5', 0.298, 'in_review'],
      ['FM-004','DEAL-2026-006','Atlas project finance model',    'v5.1', 0.131, 'approved'],
      ['FM-005','DEAL-2026-008','Crescent regulatory cap model',  'v2.0', 0.116, 'in_review'],
      ['FM-006','DEAL-2026-009','Pioneer Auto operating model',   'v1.8', 0.165, 'draft'],
      ['FM-007','DEAL-2026-010','Nimbus SaaS cohort model',       'v2.2', 0.224, 'in_review'],
      ['FM-008','DEAL-2026-013','Polaris EV unit economics',      'v3.4', 0.158, 'approved'],
      ['FM-009','DEAL-2026-014','Sterling QofE-linked LBO',       'v4.6', 0.207, 'approved'],
      ['FM-010','DEAL-2026-015','Harbor insurance DCF + ECM',     'v2.1', 0.144, 'in_review'],
      ['FM-011','DEAL-2026-011','Saffron chemicals cycle model',  'v1.5', 0.182, 'draft'],
      ['FM-012','DEAL-2026-007','Marlin device launch model',     'v1.2', 0.275, 'draft'],
      ['FM-013','DEAL-2026-012','Beacon RevPAR sensitivity',      'v1.0', 0.119, 'draft'],
      ['FM-014','DEAL-2026-003','Verdant consumer build',         'v1.3', 0.176, 'draft'],
      ['FM-015','DEAL-2026-004','Kestrel cyber SaaS model',       'v2.0', 0.312, 'in_review'],
    ];
    for (const r of fm) {
      await client.query(
        `INSERT INTO financial_models (model_id,deal_id,name,version,base_case_irr,status) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting comps...');
    const comps = [
      ['CMP-001','DEAL-2026-001','Vertex Pharma acquisition (2024)',     8.4, 'EV/Revenue', 'S&P CapIQ'],
      ['CMP-002','DEAL-2026-001','Horizon Therapeutics / Amgen (2023)',  11.2,'EV/Revenue', 'Mergermarket'],
      ['CMP-003','DEAL-2026-002','XPO / Forward Air merger',              9.5, 'EV/EBITDA',  'PitchBook'],
      ['CMP-004','DEAL-2026-005','Coupa Software / Thoma Bravo (2023)',  12.1,'EV/ARR',     'S&P CapIQ'],
      ['CMP-005','DEAL-2026-005','Anaplan / Thoma Bravo (2022)',         13.8,'EV/ARR',     'PitchBook'],
      ['CMP-006','DEAL-2026-006','EDP Renovaveis / private take-priv',   11.4,'EV/EBITDA',  'S&P CapIQ'],
      ['CMP-007','DEAL-2026-008','First Horizon / TD Bank attempt',       1.8, 'P/B',        'Bloomberg'],
      ['CMP-008','DEAL-2026-009','ZF / WABCO (2020)',                     8.9, 'EV/EBITDA',  'Mergermarket'],
      ['CMP-009','DEAL-2026-010','Switch Inc / DigitalBridge (2022)',    16.4,'EV/EBITDA',  'PitchBook'],
      ['CMP-010','DEAL-2026-011','Ashland specialty / Avient',            8.2, 'EV/EBITDA',  'S&P CapIQ'],
      ['CMP-011','DEAL-2026-013','BorgWarner / Delphi Tech (2020)',       7.1, 'EV/EBITDA',  'Mergermarket'],
      ['CMP-012','DEAL-2026-014','TransDigm / CPI Aero (2022)',          12.3,'EV/EBITDA',  'PitchBook'],
      ['CMP-013','DEAL-2026-015','Chubb / Cigna group benefits',          9.8, 'P/E',        'Bloomberg'],
      ['CMP-014','DEAL-2026-007','Hologic / Mobidiag (2021)',             6.9, 'EV/Revenue', 'S&P CapIQ'],
      ['CMP-015','DEAL-2026-003','J.M. Smucker / Hostess Brands (2023)',  3.2, 'EV/Revenue', 'PitchBook'],
    ];
    for (const r of comps) {
      await client.query(
        `INSERT INTO comps (comp_id,deal_id,target,multiple,metric,source) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting working_capital_adjustments...');
    const wca = [
      ['WCA-001','DEAL-2026-014','Inventory normalization',                12000000, 'increase','agreed'],
      ['WCA-002','DEAL-2026-014','AR aged > 90 days reserve',              -4500000, 'decrease','agreed'],
      ['WCA-003','DEAL-2026-002','Deferred revenue reclassification',     -22000000, 'decrease','disputed'],
      ['WCA-004','DEAL-2026-006','Capex true-up post-construction',         8500000, 'increase','pending'],
      ['WCA-005','DEAL-2026-008','Loan loss reserve top-up',              -36000000, 'decrease','pending'],
      ['WCA-006','DEAL-2026-010','Prepaid hosting credits',                 5400000, 'increase','agreed'],
      ['WCA-007','DEAL-2026-013','Warranty reserve build',                 -7800000, 'decrease','disputed'],
      ['WCA-008','DEAL-2026-001','Clinical trial accruals',                -3200000, 'decrease','agreed'],
      ['WCA-009','DEAL-2026-005','Unearned revenue normalization',        -14800000, 'decrease','pending'],
      ['WCA-010','DEAL-2026-015','UPR / unearned premium reserve',        -28000000, 'decrease','disputed'],
      ['WCA-011','DEAL-2026-009','Tooling deposit refunds',                 2100000, 'increase','agreed'],
      ['WCA-012','DEAL-2026-011','Hazardous waste reserve',                -1800000, 'decrease','agreed'],
      ['WCA-013','DEAL-2026-007','Inventory obsolescence',                 -2400000, 'decrease','pending'],
      ['WCA-014','DEAL-2026-012','Loyalty point liability',                -3900000, 'decrease','disputed'],
      ['WCA-015','DEAL-2026-003','Trade promotion accrual',                -5600000, 'decrease','pending'],
    ];
    for (const r of wca) {
      await client.query(
        `INSERT INTO working_capital_adjustments (wca_id,deal_id,item,amount_usd,direction,status) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting integration_plans...');
    const ip = [
      ['IP-001','DEAL-2026-014','Finance & Accounting',  'Maria Suarez (CFO)',     '2026-07-31','on_track'],
      ['IP-002','DEAL-2026-014','IT Systems & ERP',      'Tom Lee (CIO)',          '2026-09-30','at_risk'],
      ['IP-003','DEAL-2026-014','HR & Talent',           'Lisa Park (CHRO)',       '2026-08-15','on_track'],
      ['IP-004','DEAL-2026-006','Commercial / PPA mgmt', 'Carlos Mendez',          '2026-08-30','planning'],
      ['IP-005','DEAL-2026-006','Asset operations',      'Hans Schmidt',           '2026-09-15','planning'],
      ['IP-006','DEAL-2026-013','Engineering integration','Yuki Tanaka',           '2026-10-30','planning'],
      ['IP-007','DEAL-2026-013','Supply chain',          'Daniel Kim',             '2026-11-30','planning'],
      ['IP-008','DEAL-2026-002','Fleet & Operations',    'Mark Robinson',          '2026-08-31','at_risk'],
      ['IP-009','DEAL-2026-002','Customer migration',    'Jennifer Wu',            '2026-09-30','planning'],
      ['IP-010','DEAL-2026-005','Product roadmap merge', 'Andre Cunha',            '2026-12-31','planning'],
      ['IP-011','DEAL-2026-010','Cloud workload migration','Ravi Iyer',            '2026-11-15','planning'],
      ['IP-012','DEAL-2026-008','Branch network rationalization','Rebecca Coombs', '2027-03-31','planning'],
      ['IP-013','DEAL-2026-008','Regulatory remediation', 'Marcus Becker',         '2026-12-31','planning'],
      ['IP-014','DEAL-2026-009','Plant consolidation',    'Frank Müller',          '2027-06-30','planning'],
      ['IP-015','DEAL-2026-001','R&D portfolio prioritization','Dr. Anjali Rao',   '2026-12-15','planning'],
    ];
    for (const r of ip) {
      await client.query(
        `INSERT INTO integration_plans (plan_id,deal_id,workstream,lead,deadline,status) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting regulatory_filings...');
    const rf = [
      ['REG-001','DEAL-2026-006','EU Commission (DG COMP)',     'EU Merger Control',     'cleared',     '2026-04-15 09:00+00'],
      ['REG-002','DEAL-2026-006','US DOJ Antitrust',            'HSR Form',              'cleared',     '2026-04-10 14:00+00'],
      ['REG-003','DEAL-2026-008','Federal Reserve',             'Change in Control',     'under_review','2026-04-18 11:00+00'],
      ['REG-004','DEAL-2026-008','OCC',                         'Application',           'under_review','2026-04-18 11:30+00'],
      ['REG-005','DEAL-2026-008','FDIC',                        'Notice',                'under_review','2026-04-18 12:00+00'],
      ['REG-006','DEAL-2026-013','Japan FTC',                   'Pre-merger Notification','cleared',    '2026-04-22 09:00+00'],
      ['REG-007','DEAL-2026-013','US DOJ Antitrust',            'HSR Form',              'cleared',     '2026-04-25 10:00+00'],
      ['REG-008','DEAL-2026-014','CFIUS',                       'Voluntary Notice',      'cleared',     '2026-04-20 15:00+00'],
      ['REG-009','DEAL-2026-014','US DOJ Antitrust',            'HSR Form',              'cleared',     '2026-04-22 16:00+00'],
      ['REG-010','DEAL-2026-002','US DOJ Antitrust',            'HSR Form',              'prepared',    null],
      ['REG-011','DEAL-2026-010','Irish DPC',                   'GDPR Consultation',     'prepared',    null],
      ['REG-012','DEAL-2026-001','FTC',                         'HSR Form',              'prepared',    null],
      ['REG-013','DEAL-2026-005','US DOJ Antitrust',            'HSR Form',              'prepared',    null],
      ['REG-014','DEAL-2026-015','Bermuda Monetary Authority',  'Change in Control',     'prepared',    null],
      ['REG-015','DEAL-2026-009','BaFin / Bundeskartellamt',    'Merger Notification',   'prepared',    null],
    ];
    for (const r of rf) {
      await client.query(
        `INSERT INTO regulatory_filings (filing_id,deal_id,authority,type,status,filed_at) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting escrow_terms...');
    const esc = [
      ['ESC-001','DEAL-2026-014',  98000000, 18,'General reps & warranties survival','agreed'],
      ['ESC-002','DEAL-2026-014',  24000000, 84,'Pre-close tax liabilities',         'agreed'],
      ['ESC-003','DEAL-2026-006',  66000000, 36,'PPA throughput targets',            'agreed'],
      ['ESC-004','DEAL-2026-002',  46000000, 24,'Top-20 customer revenue retention', 'proposed'],
      ['ESC-005','DEAL-2026-008', 170000000, 60,'OCC consent order completion',      'proposed'],
      ['ESC-006','DEAL-2026-013',  55000000, 24,'EV drivetrain validation gates',    'proposed'],
      ['ESC-007','DEAL-2026-010',  43500000, 18,'Net dollar retention threshold',    'proposed'],
      ['ESC-008','DEAL-2026-001',  92500000, 36,'Phase III primary endpoint',        'proposed'],
      ['ESC-009','DEAL-2026-005',  62500000, 24,'NRR > 115% over earn-out',          'proposed'],
      ['ESC-010','DEAL-2026-015',  72500000, 36,'Adverse loss development trigger',  'proposed'],
      ['ESC-011','DEAL-2026-009',  29000000, 24,'IG Metall settlement',              'proposed'],
      ['ESC-012','DEAL-2026-011',  14400000, 60,'Remediation completion',            'proposed'],
      ['ESC-013','DEAL-2026-007',  19000000, 36,'510(k) clearance milestone',        'proposed'],
      ['ESC-014','DEAL-2026-012',   9800000, 24,'RevPAR vs comp set',                'proposed'],
      ['ESC-015','DEAL-2026-003',  16000000, 24,'Net sales growth target',           'proposed'],
    ];
    for (const r of esc) {
      await client.query(
        `INSERT INTO escrow_terms (escrow_id,deal_id,amount_usd,term_months,trigger,status) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting closing_checklist...');
    const cl = [
      ['CL-001','DEAL-2026-014','Execute SPA',                              'Maria Suarez',     '2026-05-15','complete'],
      ['CL-002','DEAL-2026-014','Wire funding instructions confirmed',      'Treasury',         '2026-05-22','complete'],
      ['CL-003','DEAL-2026-014','Bring-down certificates from officers',    'General Counsel',  '2026-05-24','in_progress'],
      ['CL-004','DEAL-2026-014','Lien releases and UCC-3 filings',          'Skadden',          '2026-05-25','in_progress'],
      ['CL-005','DEAL-2026-014','Title insurance binders',                  'Closing Agent',    '2026-05-26','open'],
      ['CL-006','DEAL-2026-006','Regulatory clearances log',                'Regulatory Lead',  '2026-05-30','in_progress'],
      ['CL-007','DEAL-2026-006','Asset register handover',                  'Operations',       '2026-05-30','open'],
      ['CL-008','DEAL-2026-013','Site-by-site environmental certificates',  'EH&S Director',    '2026-06-15','open'],
      ['CL-009','DEAL-2026-013','Customer assignment consents (top 10)',    'Commercial Lead',  '2026-06-20','open'],
      ['CL-010','DEAL-2026-002','Final IP assignment schedule',             'IP Counsel',       '2026-06-25','open'],
      ['CL-011','DEAL-2026-008','Federal Reserve Board approval',           'Regulatory',       '2026-07-30','open'],
      ['CL-012','DEAL-2026-008','Branch network valuation refresh',         'Investment Bank',  '2026-07-30','open'],
      ['CL-013','DEAL-2026-015','Reinsurance treaty consents',              'Underwriting',     '2026-06-30','open'],
      ['CL-014','DEAL-2026-010','Data residency attestations',              'DPO',              '2026-06-15','open'],
      ['CL-015','DEAL-2026-001','Clinical trial data room handoff',         'CRO Lead',         '2026-07-15','open'],
    ];
    for (const r of cl) {
      await client.query(
        `INSERT INTO closing_checklist (check_id,deal_id,item,owner,due_date,status) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting post_close_reports...');
    const pcr = [
      ['PCR-001','DEAL-2026-014','Q3 2026','Adj EBITDA vs plan',          '102.4%',         'on_track'],
      ['PCR-002','DEAL-2026-014','Q3 2026','Synergy capture run-rate',    '$14.2M',         'on_track'],
      ['PCR-003','DEAL-2026-014','Q3 2026','Customer retention',          '96.8%',          'on_track'],
      ['PCR-004','DEAL-2026-006','Q3 2026','Plant availability',          '94.1%',          'on_track'],
      ['PCR-005','DEAL-2026-006','Q3 2026','PPA realized price',          '€57.20/MWh',     'on_track'],
      ['PCR-006','DEAL-2026-013','Q4 2026','EV unit production',          '18,400 units',   'behind'],
      ['PCR-007','DEAL-2026-013','Q4 2026','Cost-per-unit',               '$3,840',         'behind'],
      ['PCR-008','DEAL-2026-002','Q4 2026','Fleet utilization',           '78.2%',          'on_track'],
      ['PCR-009','DEAL-2026-002','Q4 2026','Top-10 customer revenue',     '$612M TTM',      'on_track'],
      ['PCR-010','DEAL-2026-005','Q4 2026','NDR',                         '119%',           'on_track'],
      ['PCR-011','DEAL-2026-005','Q4 2026','ARR',                         '$352M',          'on_track'],
      ['PCR-012','DEAL-2026-010','Q4 2026','Gross margin',                '64.5%',          'on_track'],
      ['PCR-013','DEAL-2026-001','Q1 2027','R&D spend',                   '$108M',          'behind'],
      ['PCR-014','DEAL-2026-008','Q1 2027','CET1 ratio',                  '10.4%',          'on_track'],
      ['PCR-015','DEAL-2026-008','Q1 2027','Cost-to-income',              '54.1%',          'at_risk'],
    ];
    for (const r of pcr) {
      await client.query(
        `INSERT INTO post_close_reports (report_id,deal_id,period,kpi,value,status) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting audit_log...');
    const audit = [
      ['AUD-001','sarah.whitman@ms.com',      'DEAL-2026-001',                'view_cim',               'success', '2026-03-12 09:05+00'],
      ['AUD-002','david.chen@gs.com',         'DEAL-2026-002',                'download_loi',           'success', '2026-03-18 16:25+00'],
      ['AUD-003','elena.rossi@jpm.com',       'DOC-0005',                     'download',               'success', '2026-04-02 14:50+00'],
      ['AUD-004','admin@mandadeal.io',        'users',                        'create_user',            'success', '2026-04-05 10:00+00'],
      ['AUD-005','thomas.becker@bofa.com',    'DOC-0008',                     'download',               'success', '2026-04-15 08:35+00'],
      ['AUD-006','viewer@mandadeal.io',       'DEAL-2026-008',                'view_attempt',           'denied',  '2026-04-15 09:05+00'],
      ['AUD-007','sofia.reyes@qatalyst.com',  'DOC-0010',                     'download',               'success', '2026-04-22 15:05+00'],
      ['AUD-008','ben.goldberg@moelis.com',   'DEAL-2026-013',                'view_qa',                'success', '2026-04-28 10:20+00'],
      ['AUD-009','priya.iyer@jefferies.com',  'DOC-0012',                     'download',               'success', '2026-05-01 12:10+00'],
      ['AUD-010','admin@mandadeal.io',        'webhooks',                     'create_webhook',         'success', '2026-05-02 09:30+00'],
      ['AUD-011','james.holt@ubs.com',        'DOC-0014',                     'download',               'success', '2026-05-09 17:35+00'],
      ['AUD-012','advisor@mandadeal.io',      'CL-003',                       'update_status',          'success', '2026-05-12 11:00+00'],
      ['AUD-013','viewer@mandadeal.io',       'DEAL-2026-014',                'export_attempt',         'denied',  '2026-05-13 14:00+00'],
      ['AUD-014','admin@mandadeal.io',        'audit_log',                    'export_csv',             'success', '2026-05-14 09:00+00'],
      ['AUD-015','sarah.whitman@ms.com',      'TS-013',                       'circulate_term_sheet',   'success', '2026-05-15 16:00+00'],
    ];
    for (const r of audit) {
      await client.query(
        `INSERT INTO audit_log (entry_id,actor,target,action,result,ts) VALUES ($1,$2,$3,$4,$5,$6)`,
        r
      );
    }

    console.log('[seed] inserting users...');
    const users = [
      ['admin@mandadeal.io',   'admin123',   'M&A Admin',     'admin'],
      ['advisor@mandadeal.io', 'advisor123', 'Lead Advisor',  'advisor'],
      ['viewer@mandadeal.io',  'viewer123',  'Bidder Viewer', 'viewer'],
    ];
    for (const u of users) {
      await client.query(
        `INSERT INTO users (email,password,name,role) VALUES ($1,$2,$3,$4)`,
        u
      );
    }

    console.log('[seed] inserting notifications...');
    const notifications = [
      [1, 'Term sheet circulated',   'Helios Therapeutics TS v3.3 ready for review',  'high',     'term_sheets'],
      [1, 'Q&A response overdue',    'Crescent Bank OCC consent order Q&A awaiting response', 'critical', 'q_and_a'],
      [1, 'Regulatory clearance',    'EU DG COMP cleared Atlas Renewable Power',      'info',     'regulatory_filings'],
      [2, 'Closing checklist item',  'Sterling Aerospace title insurance binders due tomorrow', 'high', 'closing_checklist'],
      [2, 'New LOI submitted',       'Sanofi LOI submitted on Helios Therapeutics — $1.80B', 'info', 'lois'],
    ];
    for (const n of notifications) {
      await client.query(
        `INSERT INTO notifications (user_id,title,body,severity,source) VALUES ($1,$2,$3,$4,$5)`,
        n
      );
    }

    console.log('[seed] inserting webhooks...');
    const webhooks = [
      ['Deal Team Slack',    'https://httpbin.org/post', 'sec_dealteam_2026', 'deal.created,term_sheets.signed', true],
      ['Compliance Bridge',  'https://httpbin.org/post', 'sec_compliance_2026','regulatory_filings.created',     true],
    ];
    for (const w of webhooks) {
      await client.query(
        `INSERT INTO webhooks (name,url,secret,events,active) VALUES ($1,$2,$3,$4,$5)`,
        w
      );
    }

    console.log('[seed] complete.');
  } catch (e) {
    console.error('[seed] error:', e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
