import React from 'react';
import CrudPage from '../components/CrudPage';
import { integrationPlansApi } from '../services/api';

export default function IntegrationPlansPage() {
  return (
    <CrudPage
      title="Integration Plans"
      subtitle="Post-merger integration workstreams across deals."
      api={integrationPlansApi}
      statusKey="status"
      fields={[
        { key: 'plan_id',    label: 'Plan ID' },
        { key: 'deal_id',    label: 'Deal ID' },
        { key: 'workstream', label: 'Workstream' },
        { key: 'lead',       label: 'Lead' },
        { key: 'deadline',   label: 'Deadline', type: 'date' },
        { key: 'status',     label: 'Status',   type: 'select', options: ['planning','on_track','at_risk','behind','complete'] },
      ]}
    />
  );
}
