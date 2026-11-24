import { useState } from 'react';
import {
  Shield,
  Users,
  Plus,
  Edit3,
  Eye,
  Lock,
  Check,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import {
  PERMISSION_MODULES,
  ALL_PERMISSION_KEYS,
  initialRoles,
} from './roleService';
import { initialUsers } from '../users/userService';
import Modal from '../../components/common/Modal';

const roleAccentStyle = (roleName) => {
  switch (roleName) {
    case 'Admin':
      return {
        iconBg: 'bg-[#eef4ff] text-[#0b57d0]',
        badge: 'bg-[#eef4ff] text-[#0b57d0]',
      };
    case 'Engineer':
      return {
        iconBg: 'bg-[#f3eefe] text-[#7c3aed]',
        badge: 'bg-[#f3eefe] text-[#7c3aed]',
      };
    case 'Technician':
      return {
        iconBg: 'bg-[#fff4e5] text-[#ea580c]',
        badge: 'bg-[#fff4e5] text-[#c2410c]',
      };
    case 'Production Engineer':
      return {
        iconBg: 'bg-[#e8f8ef] text-[#16a34a]',
        badge: 'bg-[#e8f8ef] text-[#15803d]',
      };
    default:
      return {
        iconBg: 'bg-[#f1f5f9] text-[#334155]',
        badge: 'bg-[#f1f5f9] text-[#475569]',
      };
  }
};

const RolesPermissions = () => {
  const [roles, setRoles] = useState(initialRoles);

  // View Permissions Modal State
  const [viewingRole, setViewingRole] = useState(null);

  // Add / Edit Role Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('add'); // 'add' | 'edit'
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [],
  });
  const [formError, setFormError] = useState('');

  // Confirmation Modal State (shown before saving permission changes)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Count assigned users from User Management dummy data
  const getAssignedUserCount = (roleName) =>
    initialUsers.filter((u) => u.role === roleName).length;

  const handleOpenAddModal = () => {
    setEditorMode('add');
    setEditingRoleId(null);
    setIsEditingAdmin(false);
    setFormError('');
    setRoleForm({
      name: '',
      description: '',
      permissions: ['dashboard.view'],
    });
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (role) => {
    setEditorMode('edit');
    setEditingRoleId(role.id);
    setIsEditingAdmin(Boolean(role.isProtected));
    setFormError('');
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.isProtected ? [...ALL_PERMISSION_KEYS] : [...role.permissions],
    });
    setIsEditorOpen(true);
  };

  const handleTogglePermission = (permKey) => {
    if (isEditingAdmin) return;
    setRoleForm((prev) => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((k) => k !== permKey)
          : [...prev.permissions, permKey],
      };
    });
  };

  const handleToggleModuleAll = (modulePermissions) => {
    if (isEditingAdmin) return;
    const moduleKeys = modulePermissions.map((p) => p.key);
    const allSelected = moduleKeys.every((k) => roleForm.permissions.includes(k));

    setRoleForm((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((k) => !moduleKeys.includes(k))
        : Array.from(new Set([...prev.permissions, ...moduleKeys])),
    }));
  };

  const handleEditorFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const trimmedName = roleForm.name.trim();
    if (!trimmedName) {
      setFormError('Role Name is required.');
      return;
    }

    const duplicate = roles.some(
      (r) =>
        r.name.toLowerCase() === trimmedName.toLowerCase() &&
        r.id !== editingRoleId
    );
    if (duplicate) {
      setFormError('A role with this name already exists.');
      return;
    }

    if (editorMode === 'edit') {
      // Show confirmation before saving permission changes
      setIsConfirmOpen(true);
      return;
    }

    // Create new custom role
    const newRole = {
      id: `role-${Date.now()}`,
      name: trimmedName,
      description:
        roleForm.description.trim() ||
        'Custom role with tailored module access permissions.',
      isDefault: false,
      isProtected: false,
      permissions: [...roleForm.permissions],
    };

    setRoles((prev) => [...prev, newRole]);
    setIsEditorOpen(false);
  };

  const handleConfirmSaveEdit = () => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== editingRoleId) return role;
        return {
          ...role,
          name: role.isProtected ? role.name : roleForm.name.trim(),
          description: roleForm.description.trim() || role.description,
          permissions: role.isProtected
            ? [...ALL_PERMISSION_KEYS]
            : [...roleForm.permissions],
        };
      })
    );

    setIsConfirmOpen(false);
    setIsEditorOpen(false);
  };

  const handleDeleteCustomRole = (role) => {
    if (role.isProtected || role.isDefault) return;
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
  };

  const renderPermissionMatrix = ({ selectedPermissions, readOnly = false }) => (
    <div className="space-y-4">
      {PERMISSION_MODULES.map((mod) => {
        const modKeys = mod.permissions.map((p) => p.key);
        const enabledInMod = modKeys.filter((k) =>
          selectedPermissions.includes(k)
        ).length;
        const allEnabledInMod = enabledInMod === modKeys.length;

        return (
          <div
            key={mod.id}
            className="rounded-xl border border-[#edf1f7] bg-[#f8fafc] overflow-hidden"
          >
            <div className="px-4 py-2.5 bg-white border-b border-[#edf1f7] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#0f172a]">
                  {mod.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#eef4ff] text-[#0b57d0] text-[10.5px] font-bold">
                  {enabledInMod} / {modKeys.length}
                </span>
              </div>

              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleToggleModuleAll(mod.permissions)}
                  className="text-[11px] font-bold text-[#0b57d0] hover:text-[#0947ab] cursor-pointer"
                >
                  {allEnabledInMod ? 'Unselect All' : 'Select All'}
                </button>
              )}
            </div>

            <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {mod.permissions.map((perm) => {
                const isChecked = selectedPermissions.includes(perm.key);
                return (
                  <label
                    key={perm.key}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                      isChecked
                        ? 'bg-white border-[#0b57d0]/30 text-[#0f172a]'
                        : 'bg-white/60 border-[#edf1f7] text-[#64748b]'
                    } ${readOnly ? 'cursor-default' : 'cursor-pointer hover:border-[#0b57d0]/50'}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={readOnly}
                      onChange={() => handleTogglePermission(perm.key)}
                      className="w-4 h-4 rounded border-[#cbd5e1] text-[#0b57d0] focus:ring-[#0b57d0]/20 disabled:opacity-75 cursor-pointer disabled:cursor-default"
                    />
                    <span className="leading-tight">{perm.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
            Roles &amp; Permissions
          </h2>
          <p className="text-xs font-medium text-[#64748b] mt-0.5">
            Manage role-based access and permissions across all modules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Role</span>
        </button>
      </section>

      {/* Role Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {roles.map((role) => {
          const accent = roleAccentStyle(role.name);
          const assignedUsers = getAssignedUserCount(role.name);
          const totalPerms = ALL_PERMISSION_KEYS.length;

          return (
            <div
              key={role.id}
              className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl ${accent.iconBg} flex items-center justify-center shrink-0`}
                  >
                    {role.isProtected ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <Shield className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {role.isProtected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-[10.5px] font-bold">
                        <Lock className="w-3 h-3" />
                        Full Access
                      </span>
                    ) : role.isDefault ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#f3f6fb] text-[#475569] text-[10.5px] font-bold">
                        Default Role
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomRole(role)}
                        title="Delete custom role"
                        className="p-1.5 rounded-lg text-[#dc2626] hover:bg-[#feeceb] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">
                    {role.name}
                  </h3>
                  <p className="text-xs font-medium text-[#64748b] mt-1 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#475569]">
                    <Users className="w-3.5 h-3.5 text-[#0b57d0]" />
                    <span>{assignedUsers} Assigned Users</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${accent.badge}`}
                  >
                    {role.permissions.length}/{totalPerms}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setViewingRole(role)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155] text-xs font-bold transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Permissions</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(role)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Role</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Role Workflow Summary Reference */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="pb-4 mb-4 border-b border-[#f1f5f9]">
          <h3 className="text-base font-extrabold text-[#0f172a]">
            Access &amp; Approval Workflow Overview
          </h3>
          <p className="text-xs font-medium text-[#64748b] mt-0.5">
            How role permissions govern operational handoffs across plant modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#fff4e5] text-[#c2410c] font-bold text-[11px]">
              Step 1 • Execution
            </span>
            <h4 className="font-extrabold text-[#0f172a] mt-2">
              Technician &amp; Production Engineer
            </h4>
            <p className="text-[#64748b] mt-1 leading-relaxed">
              Technicians fill and submit PM checklists and report faults; Production Engineers manage shift plans and report machine breakdowns.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#f3eefe] text-[#7c3aed] font-bold text-[11px]">
              Step 2 • Review &amp; Approval
            </span>
            <h4 className="font-extrabold text-[#0f172a] mt-2">
              Maintenance Engineer
            </h4>
            <p className="text-[#64748b] mt-1 leading-relaxed">
              Engineers schedule PMs, review and approve/reject submitted PM checklists, submit breakdown RCA, and manage store inventory.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#eef4ff] text-[#0b57d0] font-bold text-[11px]">
              Step 3 • Governance &amp; Closure
            </span>
            <h4 className="font-extrabold text-[#0f172a] mt-2">
              Plant Administrator
            </h4>
            <p className="text-[#64748b] mt-1 leading-relaxed">
              Admin has unrestricted access to all modules, closes verified breakdown records, and controls users and roles.
            </p>
          </div>
        </div>
      </section>

      {/* Modal 1: View Role Permissions (Read-Only Matrix) */}
      <Modal
        isOpen={Boolean(viewingRole)}
        onClose={() => setViewingRole(null)}
        maxWidth="max-w-4xl"
        scrollable
        headerContent={
          viewingRole && (
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                  roleAccentStyle(viewingRole.name).badge
                }`}
              >
                {viewingRole.name}
              </span>
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a]">
                  {viewingRole.name} — Role Permissions
                </h3>
                <p className="text-xs text-[#64748b]">
                  {viewingRole.permissions.length} of {ALL_PERMISSION_KEYS.length}{' '}
                  permissions enabled • {getAssignedUserCount(viewingRole.name)} assigned user(s)
                </p>
              </div>
            </div>
          )
        }
        footer={
          viewingRole && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const target = viewingRole;
                  setViewingRole(null);
                  handleOpenEditModal(target);
                }}
                className="px-4 py-2 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Edit Role
              </button>
              <button
                type="button"
                onClick={() => setViewingRole(null)}
                className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          )
        }
      >
        {viewingRole && (
          <div className="p-6 overflow-y-auto space-y-4">
            <p className="text-xs text-[#475569] bg-[#f4f7fb] p-3.5 rounded-xl leading-relaxed">
              {viewingRole.description}
            </p>
            {renderPermissionMatrix({
              selectedPermissions: viewingRole.permissions,
              readOnly: true,
            })}
          </div>
        )}
      </Modal>

      {/* Modal 2: Add New Role / Edit Role & Permissions */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        maxWidth="max-w-4xl"
        scrollable
        title={
          editorMode === 'edit'
            ? `Edit Role & Permissions — ${roleForm.name}`
            : 'Add New Role'
        }
        subtitle={
          editorMode === 'edit'
            ? 'Modify role details and toggle module permissions below'
            : 'Define a custom role name, description, and module permissions'
        }
      >
        <form
          onSubmit={handleEditorFormSubmit}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="p-6 overflow-y-auto space-y-5 text-xs">
            {formError && (
              <div className="p-3 rounded-xl bg-[#feeceb] border border-[#fecaca] text-[#b91c1c] font-bold">
                {formError}
              </div>
            )}

            {isEditingAdmin && (
              <div className="p-3.5 rounded-xl bg-[#eef4ff] border border-[#dce7ff] text-[#0b57d0] font-semibold flex items-center gap-2.5">
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  The default Admin role retains full access across all modules and cannot be restricted or deleted.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  disabled={isEditingAdmin}
                  value={roleForm.name}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, name: e.target.value })
                  }
                  placeholder="e.g. Shift Supervisor"
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] disabled:opacity-60 focus:outline-none focus:border-[#0b57d0]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Role Description *
                </label>
                <input
                  type="text"
                  required
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, description: e.target.value })
                  }
                  placeholder="Short summary of this role's responsibilities..."
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider">
                  Module Permission Matrix
                </h4>
                <span className="text-xs font-bold text-[#0b57d0]">
                  {roleForm.permissions.length} / {ALL_PERMISSION_KEYS.length}{' '}
                  Selected
                </span>
              </div>

              {renderPermissionMatrix({
                selectedPermissions: roleForm.permissions,
                readOnly: isEditingAdmin,
              })}
            </div>
          </div>

          <div className="px-6 py-3.5 bg-[#f8fafc] border-t border-[#edf1f7] flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] text-xs font-bold text-[#475569] hover:bg-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
            >
              {editorMode === 'edit' ? 'Save Changes' : 'Save Role'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Confirmation before Saving Permission Changes */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm Permission Changes"
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-4 text-xs">
          <p className="text-[#334155] leading-relaxed">
            Are you sure you want to save the updated permissions for the{' '}
            <strong className="text-[#0f172a]">{roleForm.name}</strong> role?
          </p>

          <div className="p-3.5 rounded-xl bg-[#f4f7fb] space-y-1 text-[#334155]">
            <p>
              • Enabled Permissions:{' '}
              <strong>
                {roleForm.permissions.length} / {ALL_PERMISSION_KEYS.length}
              </strong>
            </p>
            <p>
              • Affected Users:{' '}
              <strong>{getAssignedUserCount(roleForm.name)} employee(s)</strong>
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] text-xs font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSaveEdit}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm &amp; Save</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RolesPermissions;
