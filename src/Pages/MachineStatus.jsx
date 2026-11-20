import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  PlayCircle,
  AlertTriangle,
  Wrench,
  PauseCircle,
  Search,
  Eye,
  Clock,
  CalendarCheck,
  ArrowUpRight,
} from 'lucide-react';

const machinesList = [
  {
    id: 'IMM-01',
    name: 'Toshiba 180T Injection',
    line: 'Line A - Automotive',
    status: 'Running',
    runningHours: '1,420 hrs',
    lastMaintenance: '12 Nov 2026',
  },
  {
    id: 'IMM-02',
    name: 'Sumitomo 220T High-Speed',
    line: 'Line A - Automotive',
    status: 'Under Scheduled PM',
    runningHours: '1,185 hrs',
    lastMaintenance: '20 Oct 2026',
  },
  {
    id: 'IMM-03',
    name: 'Fanuc Roboshot 150T',
    line: 'Line A - Automotive',
    status: 'Running',
    runningHours: '1,640 hrs',
    lastMaintenance: '15 Nov 2026',
  },
  {
    id: 'IMM-04',
    name: 'Toshiba 250T Servo',
    line: 'Line B - Interior Trim',
    status: 'Under Breakdown',
    runningHours: '980 hrs',
    lastMaintenance: '05 Nov 2026',
  },
  {
    id: 'IMM-05',
    name: 'Nissei 350T Precision',
    line: 'Line B - Interior Trim',
    status: 'Running',
    runningHours: '1,510 hrs',
    lastMaintenance: '10 Nov 2026',
  },
  {
    id: 'IMM-06',
    name: 'JSW 450T Heavy Mold',
    line: 'Line C - Bumper Line',
    status: 'Running',
    runningHours: '1,890 hrs',
    lastMaintenance: '08 Nov 2026',
  },
  {
    id: 'IMM-07',
    name: 'Engel 300T Duo',
    line: 'Line C - Bumper Line',
    status: 'Idle',
    runningHours: '760 hrs',
    lastMaintenance: '18 Nov 2026',
  },
  {
    id: 'IMM-08',
    name: 'Sumitomo 180T Electric',
    line: 'Line D - Precision Gear',
    status: 'Under Breakdown',
    runningHours: '1,120 hrs',
    lastMaintenance: '02 Nov 2026',
  },
  {
    id: 'IMM-09',
    name: 'Fanuc Roboshot 100T',
    line: 'Line D - Precision Gear',
    status: 'Under Scheduled PM',
    runningHours: '1,340 hrs',
    lastMaintenance: '22 Oct 2026',
  },
  {
    id: 'IMM-10',
    name: 'Toshiba 350T Hydraulic',
    line: 'Line D - Precision Gear',
    status: 'Running',
    runningHours: '1,725 hrs',
    lastMaintenance: '14 Nov 2026',
  },
  {
    id: 'IMM-11',
    name: 'Nissei 280T Hybrid',
    line: 'Line B - Interior Trim',
    status: 'Running',
    runningHours: '1,490 hrs',
    lastMaintenance: '11 Nov 2026',
  },
  {
    id: 'IMM-12',
    name: 'Engel 500T Victory',
    line: 'Line C - Bumper Line',
    status: 'Idle',
    runningHours: '640 hrs',
    lastMaintenance: '16 Nov 2026',
  },
];

const summaryCards = [
  {
    id: 1,
    title: 'Total Machines',
    value: '24',
    support: '4 Molding Lines',
    icon: Settings,
    iconBg: 'bg-[#eef4ff] text-[#0b57d0]',
  },
  {
    id: 2,
    title: 'Running',
    value: '18',
    support: '75.0% Availability',
    icon: PlayCircle,
    iconBg: 'bg-[#e8f8ef] text-[#16a34a]',
  },
  {
    id: 3,
    title: 'Under Breakdown',
    value: '2',
    support: '1 Critical • 1 Repair',
    icon: AlertTriangle,
    iconBg: 'bg-[#feeceb] text-[#dc2626]',
  },
  {
    id: 4,
    title: 'Under Scheduled PM',
    value: '2',
    support: 'Est. done 18:00 hrs',
    icon: Wrench,
    iconBg: 'bg-[#fff4e5] text-[#ea580c]',
  },
  {
    id: 5,
    title: 'Idle',
    value: '2',
    support: 'Standby / Mold Change',
    icon: PauseCircle,
    iconBg: 'bg-[#f1f5f9] text-[#475569]',
  },
];

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'Running':
      return 'bg-[#e8f8ef] text-[#15803d]';
    case 'Under Breakdown':
      return 'bg-[#feeceb] text-[#b91c1c]';
    case 'Under Scheduled PM':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Idle':
      return 'bg-[#f1f5f9] text-[#475569]';
    default:
      return 'bg-[#eef4ff] text-[#0b57d0]';
  }
};

const statusDotStyle = (status) => {
  switch (status) {
    case 'Running':
      return 'bg-[#16a34a]';
    case 'Under Breakdown':
      return 'bg-[#dc2626]';
    case 'Under Scheduled PM':
      return 'bg-[#ea580c]';
    default:
      return 'bg-[#94a3b8]';
  }
};

const MachineStatus = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredMachines = machinesList.filter((machine) => {
    const matchesStatus = statusFilter === 'All' || machine.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      machine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.line.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenMachineDetails = (machine) => {
    navigate(`/machines/details?id=${machine.id}`, { state: { machine } });
  };

  return (
    <div className="space-y-5">
      {/* 5 Summary KPI Cards matching Dashboard UI */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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

      {/* Machine Status Table Section */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        {/* Table Header with Search and Status Filters */}
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">Machine Fleet Status</h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Click on any machine row or action button to inspect full machine profile &amp; telemetry
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, machine, or line..."
                className="w-full h-9 pl-9 pr-3.5 bg-[#f3f6fb] hover:bg-[#edf2f9] focus:bg-white border border-transparent focus:border-[#0b57d0]/30 rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
              />
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', 'Running', 'Under Breakdown', 'Under Scheduled PM', 'Idle'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#0b57d0] text-white shadow-xs'
                      : 'bg-[#f3f6fb] text-[#475569] hover:text-[#0f172a]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-6">Machine ID</th>
                <th className="py-3.5 px-6">Machine Name</th>
                <th className="py-3.5 px-6">Production Line</th>
                <th className="py-3.5 px-6">Current Status</th>
                <th className="py-3.5 px-6">Running Hours</th>
                <th className="py-3.5 px-6">Last Maintenance</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13.5px]">
              {filteredMachines.map((machine) => (
                <tr
                  key={machine.id}
                  onClick={() => handleOpenMachineDetails(machine)}
                  className="hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-6 font-bold text-[#0b57d0] whitespace-nowrap">
                    {machine.id}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-[#0f172a] whitespace-nowrap group-hover:text-[#0b57d0] transition-colors">
                    {machine.name}
                  </td>
                  <td className="py-3.5 px-6 text-[#64748b] whitespace-nowrap">
                    {machine.line}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeStyle(
                        machine.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDotStyle(machine.status)}`}
                      />
                      {machine.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-[#334155] font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#94a3b8]" />
                      {machine.runningHours}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-[#64748b] whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-[#94a3b8]" />
                      {machine.lastMaintenance}
                    </span>
                  </td>
                  <td
                    className="py-3.5 px-6 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenMachineDetails(machine)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMachines.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-[#64748b]">
                    No machines match your current search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MachineStatus;
