import React from 'react';
import CrudPage from '../components/CrudPage';
import { dueDiligenceItemsApi } from '../services/api';

export default function DueDiligenceItemsPage() {
  return (
    <CrudPage
      title="Due Diligence Items"
      subtitle="DD workstream items with findings and status."
      api={dueDiligenceItemsApi}
      statusKey="status"
      fields={[
        { key: 'dd_id',    label: 'DD ID' },
        { key: 'deal_id',  label: 'Deal ID' },
        { key: 'area',     label: 'Area' },
        { key: 'owner',    label: 'Owner Firm' },
        { key: 'status',   label: 'Status',  type: 'select', options: ['open','in_review','closed'] },
        { key: 'findings', label: 'Findings',type: 'textarea' },
      ]}
    />
  );
}
