import React from 'react';
import CrudPage from '../components/CrudPage';
import { workingGroupsApi } from '../services/api';

export default function WorkingGroupsPage() {
  return (
    <CrudPage
      title="Working Groups"
      subtitle="Diligence and execution workstreams across deals."
      api={workingGroupsApi}
      statusKey="status"
      fields={[
        { key: 'group_id',      label: 'Group ID' },
        { key: 'deal_id',       label: 'Deal ID' },
        { key: 'workstream',    label: 'Workstream' },
        { key: 'lead',          label: 'Lead Firm' },
        { key: 'members_count', label: 'Members', type: 'number' },
        { key: 'status',        label: 'Status',  type: 'select', options: ['active','paused','complete'] },
      ]}
    />
  );
}
