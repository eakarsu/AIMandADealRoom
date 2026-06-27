import React from 'react';
import CrudPage from '../components/CrudPage';
import { documentCommentsApi } from '../services/api';

export default function DocumentCommentsPage() {
  return (
    <CrudPage
      title="Document Comments"
      subtitle="Secure document-level comments for diligence review, redline triage, and buyer Q&A follow-up."
      api={documentCommentsApi}
      statusKey="status"
      fields={[
        { key: 'comment_id', label: 'Comment ID' },
        { key: 'doc_id', label: 'Doc ID' },
        { key: 'deal_id', label: 'Deal ID' },
        { key: 'author', label: 'Author' },
        { key: 'visibility', label: 'Visibility', type: 'select', options: ['internal','seller','buyer','advisor','legal'] },
        { key: 'page_ref', label: 'Page / Section' },
        { key: 'comment_body', label: 'Comment', type: 'textarea' },
        { key: 'status', label: 'Status', type: 'select', options: ['open','resolved','escalated','deferred'] },
      ]}
    />
  );
}
