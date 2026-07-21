# Governed deal financial review

The durable path is `/api/governed-deal-financials`. Tenant membership, Bearer auth, `X-Tenant-Id`, and an `Idempotency-Key` are mandatory. Versioned inputs move through reconciliation, calculation review, a locked period, independent approval, correction/reversal, and close. Monetary validation uses integer minor units, explicit currency, effective dates, tolerances, evidence digests, optimistic versions, and segregation of duties.

`backend/migrations/005_governed_financial_workflow.sql` is append-only and must be applied by an approved deployment migrator, never startup. Ledger, banking, billing, CRM, market-data, document, and filing integrations remain receipt-only declarations until credentials, data contracts, webhook replay/reconciliation tests, and owner approval exist. Provider AI routes are quarantined in production.

No calculation is an accounting, tax, underwriting, valuation, pricing, legal, or regulatory decision. Golden historical cases, corrected/late data, boundary values, and independent financial sign-off remain external professional gates.

Configure from `.env.example` using secret management. Keep bootstrap/demo/provider switches false. Verify with `node --test backend/governance/workflow.test.cjs` and `bash -n start.sh`. Startup performs no installs, port reclamation, database creation, migration, or seeding.
