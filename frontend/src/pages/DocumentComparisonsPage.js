import React from 'react';
import CrudPage from '../components/CrudPage';
import { documentComparisonsApi } from '../services/api';

export default function DocumentComparisonsPage() {
  return (
    <CrudPage
      title="Document Comparisons"
      subtitle="Version comparison queue for LOIs, term sheets, purchase agreements, disclosure schedules, and diligence files."
      api={documentComparisonsApi}
      statusKey="status"
      fields={[
        { key: 'comparison_id', label: 'Comparison ID' },
        { key: 'deal_id', label: 'Deal ID' },
        { key: 'base_doc_id', label: 'Base Doc ID' },
        { key: 'revised_doc_id', label: 'Revised Doc ID' },
        { key: 'comparison_type', label: 'Type', type: 'select', options: ['redline','version_delta','risk_review','closing_set','disclosure_schedule'] },
        { key: 'risk_level', label: 'Risk', type: 'select', options: ['low','medium','high','critical'] },
        { key: 'material_changes', label: 'Material Changes', type: 'textarea' },
        { key: 'reviewer', label: 'Reviewer' },
        { key: 'status', label: 'Status', type: 'select', options: ['queued','reviewing','approved','needs_follow_up'] },
      ]}
    />
  );
}
