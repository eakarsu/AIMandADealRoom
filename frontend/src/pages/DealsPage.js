import React from 'react';
import CrudPage from '../components/CrudPage';
import { dealsApi } from '../services/api';

export default function DealsPage() {
  return (
    <CrudPage
      title="Deals"
      subtitle="Active and historical M&A transactions."
      api={dealsApi}
      statusKey="stage"
      fields={[
        { key: 'deal_id',        label: 'Deal ID' },
        { key: 'target_name',    label: 'Target' },
        { key: 'sector',         label: 'Sector' },
        { key: 'deal_value_usd', label: 'Deal Value (USD)', type: 'number' },
        { key: 'stage',          label: 'Stage',            type: 'select', options: ['sourcing','diligence','loi_signed','term_sheet','regulatory','closing','closed'] },
        { key: 'lead_advisor',   label: 'Lead Advisor' },
      ]}
    />
  );
}
