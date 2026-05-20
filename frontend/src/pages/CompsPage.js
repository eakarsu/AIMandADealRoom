import React from 'react';
import CrudPage from '../components/CrudPage';
import { compsApi } from '../services/api';

export default function CompsPage() {
  return (
    <CrudPage
      title="Comparable Transactions"
      subtitle="Precedent transactions used to triangulate valuation."
      api={compsApi}
      fields={[
        { key: 'comp_id',  label: 'Comp ID' },
        { key: 'deal_id',  label: 'Deal ID' },
        { key: 'target',   label: 'Reference Transaction' },
        { key: 'multiple', label: 'Multiple', type: 'number' },
        { key: 'metric',   label: 'Metric',   type: 'select', options: ['EV/Revenue','EV/EBITDA','EV/ARR','P/E','P/B'] },
        { key: 'source',   label: 'Source' },
      ]}
    />
  );
}
