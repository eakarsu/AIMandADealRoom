import React from 'react';
import CrudPage from '../components/CrudPage';
import { regulatoryFilingsApi } from '../services/api';

export default function RegulatoryFilingsPage() {
  return (
    <CrudPage
      title="Regulatory Filings"
      subtitle="Merger control, banking, environmental and trade filings."
      api={regulatoryFilingsApi}
      statusKey="status"
      fields={[
        { key: 'filing_id', label: 'Filing ID' },
        { key: 'deal_id',   label: 'Deal ID' },
        { key: 'authority', label: 'Authority' },
        { key: 'type',      label: 'Type' },
        { key: 'status',    label: 'Status',    type: 'select', options: ['prepared','filed','under_review','cleared','blocked','withdrawn'] },
        { key: 'filed_at',  label: 'Filed At',  type: 'datetime-local' },
      ]}
    />
  );
}
