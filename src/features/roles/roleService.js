// Permission catalog and default role configurations (frontend state only, no localStorage)

export const PERMISSION_MODULES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    permissions: [
      { key: 'dashboard.view', label: 'View' },
    ],
  },
  {
    id: 'machine-management',
    name: 'Machine Management',
    permissions: [
      { key: 'machines.view_status', label: 'View Machine Status' },
      { key: 'machines.add', label: 'Add Machine' },
      { key: 'machines.edit', label: 'Edit Machine' },
      { key: 'breakdowns.view', label: 'View Breakdown' },
      { key: 'breakdowns.report', label: 'Report Breakdown' },
      { key: 'breakdowns.assign_engineer', label: 'Assign Engineer' },
      { key: 'breakdowns.submit_rca', label: 'Submit RCA' },
      { key: 'breakdowns.close', label: 'Close Breakdown' },
    ],
  },
  {
    id: 'production',
    name: 'Production',
    permissions: [
      { key: 'production.view_plan', label: 'View Production Plan' },
      { key: 'production.create_plan', label: 'Create Production Plan' },
      { key: 'production.edit_plan', label: 'Edit Production Plan' },
      { key: 'production.view_monitoring', label: 'View Production Monitoring' },
      { key: 'production.update_data', label: 'Update Production Data' },
    ],
  },
  {
    id: 'preventive-maintenance',
    name: 'Preventive Maintenance',
    permissions: [
      { key: 'pm.view_calendar', label: 'View PM Calendar' },
      { key: 'pm.schedule', label: 'Schedule PM' },
      { key: 'pm.edit_schedule', label: 'Edit PM Schedule' },
      { key: 'pm.fill_checklist', label: 'Fill PM Checklist' },
      { key: 'pm.submit_checklist', label: 'Submit PM Checklist' },
      { key: 'pm.review_checklist', label: 'Review PM Checklist' },
      { key: 'pm.approve_checklist', label: 'Approve PM Checklist' },
      { key: 'pm.reject_checklist', label: 'Reject / Return PM Checklist' },
      { key: 'pm.view_history', label: 'View PM History' },
    ],
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management',
    permissions: [
      { key: 'inventory.view_spare_parts', label: 'View Spare Parts' },
      { key: 'inventory.add_spare_parts', label: 'Add Spare Parts' },
      { key: 'inventory.edit_spare_parts', label: 'Edit Spare Parts' },
      { key: 'inventory.update_stock', label: 'Update Stock' },
      { key: 'inventory.view_tools', label: 'View Tool Management' },
      { key: 'inventory.add_tool', label: 'Add Tool' },
      { key: 'inventory.edit_tool', label: 'Edit Tool' },
      { key: 'inventory.issue_return_tool', label: 'Issue / Return Tool' },
    ],
  },
  {
    id: 'administration',
    name: 'Administration',
    permissions: [
      { key: 'admin.manage_users', label: 'Manage Users' },
      { key: 'admin.manage_roles', label: 'Manage Roles & Permissions' },
    ],
  },
];

export const ALL_PERMISSION_KEYS = PERMISSION_MODULES.flatMap((mod) =>
  mod.permissions.map((p) => p.key)
);

export const initialRoles = [
  {
    id: 'role-admin',
    name: 'Admin',
    description:
      'Complete administrative control across all plant modules, approvals, breakdown closures, and user access.',
    isDefault: true,
    isProtected: true,
    permissions: [...ALL_PERMISSION_KEYS],
  },
  {
    id: 'role-engineer',
    name: 'Engineer',
    description:
      'Manages breakdowns, RCA submissions, PM scheduling, checklist approvals, and full inventory operations.',
    isDefault: true,
    isProtected: false,
    permissions: [
      'dashboard.view',
      'machines.view_status',
      'machines.add',
      'machines.edit',
      'breakdowns.view',
      'breakdowns.report',
      'breakdowns.assign_engineer',
      'breakdowns.submit_rca',
      'production.view_plan',
      'production.view_monitoring',
      'pm.view_calendar',
      'pm.schedule',
      'pm.edit_schedule',
      'pm.fill_checklist',
      'pm.submit_checklist',
      'pm.review_checklist',
      'pm.approve_checklist',
      'pm.reject_checklist',
      'pm.view_history',
      'inventory.view_spare_parts',
      'inventory.add_spare_parts',
      'inventory.edit_spare_parts',
      'inventory.update_stock',
      'inventory.view_tools',
      'inventory.add_tool',
      'inventory.edit_tool',
      'inventory.issue_return_tool',
    ],
  },
  {
    id: 'role-technician',
    name: 'Technician',
    description:
      'Executes assigned PM checklists, reports machine breakdowns, and accesses spare parts and tooling.',
    isDefault: true,
    isProtected: false,
    permissions: [
      'dashboard.view',
      'machines.view_status',
      'breakdowns.view',
      'breakdowns.report',
      'pm.view_calendar',
      'pm.fill_checklist',
      'pm.submit_checklist',
      'pm.view_history',
      'inventory.view_spare_parts',
      'inventory.update_stock',
      'inventory.view_tools',
      'inventory.issue_return_tool',
    ],
  },
  {
    id: 'role-production-engineer',
    name: 'Production Engineer',
    description:
      'Plans and monitors shift production output, updates production data, and reports machine breakdowns.',
    isDefault: true,
    isProtected: false,
    permissions: [
      'dashboard.view',
      'machines.view_status',
      'breakdowns.view',
      'breakdowns.report',
      'production.view_plan',
      'production.create_plan',
      'production.edit_plan',
      'production.view_monitoring',
      'production.update_data',
    ],
  },
];
