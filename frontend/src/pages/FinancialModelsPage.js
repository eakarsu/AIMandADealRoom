import React from 'react';
import CrudPage from '../components/CrudPage';
import { financialModelsApi } from '../services/api';

export default function FinancialModelsPage() {
  return (
    <CrudPage
      title="Financial Models"
      subtitle="DCF, LBO, project finance and SaaS cohort models."
      api={financialModelsApi}
      statusKey="status"
      fields={[
        { key: 'model_id',      label: 'Model ID' },
        { key: 'deal_id',       label: 'Deal ID' },
        { key: 'name',          label: 'Name' },
        { key: 'version',       label: 'Version' },
        { key: 'base_case_irr', label: 'Base Case IRR', type: 'number' },
        { key: 'status',        label: 'Status',        type: 'select', options: ['draft','in_review','approved','retired'] },
      ]}
    />
  );
}
