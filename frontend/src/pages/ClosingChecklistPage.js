import React from 'react';
import CrudPage from '../components/CrudPage';
import { closingChecklistApi } from '../services/api';

export default function ClosingChecklistPage() {
  return (
    <CrudPage
      title="Closing Checklist"
      subtitle="Conditions precedent and deliverables for close."
      api={closingChecklistApi}
      statusKey="status"
      fields={[
        { key: 'check_id', label: 'Check ID' },
        { key: 'deal_id',  label: 'Deal ID' },
        { key: 'item',     label: 'Item' },
        { key: 'owner',    label: 'Owner' },
        { key: 'due_date', label: 'Due Date',  type: 'date' },
        { key: 'status',   label: 'Status',    type: 'select', options: ['open','in_progress','complete','waived'] },
      ]}
    />
  );
}
