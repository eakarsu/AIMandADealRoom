import React from 'react';
import CrudPage from '../components/CrudPage';
import { vdrDocumentsApi } from '../services/api';

export default function VdrDocumentsPage() {
  return (
    <CrudPage
      title="VDR Documents"
      subtitle="Virtual Data Room — documents organized by deal and category."
      api={vdrDocumentsApi}
      fields={[
        { key: 'doc_id',      label: 'Doc ID' },
        { key: 'deal_id',     label: 'Deal ID' },
        { key: 'name',        label: 'Filename' },
        { key: 'category',    label: 'Category' },
        { key: 'uploaded_at', label: 'Uploaded At', type: 'datetime-local' },
        { key: 'version',     label: 'Version' },
      ]}
    />
  );
}
