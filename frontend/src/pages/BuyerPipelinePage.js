import React from 'react';
import CrudPage from '../components/CrudPage';
import { buyerPipelineApi } from '../services/api';

export default function BuyerPipelinePage() {
  return (
    <CrudPage
      title="Buyer Pipeline"
      subtitle="Buyer CRM for strategic, sponsor, and consortium bidders across the deal process."
      api={buyerPipelineApi}
      statusKey="stage"
      fields={[
        { key: 'buyer_id', label: 'Buyer ID' },
        { key: 'deal_id', label: 'Deal ID' },
        { key: 'buyer_name', label: 'Buyer' },
        { key: 'buyer_type', label: 'Type', type: 'select', options: ['strategic','sponsor','family_office','consortium','management'] },
        { key: 'contact_name', label: 'Contact' },
        { key: 'contact_email', label: 'Email' },
        { key: 'stage', label: 'Stage', type: 'select', options: ['targeted','teaser_sent','nda_sent','nda_signed','vdr_open','ioi_received','loi_received','inactive'] },
        { key: 'interest_score', label: 'Interest Score', type: 'number' },
        { key: 'last_touch_date', label: 'Last Touch', type: 'date' },
        { key: 'next_step', label: 'Next Step' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
