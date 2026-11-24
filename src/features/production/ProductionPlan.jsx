import { useState } from 'react';
import {
  Plus,
  Calendar,
  RotateCcw,
  ClipboardList,
  Eye,
  Edit3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput from '../../components/common/SearchInput';
import {
  PLAN_STATUSES,
  PLAN_STATUS_VARIANTS,
  SHIFT_OPTIONS,
  PLANT_OPTIONS,
  DEPARTMENT_OPTIONS,
  PRODUCTION_LINE_OPTIONS,
  PRODUCTION_ENGINEERS,
  MACHINE_CATALOG,
  initialProductionPlans,
} from './productionData';

const ProductionPlan = () => {
  const { activeRole } = useAuth();
  const [plans, setPlans] = useState(initialProductionPlans);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [shiftFilter, setShiftFilter] = useState('All Shifts');
  const [lineFilter, setLineFilter] = useState('All Lines');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const [formData, setFormData] = useState({
    planId: '',
    plant: PLANT_OPTIONS[0],
    department: DEPARTMENT_OPTIONS[0],
    productionLine: PRODUCTION_LINE_OPTIONS[0],
    machineId: MACHINE_CATALOG[0].id,
    productName: '',
    plannedQuantity: '',
    targetDate: '2026-11-21',
    shift: 'Shift A',
    assignedProductionEngineer: PRODUCTION_ENGINEERS[0],
    planStatus: 'Scheduled',
  });

  const canManagePlans =
    activeRole === 'Production Engineer' || activeRole === 'Admin';

  const selectedPlan = plans.find((p) => p.planId === selectedPlanId) || null;

  // Role-scoped plans (Technician sees relevant Line A & Line B machines)
  const roleScopedPlans = plans.filter((plan) => {
    if (activeRole === 'Technician') {
      return (
        plan.productionLine === 'Line A - Automotive' ||
        plan.productionLine === 'Line B - Interior Trim'
      );
    }
    return true;
  });

  const filteredPlans = roleScopedPlans.filter((plan) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      plan.planId.toLowerCase().includes(q) ||
      plan.machineId.toLowerCase().includes(q) ||
      plan.machineName.toLowerCase().includes(q) ||
      plan.productName.toLowerCase().includes(q) ||
      plan.assignedProductionEngineer.toLowerCase().includes(q);
    const matchesDate = !selectedDate || plan.targetDate === selectedDate;
    const matchesShift =
      shiftFilter === 'All Shifts' || plan.shift === shiftFilter;
    const matchesLine =
      lineFilter === 'All Lines' || plan.productionLine === lineFilter;
    const matchesStatus =
      statusFilter === 'All Status' || plan.planStatus === statusFilter;
    return (
      matchesSearch &&
      matchesDate &&
      matchesShift &&
      matchesLine &&
      matchesStatus
    );
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDate('');
    setShiftFilter('All Shifts');
    setLineFilter('All Lines');
    setStatusFilter('All Status');
  };

  const handleOpenAddModal = () => {
    const nextNum = String(plans.length + 1).padStart(3, '0');
    const firstMachine = MACHINE_CATALOG[0];
    setIsEditMode(false);
    setFormData({
      planId: `PLN-2026-${nextNum}`,
      plant: firstMachine.plant,
      department: firstMachine.department,
      productionLine: firstMachine.line,
      machineId: firstMachine.id,
      productName: '',
      plannedQuantity: '',
      targetDate: '2026-11-21',
      shift: 'Shift A',
      assignedProductionEngineer: PRODUCTION_ENGINEERS[0],
      planStatus: 'Scheduled',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (plan) => {
    setIsEditMode(true);
    setFormData({
      planId: plan.planId,
      plant: plan.plant,
      department: plan.department,
      productionLine: plan.productionLine,
      machineId: plan.machineId,
      productName: plan.productName,
      plannedQuantity: String(plan.plannedQuantity),
      targetDate: plan.targetDate,
      shift: plan.shift,
      assignedProductionEngineer: plan.assignedProductionEngineer,
      planStatus: plan.planStatus,
    });
    setIsFormModalOpen(true);
  };

  const handleMachineSelect = (machineId) => {
    const found = MACHINE_CATALOG.find((m) => m.id === machineId);
    setFormData((prev) => ({
      ...prev,
      machineId,
      plant: found ? found.plant : prev.plant,
      department: found ? found.department : prev.department,
      productionLine: found ? found.line : prev.productionLine,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const machineObj =
      MACHINE_CATALOG.find((m) => m.id === formData.machineId) ||
      MACHINE_CATALOG[0];

    const record = {
      planId: formData.planId.trim(),
      plant: formData.plant,
      department: formData.department,
      productionLine: formData.productionLine,
      machineId: machineObj.id,
      machineName: machineObj.name,
      productName: formData.productName.trim(),
      plannedQuantity: Math.max(1, Number(formData.plannedQuantity) || 0),
      targetDate: formData.targetDate,
      shift: formData.shift,
      assignedProductionEngineer: formData.assignedProductionEngineer,
      planStatus: formData.planStatus,
    };

    if (isEditMode) {
      setPlans((prev) =>
        prev.map((p) => (p.planId === record.planId ? record : p))
      );
    } else {
      setPlans((prev) => [record, ...prev]);
    }

    setIsFormModalOpen(false);
  };

  const handleUpdatePlanStatus = (planId, nextStatus) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.planId === planId ? { ...p, planStatus: nextStatus } : p
      )
    );
  };

  return (
    <div className="space-y-5">
      {/* Role Scope Bar */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#0f172a]">
            Production Planning &amp; Shift Scheduling
          </h2>
          <p className="text-xs font-medium text-[#64748b] mt-0.5">
            {activeRole === 'Production Engineer' &&
              'Production Engineer View: Create, edit, and manage shift production plans.'}
            {activeRole === 'Admin' &&
              'Admin View: Full access to view and manage all plant production plans.'}
            {activeRole === 'Engineer' &&
              'Engineer View: Read-only visibility into scheduled production plans and machine targets.'}
            {activeRole === 'Technician' &&
              'Technician View: Relevant machine and production plan schedule for assigned lines.'}
          </p>
        </div>
      </section>

      {/* Production Plan Table Card */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0b57d0] flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#0f172a]">Production Plan</h3>
                <p className="text-xs font-medium text-[#64748b] mt-0.5">
                  Manage plant, line, machine targets, product schedules, and plan execution status
                </p>
              </div>
            </div>

            {canManagePlans && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Production Plan</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search plan ID, machine, product..."
                className="w-full sm:w-64"
              />

              <select
                value={lineFilter}
                onChange={(e) => setLineFilter(e.target.value)}
                className="h-9 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Lines', ...PRODUCTION_LINE_OPTIONS].map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Status', ...PLAN_STATUSES].map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-[#0b57d0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  title="Filter by Target Date"
                  className="h-9 pl-8 pr-3 bg-[#f3f6fb] hover:bg-[#edf2f9] focus:bg-white border border-[#d6deeb] focus:border-[#0b57d0] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none cursor-pointer"
                />
              </div>

              {(selectedDate ||
                searchQuery ||
                shiftFilter !== 'All Shifts' ||
                lineFilter !== 'All Lines' ||
                statusFilter !== 'All Status') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-9 px-2.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Shift Filter Pills */}
            <div className="inline-flex items-center bg-[#f3f6fb] p-1 rounded-xl">
              {['All Shifts', ...SHIFT_OPTIONS].map((sh) => (
                <button
                  key={sh}
                  type="button"
                  onClick={() => setShiftFilter(sh)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    shiftFilter === sh
                      ? 'bg-[#0b57d0] text-white shadow-xs'
                      : 'text-[#475569] hover:text-[#0f172a]'
                  }`}
                >
                  {sh}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Production Plan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-4">Plan ID</th>
                <th className="py-3.5 px-4">Plant / Line</th>
                <th className="py-3.5 px-4">Machine</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Planned Qty</th>
                <th className="py-3.5 px-4">Target Date</th>
                <th className="py-3.5 px-4">Shift</th>
                <th className="py-3.5 px-4">Assigned Engineer</th>
                <th className="py-3.5 px-4">Plan Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredPlans.map((plan) => (
                <tr key={plan.planId} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0b57d0] whitespace-nowrap">
                    {plan.planId}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-[#0f172a] block">
                      {plan.productionLine}
                    </span>
                    <span className="text-[11px] text-[#64748b]">
                      {plan.plant} • {plan.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#0b57d0] block">{plan.machineId}</span>
                    <span className="text-xs font-semibold text-[#0f172a]">
                      {plan.machineName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#0f172a] whitespace-nowrap">
                    {plan.productName}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#0f172a] whitespace-nowrap">
                    {Number(plan.plannedQuantity).toLocaleString()} pcs
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#334155] whitespace-nowrap">
                    {plan.targetDate}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                      {plan.shift}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                    {plan.assignedProductionEngineer}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge
                      status={plan.planStatus}
                      variant={PLAN_STATUS_VARIANTS[plan.planStatus] || 'blue'}
                      showDot
                      className="px-2.5 py-0.5 text-xs"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedPlanId(plan.planId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    {canManagePlans && (
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(plan)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-sm text-[#64748b]">
                    No production plan records match your current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal 1: Add / Edit Production Plan */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={isEditMode ? `Edit Production Plan (${formData.planId})` : 'Add Production Plan'}
        subtitle={
          isEditMode
            ? 'Update shift schedule, target quantity, or plan status'
            : 'Create a shift-wise machine production plan'
        }
        maxWidth="max-w-xl"
        scrollable
      >
        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Plan ID</label>
              <input
                type="text"
                disabled
                value={formData.planId}
                className="w-full h-10 px-3 bg-[#f1f5f9] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Machine *</label>
              <select
                value={formData.machineId}
                onChange={(e) => handleMachineSelect(e.target.value)}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {MACHINE_CATALOG.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} — {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Plant</label>
              <select
                value={formData.plant}
                onChange={(e) => setFormData({ ...formData, plant: e.target.value })}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {PLANT_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Production Line</label>
              <select
                value={formData.productionLine}
                onChange={(e) =>
                  setFormData({ ...formData, productionLine: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {PRODUCTION_LINE_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g. Door Trim Clip Housing"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Planned Production Quantity (pcs) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.plannedQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, plannedQuantity: e.target.value })
                }
                placeholder="e.g. 2500"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Target Date *</label>
              <input
                type="date"
                required
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {SHIFT_OPTIONS.map((sh) => (
                  <option key={sh} value={sh}>
                    {sh}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Plan Status</label>
              <select
                value={formData.planStatus}
                onChange={(e) => setFormData({ ...formData, planStatus: e.target.value })}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {PLAN_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1.5">
              Assigned Production Engineer
            </label>
            <select
              value={formData.assignedProductionEngineer}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assignedProductionEngineer: e.target.value,
                })
              }
              className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
            >
              {PRODUCTION_ENGINEERS.map((eng) => (
                <option key={eng} value={eng}>
                  {eng}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
            >
              {isEditMode ? 'Update Plan' : 'Save Production Plan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: View Plan Details */}
      <Modal
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlanId(null)}
        headerContent={
          selectedPlan && (
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                {selectedPlan.planId}
              </span>
              <StatusBadge
                status={selectedPlan.planStatus}
                variant={PLAN_STATUS_VARIANTS[selectedPlan.planStatus] || 'blue'}
                showDot
                className="px-2.5 py-0.5 text-xs"
              />
            </div>
          )
        }
      >
        {selectedPlan && (
          <div className="p-6 space-y-4 text-xs">
            <div>
              <p className="text-[#64748b] font-medium">Product Name</p>
              <h4 className="text-base font-extrabold text-[#0f172a] mt-0.5">
                {selectedPlan.productName}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3.5 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <div>
                <p className="text-[#64748b]">Plant &amp; Department</p>
                <p className="font-bold text-[#0f172a] mt-0.5">
                  {selectedPlan.plant} • {selectedPlan.department}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Production Line</p>
                <p className="font-bold text-[#0f172a] mt-0.5">
                  {selectedPlan.productionLine}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Machine</p>
                <p className="font-bold text-[#0b57d0] mt-0.5">
                  {selectedPlan.machineId} — {selectedPlan.machineName}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Planned Quantity</p>
                <p className="text-sm font-extrabold text-[#0f172a] mt-0.5">
                  {Number(selectedPlan.plannedQuantity).toLocaleString()} pcs
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Target Date &amp; Shift</p>
                <p className="font-bold text-[#0f172a] mt-0.5">
                  {selectedPlan.targetDate} • {selectedPlan.shift}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Assigned Production Engineer</p>
                <p className="font-bold text-[#0f172a] mt-0.5">
                  {selectedPlan.assignedProductionEngineer}
                </p>
              </div>
            </div>

            {canManagePlans && (
              <div className="p-3.5 rounded-xl bg-[#eef4ff]/50 border border-[#dce7ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-bold text-[#0f172a]">Update Plan Status:</span>
                <select
                  value={selectedPlan.planStatus}
                  onChange={(e) =>
                    handleUpdatePlanStatus(selectedPlan.planId, e.target.value)
                  }
                  className="h-9 px-3 bg-white border border-[#cbd5e1] rounded-xl text-xs font-bold text-[#0b57d0] cursor-pointer"
                >
                  {PLAN_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              {canManagePlans && (
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedPlan;
                    setSelectedPlanId(null);
                    handleOpenEditModal(target);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#eef4ff] text-[#0b57d0] font-bold hover:bg-[#0b57d0] hover:text-white transition-colors cursor-pointer"
                >
                  Edit Plan
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedPlanId(null)}
                className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductionPlan;
