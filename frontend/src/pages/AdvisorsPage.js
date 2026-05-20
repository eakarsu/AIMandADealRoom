import React from 'react';
import CrudPage from '../components/CrudPage';
import { advisorsApi } from '../services/api';

export default function AdvisorsPage() {
  return (
    <CrudPage
      title="Advisors"
      subtitle="External M&A advisors, banking and legal contacts."
      api={advisorsApi}
      statusKey="status"
      fields={[
        { key: 'advisor_id', label: 'Advisor ID' },
        { key: 'name',       label: 'Name' },
        { key: 'firm',       label: 'Firm' },
        { key: 'role',       label: 'Role' },
        { key: 'contact',    label: 'Contact' },
        { key: 'status',     label: 'Status', type: 'select', options: ['active','on_leave','inactive'] },
      ]}
    />
  );
}
