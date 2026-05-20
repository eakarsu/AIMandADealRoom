import React from 'react';
import CrudPage from '../components/CrudPage';
import { postCloseReportsApi } from '../services/api';

export default function PostCloseReportsPage() {
  return (
    <CrudPage
      title="Post-Close Reports"
      subtitle="KPI tracking against deal plan after close."
      api={postCloseReportsApi}
      statusKey="status"
      fields={[
        { key: 'report_id', label: 'Report ID' },
        { key: 'deal_id',   label: 'Deal ID' },
        { key: 'period',    label: 'Period' },
        { key: 'kpi',       label: 'KPI' },
        { key: 'value',     label: 'Value' },
        { key: 'status',    label: 'Status', type: 'select', options: ['reported','on_track','at_risk','behind'] },
      ]}
    />
  );
}
