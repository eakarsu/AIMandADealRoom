import React from 'react';
import CrudPage from '../components/CrudPage';
import { approvalWorkflowsApi } from '../services/api';

export default function ApprovalWorkflowsPage() {
  return (
    <CrudPage
      title="Approval Workflows"
      subtitle="Approval tracking for LOIs, term sheets, purchase agreements, closing docs, and board packages."
      api={approvalWorkflowsApi}
      statusKey="status"
      fields={[
        { key: 'approval_id', label: 'Approval ID' },
        { key: 'deal_id', label: 'Deal ID' },
        { key: 'artifact_type', label: 'Artifact Type', type: 'select', options: ['loi','term_sheet','purchase_agreement','closing_document','board_pack','regulatory_filing'] },
        { key: 'artifact_id', label: 'Artifact ID' },
        { key: 'approver', label: 'Approver' },
        { key: 'approval_step', label: 'Step' },
        { key: 'due_date', label: 'Due Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['pending','approved','rejected','changes_requested','delegated'] },
        { key: 'decision_notes', label: 'Decision Notes', type: 'textarea' },
      ]}
    />
  );
}
