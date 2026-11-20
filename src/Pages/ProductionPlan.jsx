import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Calendar,
  RotateCcw,
  X,
  ClipboardList,
} from 'lucide-react';

const STORAGE_KEY = 'sanko_gosei_production_plans_v1';

const initialProductionPlans = [
  {
    planId: 'PLN-2026-001',
    date: '2026-11-21',
    shift: 'Shift A',
    machineName: 'IMM-01 — Toshiba 180T Injection',
    targetProducts: 2400,
    actualProduced: 2310,
    status: 'In Progress',
  },
  {
    planId: 'PLN-2026-002',
    date: '2026-11-21',
    shift: 'Shift A',
    machineName: 'IMM-02 — Sumitomo 220T High-Speed',
    targetProducts: 2800,
    actualProduced: 2690,
    status: 'In Progress',
  },
  {
    planId: 'PLN-2026-003',
    date: '2026-11-21',
    shift: 'Shift B',
    machineName: 'IMM-03 — Fanuc Roboshot 150T',
    targetProducts: 3200,
    actualProduced: 3120,
    status: 'Scheduled',
  },
  {
    planId: 'PLN-2026-004',
    date: '2026-11-20',
    shift: 'Shift A',
    machineName: 'IMM-04 — Toshiba 250T Servo',
    targetProducts: 2000,
    actualProduced: 1490,
    status: 'Completed',
  },
  {
    planId: 'PLN-2026-005',
    date: '2026-11-20',
    shift: 'Shift B',
    machineName: 'IMM-05 — Nissei 350T Precision',
    targetProducts: 1800,
    actualProduced: 1755,
    status: 'Completed',
  },
  {
    planId: 'PLN-2026-006',
    date: '2026-11-20',
    shift: 'Shift C',
    machineName: 'IMM-06 — JSW 450T Heavy Mold',
    targetProducts: 1200,
    actualProduced: 1180,
    status: 'Completed',
  },
];

const machineNameOptions = [
  'IMM-01 — Toshiba 180T Injection',
  'IMM-02 — Sumitomo 220T High-Speed',
  'IMM-03 — Fanuc Roboshot 150T',
  'IMM-04 — Toshiba 250T Servo',
  'IMM-05 — Nissei 350T Precision',
  'IMM-06 — JSW 450T Heavy Mold',
  'IMM-07 — Engel 300T Duo',
  'IMM-08 — Sumitomo 180T Electric',
  'IMM-09 — Fanuc Roboshot 100T',
  'IMM-10 — Toshiba 350T Hydraulic',
];

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-[#e8f8ef] text-[#15803d]';
    case 'In Progress':
      return 'bg-[#eef4ff] text-[#0b57d0]';
    case 'Scheduled':
    default:
      return 'bg-[#fff4e5] text-[#c2410c]';
  }
};

const statusDotStyle = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-[#16a34a]';
    case 'In Progress':
      return 'bg-[#0b57d0]';
    case 'Scheduled':
    default:
      return 'bg-[#ea580c]';
  }
};

const ProductionPlan = () => {
  const [plans, setPlans] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialProductionPlans;
    } catch {
      return initialProductionPlans;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [shiftFilter, setShiftFilter] = useState('All Shifts');

  // Add Production Plan Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '2026-11-21',
    shift: 'Shift A',
    machineName: machineNameOptions[0],
    targetProducts: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch {
      // Ignore storage errors
    }
  }, [plans]);

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      !searchQuery.trim() ||
      plan.planId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.shift.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || plan.date === selectedDate;
    const matchesShift = shiftFilter === 'All Shifts' || plan.shift === shiftFilter;
    return matchesSearch && matchesDate && matchesShift;
  });

  const handleOpenAddModal = () => {
    setFormData({
      date: '2026-11-21',
      shift: 'Shift A',
      machineName: machineNameOptions[0],
      targetProducts: '',
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const nextNum = String(plans.length + 1).padStart(3, '0');
    const newPlan = {
      planId: `PLN-2026-${nextNum}`,
      date: formData.date,
      shift: formData.shift,
      machineName: formData.machineName,
      targetProducts: Number(formData.targetProducts) || 0,
      actualProduced: 0,
      status: 'Scheduled',
    };

    setPlans((prev) => [newPlan, ...prev]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5">
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
                  Schedule shift-wise machine production plans and target product quantities
                </p>
              </div>
            </div>

            {/* Add Production Button at Right End */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Production</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search plan ID, machine..."
                  className="w-full h-9 pl-9 pr-3.5 bg-[#f3f6fb] hover:bg-[#edf2f9] focus:bg-white border border-transparent focus:border-[#0b57d0]/30 rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-[#0b57d0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  title="Filter by Date"
                  className="h-9 pl-8 pr-3 bg-[#f3f6fb] hover:bg-[#edf2f9] focus:bg-white border border-[#d6deeb] focus:border-[#0b57d0] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none cursor-pointer"
                />
              </div>

              {(selectedDate || searchQuery || shiftFilter !== 'All Shifts') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate('');
                    setSearchQuery('');
                    setShiftFilter('All Shifts');
                  }}
                  className="h-9 px-2.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Shift Filter Pills */}
            <div className="inline-flex items-center bg-[#f3f6fb] p-1 rounded-xl">
              {['All Shifts', 'Shift A', 'Shift B', 'Shift C'].map((sh) => (
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
                <th className="py-3.5 px-6">Plan ID</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Shift</th>
                <th className="py-3.5 px-6">Machine Name</th>
                <th className="py-3.5 px-6">Target Products</th>
                <th className="py-3.5 px-6">Actual Produced</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13.5px]">
              {filteredPlans.map((plan) => (
                <tr key={plan.planId} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-[#0b57d0] whitespace-nowrap">
                    {plan.planId}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-[#334155] whitespace-nowrap">
                    {plan.date}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                      {plan.shift}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-[#0f172a] whitespace-nowrap">
                    {plan.machineName}
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-[#0f172a] whitespace-nowrap">
                    {Number(plan.targetProducts).toLocaleString()} pcs
                  </td>
                  <td className="py-3.5 px-6 font-bold text-[#15803d] whitespace-nowrap">
                    {Number(plan.actualProduced).toLocaleString()} pcs
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeStyle(
                        plan.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDotStyle(plan.status)}`}
                      />
                      {plan.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-[#64748b]">
                    No production plan records match your current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Production Popup Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a]">Add Production Plan</h3>
                <p className="text-xs text-[#64748b]">
                  Enter date, shift, machine name, and target product count
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                    required
                  />
                </div>

                {/* Shift */}
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  >
                    {['Shift A', 'Shift B', 'Shift C'].map((sh) => (
                      <option key={sh} value={sh}>
                        {sh}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Machine Name */}
              <div>
                <label className="block font-bold text-[#334155] mb-1.5">Machine Name</label>
                <select
                  value={formData.machineName}
                  onChange={(e) =>
                    setFormData({ ...formData, machineName: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                >
                  {machineNameOptions.map((machine) => (
                    <option key={machine} value={machine}>
                      {machine}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Products */}
              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Target Products (pcs)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.targetProducts}
                  onChange={(e) =>
                    setFormData({ ...formData, targetProducts: e.target.value })
                  }
                  placeholder="e.g. 2500"
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
                >
                  Save Production Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionPlan;
