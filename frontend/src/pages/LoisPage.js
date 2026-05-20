import React from 'react';
import CrudPage from '../components/CrudPage';
import { loisApi } from '../services/api';

export default function LoisPage() {
  return (
    <CrudPage
      title="Letters of Intent"
      subtitle="Submitted bids with value and exclusivity terms."
      api={loisApi}
      statusKey="status"
      fields={[
        { key: 'loi_id',           label: 'LOI ID' },
        { key: 'deal_id',          label: 'Deal ID' },
        { key: 'buyer',            label: 'Buyer' },
        { key: 'value_usd',        label: 'Value (USD)',      type: 'number' },
        { key: 'exclusivity_days', label: 'Exclusivity Days', type: 'number' },
        { key: 'status',           label: 'Status',           type: 'select', options: ['submitted','under_review','signed','rejected','withdrawn'] },
      ]}
    />
  );
}
