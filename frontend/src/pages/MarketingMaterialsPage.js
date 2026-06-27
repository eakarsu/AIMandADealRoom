import React from 'react';
import CrudPage from '../components/CrudPage';
import { marketingMaterialsApi } from '../services/api';

export default function MarketingMaterialsPage() {
  return (
    <CrudPage
      title="Marketing Materials"
      subtitle="CIM, teaser, management presentation, lender deck, and Q&A packet tracker."
      api={marketingMaterialsApi}
      statusKey="status"
      fields={[
        { key: 'material_id', label: 'Material ID' },
        { key: 'deal_id', label: 'Deal ID' },
        { key: 'material_type', label: 'Type', type: 'select', options: ['teaser','cim','management_presentation','lender_deck','qa_packet','process_letter'] },
        { key: 'title', label: 'Title' },
        { key: 'owner', label: 'Owner' },
        { key: 'version', label: 'Version' },
        { key: 'status', label: 'Status', type: 'select', options: ['draft','internal_review','approved','shared','archived'] },
        { key: 'shared_at', label: 'Shared At', type: 'date' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
