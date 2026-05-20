import React from 'react';
import CrudPage from '../components/CrudPage';
import { termSheetsApi } from '../services/api';

export default function TermSheetsPage() {
  return (
    <CrudPage
      title="Term Sheets"
      subtitle="Circulated term sheets and signed agreements."
      api={termSheetsApi}
      statusKey="status"
      fields={[
        { key: 'ts_id',         label: 'TS ID' },
        { key: 'deal_id',       label: 'Deal ID' },
        { key: 'version',       label: 'Version' },
        { key: 'valuation_usd', label: 'Valuation (USD)', type: 'number' },
        { key: 'status',        label: 'Status',          type: 'select', options: ['draft','circulating','signed','withdrawn'] },
        { key: 'signed_at',     label: 'Signed At',       type: 'datetime-local' },
      ]}
    />
  );
}
