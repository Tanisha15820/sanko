import { useState } from 'react';
import {
  Plus,
  RotateCcw,
  Eye,
  Edit3,
  Power,
  Mail,
  Phone,
  Building2,
  Calendar,
} from 'lucide-react';
import { initialUsers, USER_ROLES, USER_DEPARTMENTS } from './userService';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput from '../../components/common/SearchInput';
import TablePagination from '../../components/common/TablePagination';
import { usePagination } from '../../hooks/usePagination';

const roleBadgeStyle = (role) => {
  switch (role) {
    case 'Admin':
      return 'bg-[#eef4ff] text-[#0b57d0]';
    case 'Engineer':
      return 'bg-[#f3eefe] text-[#7c3aed]';
    case 'Technician':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Production Engineer':
      return 'bg-[#e8f8ef] text-[#15803d]';
    default:
      return 'bg-[#f1f5f9] text-[#475569]';
  }
};

const emptyFormState = {
  employeeId: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  department: USER_DEPARTMENTS[0],
  role: USER_ROLES[1],
  password: '',
  confirmPassword: '',
  status: 'Active',
};

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(emptyFormState);
  const [formError, setFormError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Filtered Users
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      user.employeeId.toLowerCase().includes(query) ||
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'All Status' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    paginatedItems: paginatedUsers,
    setCurrentPage,
  } = usePagination(
    filteredUsers,
    10,
    `${searchQuery}|${roleFilter}|${statusFilter}`
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('All Roles');
    setStatusFilter('All Status');
  };

  const handleOpenAddModal = () => {
    const nextNum = String(users.length + 1).padStart(3, '0');
    setIsEditMode(false);
    setFormError('');
    setFormData({
      ...emptyFormState,
      employeeId: `SG-EMP-${nextNum}`,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setIsEditMode(true);
    setFormError('');
    setFormData({
      employeeId: user.employeeId,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      department: user.department,
      role: user.role,
      password: '',
      confirmPassword: '',
      status: user.status,
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!isEditMode && formData.password !== formData.confirmPassword) {
      setFormError('Password and Confirm Password do not match.');
      return;
    }

    if (
      isEditMode &&
      (formData.password || formData.confirmPassword) &&
      formData.password !== formData.confirmPassword
    ) {
      setFormError('Password and Confirm Password do not match.');
      return;
    }

    if (isEditMode) {
      setUsers((prev) =>
        prev.map((u) =>
          u.employeeId === formData.employeeId
            ? {
                ...u,
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                department: formData.department,
                role: formData.role,
                status: formData.status,
              }
            : u
        )
      );

      if (selectedUser && selectedUser.employeeId === formData.employeeId) {
        setSelectedUser((prev) => ({
          ...prev,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          department: formData.department,
          role: formData.role,
          status: formData.status,
        }));
      }
    } else {
      const todayFormatted = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const newUser = {
        employeeId: formData.employeeId.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        department: formData.department,
        role: formData.role,
        status: formData.status,
        createdAt: todayFormatted,
      };

      setUsers((prev) => [newUser, ...prev]);
    }

    setIsFormModalOpen(false);
  };

  const handleToggleStatus = (employeeId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.employeeId === employeeId
          ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      )
    );

    if (selectedUser && selectedUser.employeeId === employeeId) {
      setSelectedUser((prev) => ({
        ...prev,
        status: prev.status === 'Active' ? 'Inactive' : 'Active',
      }));
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Section: Title, Subtitle & Add User Button */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
            User Management
          </h2>
          <p className="text-xs font-medium text-[#64748b] mt-0.5">
            Manage employees, assign roles and control user access.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </section>

      {/* Search & Filters Bar */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1">
            {/* Search by Name, ID or Email */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Search Employees
              </label>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, ID or email..."
                variant="bordered"
              />
            </div>

            {/* Filter by Role */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Assigned Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Roles', ...USER_ROLES].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Account Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Status', 'Active', 'Inactive'].map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </section>

      {/* Users Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              Employee Directory &amp; Access Control
            </h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              View employee profiles, update assigned roles, and activate or deactivate user accounts
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold self-start sm:self-auto">
            {filteredUsers.length} Users Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Employee ID</th>
                <th className="py-3.5 px-5">Employee Name</th>
                <th className="py-3.5 px-5">Email</th>
                <th className="py-3.5 px-5">Phone Number</th>
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-5">Assigned Role</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {paginatedUsers.map((user) => (
                <tr key={user.employeeId} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#0b57d0] whitespace-nowrap">
                    {user.employeeId}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                    {user.fullName}
                  </td>
                  <td className="py-3.5 px-5 text-[#475569] whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-5 text-[#475569] font-medium whitespace-nowrap">
                    {user.phoneNumber}
                  </td>
                  <td className="py-3.5 px-5 text-[#334155] font-medium whitespace-nowrap">
                    {user.department}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${roleBadgeStyle(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <StatusBadge
                      status={user.status}
                      variant={user.status === 'Active' ? 'green' : 'slate'}
                      showDot
                    />
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(user)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user.employeeId)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        user.status === 'Active'
                          ? 'bg-[#feeceb] hover:bg-[#dc2626] text-[#b91c1c] hover:text-white'
                          : 'bg-[#e8f8ef] hover:bg-[#16a34a] text-[#15803d] hover:text-white'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{user.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-[#64748b]">
                    No users match your current search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startItem={startItem}
          endItem={endItem}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* Modal 1: Add / Edit User Form */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={isEditMode ? `Edit User (${formData.employeeId})` : 'Add New User'}
        subtitle={
          isEditMode
            ? 'Update employee information, assigned role, or account status'
            : 'Create a new employee account and assign role permissions'
        }
        scrollable
      >
        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-[#feeceb] border border-[#fecaca] text-[#b91c1c] font-bold">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Employee ID *
              </label>
              <input
                type="text"
                required
                disabled={isEditMode}
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                placeholder="e.g. SG-EMP-009"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] disabled:opacity-60 focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="e.g. Deepak Patel"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="name@sankogosei.com"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="+91 98200 00000"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {USER_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned Role */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Assigned Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Password {isEditMode ? '(Optional)' : '*'}
              </label>
              <input
                type="password"
                required={!isEditMode}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={isEditMode ? 'Leave blank to keep current' : 'Enter password'}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Confirm Password {isEditMode ? '(Optional)' : '*'}
              </label>
              <input
                type="password"
                required={!isEditMode}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Re-enter password"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          {/* Account Status */}
          <div>
            <label className="block font-bold text-[#334155] mb-1.5">
              Account Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
            >
              {isEditMode ? 'Update User' : 'Save User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: User Details View */}
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        headerContent={
          selectedUser && (
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                {selectedUser.employeeId}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${roleBadgeStyle(
                  selectedUser.role
                )}`}
              >
                {selectedUser.role}
              </span>
              <StatusBadge
                status={selectedUser.status}
                variant={selectedUser.status === 'Active' ? 'green' : 'slate'}
                showDot
                className="px-2.5 py-0.5 text-xs"
              />
            </div>
          )
        }
      >
        {selectedUser && (
          <div className="p-6 space-y-4 text-xs">
            <div>
              <p className="text-[#64748b] font-medium">Employee Full Name</p>
              <h4 className="text-base font-extrabold text-[#0f172a] mt-0.5">
                {selectedUser.fullName}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#0b57d0] mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[#64748b]">Email Address</p>
                  <p className="font-bold text-[#0f172a] mt-0.5 break-all">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#0b57d0] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#64748b]">Phone Number</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {selectedUser.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#0b57d0] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#64748b]">Department</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {selectedUser.department}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#0b57d0] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#64748b]">Account Created On</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {selectedUser.createdAt}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedUser.employeeId)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedUser.status === 'Active'
                    ? 'bg-[#feeceb] hover:bg-[#dc2626] text-[#b91c1c] hover:text-white'
                    : 'bg-[#e8f8ef] hover:bg-[#16a34a] text-[#15803d] hover:text-white'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>
                  {selectedUser.status === 'Active'
                    ? 'Deactivate Account'
                    : 'Activate Account'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const userToEdit = selectedUser;
                    setSelectedUser(null);
                    handleOpenEditModal(userToEdit);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#eef4ff] text-[#0b57d0] font-bold hover:bg-[#0b57d0] hover:text-white transition-colors cursor-pointer"
                >
                  Edit User
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
