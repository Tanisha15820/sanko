import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Plus,
  Search,
  Eye,
  X,
  Check,
} from 'lucide-react';

const initialBreakdowns = [
  {
    breakdownId: 'BD-2026-041',
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    faultCategory: 'Hydraulic',
    startTime: '20 Nov 2026, 10:15 AM',
    downtime: '2h 20m',
    technician: 'Suresh Nair',
    status: 'Active',
    rootCauseNotes: 'Main proportional pressure valve solenoid coil overheated causing pressure drop in clamping cylinder.',
  },
  {
    breakdownId: 'BD-2026-040',
    machineId: 'IMM-08',
    machineName: 'Sumitomo 180T Electric',
    faultCategory: 'Electrical',
    startTime: '20 Nov 2026, 11:40 AM',
    downtime: '55m',
    technician: 'Vikram Singh',
    status: 'Active',
    rootCauseNotes: 'Barrel Heater Zone-2 K-type thermocouple open circuit fault; replacement sensor requested from spare parts store.',
  },
  {
    breakdownId: 'BD-2026-039',
    machineId: 'IMM-02',
    machineName: 'Sumitomo 220T High-Speed',
    faultCategory: 'Pneumatic',
    startTime: '19 Nov 2026, 03:10 PM',
    downtime: '1h 15m',
    technician: 'Amit Verma',
    status: 'Resolved',
    rootCauseNotes: 'Ejector blow valve air regulator pressure fluctuation fixed by replacing damaged FRL seal.',
  },
  {
    breakdownId: 'BD-2026-038',
    machineId: 'IMM-06',
    machineName: 'JSW 450T Heavy Mold',
    faultCategory: 'Tooling',
    startTime: '18 Nov 2026, 09:20 AM',
    downtime: '1h 45m',
    technician: 'Rohan Sharma',
    status: 'Resolved',
    rootCauseNotes: 'Hot runner gate pin sticking on cavity #2; cleaned and polished pin assembly.',
  },
  {
    breakdownId: 'BD-2026-037',
    machineId: 'IMM-01',
    machineName: 'Toshiba 180T Injection',
    faultCategory: 'Mechanical',
    startTime: '17 Nov 2026, 02:00 PM',
    downtime: '1h 05m',
    technician: 'Suresh Nair',
    status: 'Resolved',
    rootCauseNotes: 'Toggle link lubrication distributor block clogged; cleared blockage and verified grease pressure.',
  },
  {
    breakdownId: 'BD-2026-036',
    machineId: 'IMM-10',
    machineName: 'Toshiba 350T Hydraulic',
    faultCategory: 'Hydraulic',
    startTime: '15 Nov 2026, 04:30 PM',
    downtime: '1h 30m',
    technician: 'Deepak Patel',
    status: 'Resolved',
    rootCauseNotes: 'Oil cooler return line O-ring leak sealed and hydraulic oil topped up.',
  },
];

const machineOptions = [
  { id: 'IMM-01', name: 'Toshiba 180T Injection' },
  { id: 'IMM-02', name: 'Sumitomo 220T High-Speed' },
  { id: 'IMM-03', name: 'Fanuc Roboshot 150T' },
  { id: 'IMM-04', name: 'Toshiba 250T Servo' },
  { id: 'IMM-05', name: 'Nissei 350T Precision' },
  { id: 'IMM-06', name: 'JSW 450T Heavy Mold' },
  { id: 'IMM-07', name: 'Engel 300T Duo' },
  { id: 'IMM-08', name: 'Sumitomo 180T Electric' },
  { id: 'IMM-09', name: 'Fanuc Roboshot 100T' },
  { id: 'IMM-10', name: 'Toshiba 350T Hydraulic' },
];

