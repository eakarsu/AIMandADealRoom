import React from 'react';
import CrudPage from '../components/CrudPage';
import { dealMilestonesApi } from '../services/api';

export default function DealMilestonesPage() {
  return (
    <CrudPage
      title="Deal Milestones"
      subtitle="Timeline and milestone calendar for diligence, bidder rounds, approvals, signing, and close."
      api={dealMilestonesApi}
      statusKey="status"
      fields={[
        { key: 'milestone_id', label: 'Milestone ID' },
        { key: 'deal_id', label: 'Deal ID' },
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category', type: 'select', options: ['launch','diligence','bid_round','approval','signing','closing','integration'] },
        { key: 'owner', label: 'Owner' },
        { key: 'start_date', label: 'Start', type: 'date' },
        { key: 'due_date', label: 'Due', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['not_started','in_progress','blocked','complete','at_risk'] },
        { key: 'dependency', label: 'Dependency' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
