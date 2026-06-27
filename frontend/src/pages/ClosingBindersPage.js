import React from 'react';
import CrudPage from '../components/CrudPage';
import { closingBindersApi } from '../services/api';

export default function ClosingBindersPage() {
  return (
    <CrudPage
      title="Closing Binders"
      subtitle="Exportable deal books, board packs, signing sets, and closing binder packages."
      api={closingBindersApi}
      statusKey="status"
      fields={[
        { key: 'binder_id', label: 'Binder ID' },
        { key: 'deal_id', label: 'Deal ID' },
        { key: 'binder_name', label: 'Binder Name' },
        { key: 'binder_type', label: 'Type', type: 'select', options: ['deal_book','board_pack','signing_set','closing_binder','post_close_archive'] },
        { key: 'document_count', label: 'Documents', type: 'number' },
        { key: 'owner', label: 'Owner' },
        { key: 'export_format', label: 'Format', type: 'select', options: ['pdf','zip','xlsx_index','docx','secure_link'] },
        { key: 'status', label: 'Status', type: 'select', options: ['draft','building','ready','exported','archived'] },
        { key: 'exported_at', label: 'Exported At', type: 'datetime-local' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
