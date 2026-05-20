import React from 'react';
import CrudPage from '../components/CrudPage';
import { escrowTermsApi } from '../services/api';

export default function EscrowTermsPage() {
  return (
    <CrudPage
      title="Escrow Terms"
      subtitle="Indemnity, regulatory and milestone escrows by deal."
      api={escrowTermsApi}
      statusKey="status"
      fields={[
        { key: 'escrow_id',   label: 'Escrow ID' },
        { key: 'deal_id',     label: 'Deal ID' },
        { key: 'amount_usd',  label: 'Amount (USD)',  type: 'number' },
        { key: 'term_months', label: 'Term (months)', type: 'number' },
        { key: 'trigger',     label: 'Trigger' },
        { key: 'status',      label: 'Status',        type: 'select', options: ['proposed','agreed','funded','released','expired'] },
      ]}
    />
  );
}
