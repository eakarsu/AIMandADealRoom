import React from 'react';
import CrudPage from '../components/CrudPage';
import { dataRequestsApi } from '../services/api';

export default function DataRequestsPage() {
  return (
    <CrudPage
      title="Data Requests"
      subtitle="Structured request list tracking for buyer, lender, legal, finance, and operating diligence."
      api={dataRequestsApi}
      statusKey="status"
      fields={[
        { key: 'request_id', label: 'Request ID' },
        { key: 'deal_id', label: 'Deal ID' },
        { key: 'workstream', label: 'Workstream', type: 'select', options: ['financial','tax','legal','commercial','operations','technology','hr','environmental'] },
        { key: 'requested_item', label: 'Requested Item' },
        { key: 'requested_from', label: 'Requested From' },
        { key: 'owner', label: 'Owner' },
        { key: 'priority', label: 'Priority', type: 'select', options: ['low','medium','high','urgent'] },
        { key: 'due_date', label: 'Due Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['open','in_progress','answered','overdue','waived'] },
        { key: 'response_summary', label: 'Response Summary', type: 'textarea' },
      ]}
    />
  );
}
