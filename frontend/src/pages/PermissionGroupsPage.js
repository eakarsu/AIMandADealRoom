import React from 'react';
import CrudPage from '../components/CrudPage';
import { permissionGroupsApi } from '../services/api';

export default function PermissionGroupsPage() {
  return (
    <CrudPage
      title="Permission Groups"
      subtitle="Permission groups for bidders, advisors, lenders, counsel, finance teams, and internal deal teams."
      api={permissionGroupsApi}
      statusKey="status"
      fields={[
        { key: 'group_id', label: 'Group ID' },
        { key: 'deal_id', label: 'Deal ID' },
        { key: 'group_name', label: 'Group Name' },
        { key: 'group_type', label: 'Type', type: 'select', options: ['bidder','advisor','legal','finance','lender','management','internal'] },
        { key: 'members_count', label: 'Members', type: 'number' },
        { key: 'access_level', label: 'Access', type: 'select', options: ['teaser','nda','limited_vdr','full_vdr','closing_room','admin'] },
        { key: 'watermark', label: 'Watermark', type: 'select', options: ['true','false'] },
        { key: 'status', label: 'Status', type: 'select', options: ['active','paused','revoked','pending'] },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
