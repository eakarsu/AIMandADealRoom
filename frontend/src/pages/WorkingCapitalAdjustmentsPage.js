import React from 'react';
import CrudPage from '../components/CrudPage';
import { workingCapitalAdjustmentsApi } from '../services/api';

export default function WorkingCapitalAdjustmentsPage() {
  return (
    <CrudPage
      title="Working Capital Adjustments"
      subtitle="True-up line items by deal with status."
      api={workingCapitalAdjustmentsApi}
      statusKey="status"
      fields={[
        { key: 'wca_id',     label: 'WCA ID' },
        { key: 'deal_id',    label: 'Deal ID' },
        { key: 'item',       label: 'Item' },
        { key: 'amount_usd', label: 'Amount (USD)', type: 'number' },
        { key: 'direction',  label: 'Direction',    type: 'select', options: ['increase','decrease'] },
        { key: 'status',     label: 'Status',       type: 'select', options: ['pending','agreed','disputed'] },
      ]}
    />
  );
}
