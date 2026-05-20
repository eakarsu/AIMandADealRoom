import React from 'react';
import CrudPage from '../components/CrudPage';
import { targetsApi } from '../services/api';

export default function TargetsPage() {
  return (
    <CrudPage
      title="Targets"
      subtitle="Acquisition targets and their high-level financials."
      api={targetsApi}
      fields={[
        { key: 'target_id',   label: 'Target ID' },
        { key: 'name',        label: 'Name' },
        { key: 'sector',      label: 'Sector' },
        { key: 'country',     label: 'Country' },
        { key: 'revenue_usd', label: 'Revenue (USD)', type: 'number' },
        { key: 'ebitda_usd',  label: 'EBITDA (USD)',  type: 'number' },
      ]}
    />
  );
}
