import React from 'react';
import CrudPage from '../components/CrudPage';
import { qAndAApi } from '../services/api';

export default function QAndAPage() {
  return (
    <CrudPage
      title="Q&A"
      subtitle="Bidder questions routed through the VDR."
      api={qAndAApi}
      statusKey="status"
      fields={[
        { key: 'qa_id',    label: 'Q&A ID' },
        { key: 'deal_id',  label: 'Deal ID' },
        { key: 'question', label: 'Question', type: 'textarea' },
        { key: 'asker',    label: 'Asker' },
        { key: 'answer',   label: 'Answer',   type: 'textarea' },
        { key: 'status',   label: 'Status',   type: 'select', options: ['open','answered','closed'] },
      ]}
    />
  );
}