const BreakdownManagement = ({
  breakdowns: propBreakdowns,
  onAddBreakdown,
  onToggleBreakdownStatus,
}) => {
  const [localBreakdowns, setLocalBreakdowns] = useState(initialBreakdowns);
  const breakdowns = propBreakdowns || localBreakdowns;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);

  // New Breakdown Form State
  const [formData, setFormData] = useState({
    machineId: 'IMM-01',
    faultCategory: 'Mechanical',
    startTime: '2026-11-20T14:30',
    rootCauseNotes: '',
    technician: 'Suresh Nair',
  });

  const activeCount = breakdowns.filter((b) => b.status === 'Active').length;
  const resolvedCount = breakdowns.filter((b) => b.status === 'Resolved').length;

  const summaryCards = [
    {
      id: 1,
      title: 'Total Breakdowns',
      value: String(breakdowns.length),
      support: 'This month records',
      icon: Wrench,
      iconBg: 'bg-[#eef4ff] text-[#0b57d0]',
    },
    {
      id: 2,
      title: 'Active Breakdowns',
      value: String(activeCount),
      support: 'Requires attention',
      icon: AlertTriangle,
      iconBg: 'bg-[#feeceb] text-[#dc2626]',
    },
    {
      id: 3,
      title: 'Resolved Breakdowns',
      value: String(resolvedCount),
      support: 'Restored to production',
      icon: CheckCircle2,
      iconBg: 'bg-[#e8f8ef] text-[#16a34a]',
    },
    {
      id: 4,
      title: 'Average Downtime',
      value: '1h 28m',
      support: 'MTTR target < 2h 00m',
      icon: Clock,
      iconBg: 'bg-[#fff4e5] text-[#ea580c]',
    },
  ];

  const filteredBreakdowns = breakdowns.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      item.breakdownId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.faultCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.technician.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleLogSubmit = (e) => {
    e.preventDefault();
    const machineObj = machineOptions.find((m) => m.id === formData.machineId) || {
      id: formData.machineId,
      name: 'Injection Molding Machine',
    };

    const nextNum = 41 + breakdowns.length - 5;
    const formattedTime = formData.startTime
      ? new Date(formData.startTime).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : '20 Nov 2026, 02:30 PM';

    const newRecord = {
      breakdownId: `BD-2026-0${nextNum}`,
      machineId: machineObj.id,
      machineName: machineObj.name,
      faultCategory: formData.faultCategory,
      startTime: formattedTime,
      downtime: '15m',
      technician: formData.technician,
      status: 'Active',
      rootCauseNotes:
        formData.rootCauseNotes.trim() ||
        'Initial fault logged by maintenance engineer. Inspection underway.',
    };

    if (onAddBreakdown) {
      onAddBreakdown(newRecord);
    } else {
      setLocalBreakdowns([newRecord, ...breakdowns]);
    }
    setIsLogModalOpen(false);
    setFormData({
      machineId: 'IMM-01',
      faultCategory: 'Mechanical',
      startTime: '2026-11-20T14:30',
      rootCauseNotes: '',
      technician: 'Suresh Nair',
    });
  };

  const handleToggleStatus = (breakdownId) => {
    if (onToggleBreakdownStatus) {
      onToggleBreakdownStatus(breakdownId);
    } else {
      setLocalBreakdowns((prev) =>
        prev.map((b) =>
          b.breakdownId === breakdownId
            ? { ...b, status: b.status === 'Active' ? 'Resolved' : 'Active' }
            : b
        )
      );
    }
    if (selectedBreakdown && selectedBreakdown.breakdownId === breakdownId) {
      setSelectedBreakdown((prev) => ({
        ...prev,
        status: prev.status === 'Active' ? 'Resolved' : 'Active',
      }));
    }
  };

  return (
    <div className="space-y-5">
      {/* 4 Summary KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-all flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold text-[#475569] truncate">
                  {card.title}
                </p>
                <h3 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] leading-tight mt-0.5 tracking-tight">
                  {card.value}
                </h3>
                <p className="text-[11px] font-medium text-[#94a3b8] truncate mt-0.5">
                  {card.support}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Breakdown Records Table Card */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">Breakdown Management</h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Track active machine faults, root causes, technician assignments, and downtime history
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search breakdown, machine..."
                className="w-full h-9 pl-9 pr-3.5 bg-[#f3f6fb] hover:bg-[#edf2f9] focus:bg-white border border-transparent focus:border-[#0b57d0]/30 rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex items-center bg-[#f3f6fb] p-1 rounded-xl">
              {['All', 'Active', 'Resolved'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#0b57d0] text-white shadow-xs'
                      : 'text-[#475569] hover:text-[#0f172a]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Log New Breakdown Button */}
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log New Breakdown</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Breakdown ID</th>
                <th className="py-3.5 px-5">Machine ID</th>
                <th className="py-3.5 px-5">Machine Name</th>
                <th className="py-3.5 px-5">Fault Category</th>
                <th className="py-3.5 px-5">Start Time</th>
                <th className="py-3.5 px-5">Downtime</th>
                <th className="py-3.5 px-5">Assigned Technician</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13.5px]">
              {filteredBreakdowns.map((item) => (
                <tr key={item.breakdownId} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#0f172a] whitespace-nowrap">
                    {item.breakdownId}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-[#0b57d0] whitespace-nowrap">
                    {item.machineId}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                    {item.machineName}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-semibold">
                      {item.faultCategory}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[#64748b] whitespace-nowrap">
                    {item.startTime}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                    {item.downtime}
                  </td>
                  <td className="py-3.5 px-5 text-[#475569] font-medium whitespace-nowrap">
                    {item.technician}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Active'
                          ? 'bg-[#feeceb] text-[#b91c1c]'
                          : 'bg-[#e8f8ef] text-[#15803d]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'Active' ? 'bg-[#dc2626]' : 'bg-[#16a34a]'
                        }`}
                      />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedBreakdown(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBreakdowns.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-sm text-[#64748b]">
                    No breakdown records match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal 1: Log New Breakdown Form */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a]">Log New Breakdown</h3>
                <p className="text-xs text-[#64748b]">
                  Register a machine breakdown incident and assign a technician
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Machine ID */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1.5">
                    Machine ID
                  </label>
                  <select
                    value={formData.machineId}
                    onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  >
                    {machineOptions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} — {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fault Category */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1.5">
                    Fault Category
                  </label>
                  <select
                    value={formData.faultCategory}
                    onChange={(e) => setFormData({ ...formData, faultCategory: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  >
                    {['Mechanical', 'Electrical', 'Hydraulic', 'Pneumatic', 'Tooling'].map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Breakdown Start Time */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1.5">
                    Breakdown Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                    required
                  />
                </div>

                {/* Assigned Technician */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1.5">
                    Assigned Technician
                  </label>
                  <select
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  >
                    {[
                      'Suresh Nair',
                      'Vikram Singh',
                      'Amit Verma',
                      'Rohan Sharma',
                      'Deepak Patel',
                      'Karan Mehta',
                    ].map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Root Cause Notes */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Root Cause Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.rootCauseNotes}
                  onChange={(e) => setFormData({ ...formData, rootCauseNotes: e.target.value })}
                  placeholder="Describe alarm code, observed symptoms, or preliminary root cause..."
                  className="w-full p-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] text-xs font-bold text-[#475569] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
                >
                  Save Breakdown
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Breakdown Details View */}
      {selectedBreakdown && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-extrabold text-[#0f172a]">
                  {selectedBreakdown.breakdownId}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedBreakdown.status === 'Active'
                      ? 'bg-[#feeceb] text-[#b91c1c]'
                      : 'bg-[#e8f8ef] text-[#15803d]'
                  }`}
                >
                  {selectedBreakdown.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBreakdown(null)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                <div>
                  <p className="text-[#64748b] font-medium">Machine</p>
                  <p className="text-sm font-bold text-[#0f172a] mt-0.5">
                    {selectedBreakdown.machineId} — {selectedBreakdown.machineName}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b] font-medium">Fault Category</p>
                  <p className="text-sm font-bold text-[#0b57d0] mt-0.5">
                    {selectedBreakdown.faultCategory}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b] font-medium">Start Time</p>
                  <p className="font-semibold text-[#0f172a] mt-0.5">
                    {selectedBreakdown.startTime}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b] font-medium">Total Downtime</p>
                  <p className="font-semibold text-[#0f172a] mt-0.5">
                    {selectedBreakdown.downtime}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#64748b] font-medium">Assigned Technician</p>
                  <p className="font-semibold text-[#0f172a] mt-0.5">
                    {selectedBreakdown.technician}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#334155] mb-1.5">Root Cause &amp; Diagnostic Notes</p>
                <div className="p-3.5 rounded-xl bg-[#f4f7fb] text-[#334155] leading-relaxed">
                  {selectedBreakdown.rootCauseNotes}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedBreakdown.breakdownId)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedBreakdown.status === 'Active'
                      ? 'bg-[#16a34a] hover:bg-[#15803d] text-white'
                      : 'bg-[#fff4e5] hover:bg-[#ffedd5] text-[#c2410c]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {selectedBreakdown.status === 'Active'
                      ? 'Mark as Resolved'
                      : 'Reopen Breakdown'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBreakdown(null)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] text-xs font-bold text-[#475569] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakdownManagement;
