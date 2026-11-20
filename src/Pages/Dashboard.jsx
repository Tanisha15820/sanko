import React, { useState } from 'react';
import {
  Settings,
  PlayCircle,
  AlertTriangle,
  Wrench,
  Package,
  ClipboardList,
  Activity,
  ShieldCheck,
  Gauge,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const kpiCards = [
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
    title: 'Running Machines',
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
];

const machineStatusData = [
  { id: 'IMM-01', name: 'Toshiba 180T Injection', line: 'Line A - Automotive', status: 'Running' },
  { id: 'IMM-02', name: 'Sumitomo 220T High-Speed', line: 'Line A - Automotive', status: 'Under Scheduled PM' },
  { id: 'IMM-03', name: 'Fanuc Roboshot 150T', line: 'Line A - Automotive', status: 'Running' },
  { id: 'IMM-04', name: 'Toshiba 250T Servo', line: 'Line B - Interior Trim', status: 'Under Breakdown' },
  { id: 'IMM-05', name: 'Nissei 350T Precision', line: 'Line B - Interior Trim', status: 'Running' },
  { id: 'IMM-06', name: 'JSW 450T Heavy Mold', line: 'Line C - Bumper Line', status: 'Running' },
  { id: 'IMM-07', name: 'Engel 300T Duo', line: 'Line C - Bumper Line', status: 'Idle' },
  { id: 'IMM-08', name: 'Sumitomo 180T Electric', line: 'Line D - Precision Gear', status: 'Under Breakdown' },
  { id: 'IMM-09', name: 'Fanuc Roboshot 100T', line: 'Line D - Precision Gear', status: 'Under Scheduled PM' },
  { id: 'IMM-10', name: 'Toshiba 350T Hydraulic', line: 'Line D - Precision Gear', status: 'Running' },
];

const productionChartData = [
  { time: '08:00', Target: 4400, Actual: 4200 },
  { time: '09:00', Target: 6800, Actual: 6300 },
  { time: '10:00', Target: 9200, Actual: 8400 },
  { time: '11:00', Target: 10800, Actual: 9500 },
  { time: '12:00', Target: 11800, Actual: 10600 },
  { time: '13:00', Target: 13500, Actual: 11800 },
  { time: '14:00', Target: 14200, Actual: 12900 },
  { time: '15:00', Target: 15000, Actual: 13200 },
  { time: '16:00', Target: 15600, Actual: 14100 },
  { time: '17:00', Target: 16000, Actual: 14820 },
];

const activeBreakdownsData = [
  {
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    startTime: '10:15 AM (2h 20m)',
    faultCategory: 'Hydraulic Pressure Drop',
    technician: 'Suresh Nair',
    status: 'Under Repair',
  },
  {
    machineId: 'IMM-08',
    machineName: 'Sumitomo 180T Electric',
    startTime: '11:40 AM (55m)',
    faultCategory: 'Heater Zone-2 Thermocouple Fault',
    technician: 'Vikram Singh',
    status: 'Awaiting Spare',
  },
  {
    machineId: 'AUX-12',
    machineName: 'MTC-04 Mold Temp Controller',
    startTime: '12:05 PM (30m)',
    faultCategory: 'Coolant Flow Sensor Alarm',
    technician: 'Amit Verma',
    status: 'Assigned',
  },
];

const upcomingPmData = [
  {
    id: 'PM-401',
    machineName: 'IMM-02 (Sumitomo 220T)',
    pmType: 'Monthly',
    dueDate: 'Today, 04:00 PM',
    engineer: 'Karan Mehta',
    status: 'Due Today',
  },
  {
    id: 'PM-402',
    machineName: 'IMM-06 (JSW 450T Heavy Mold)',
    pmType: 'Cycle-based (50k Shots)',
    dueDate: 'Yesterday',
    engineer: 'Rohan Sharma',
    status: 'Overdue',
  },
  {
    id: 'PM-403',
    machineName: 'IMM-01 (Toshiba 180T)',
    pmType: 'Daily',
    dueDate: 'Today, 06:00 PM',
    engineer: 'Deepak Patel',
    status: 'Due Today',
  },
  {
    id: 'PM-404',
    machineName: 'IMM-05 (Nissei 350T Precision)',
    pmType: 'Weekly',
    dueDate: 'Tomorrow, 09:00 AM',
    engineer: 'Karan Mehta',
    status: 'Upcoming',
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

const pmBadgeStyle = (status) => {
  switch (status) {
    case 'Overdue':
      return 'bg-[#feeceb] text-[#b91c1c]';
    case 'Due Today':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Upcoming':
      return 'bg-[#eef4ff] text-[#0b57d0]';
    default:
      return 'bg-[#f1f5f9] text-[#475569]';
  }
};

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState('today');
  const [machineFilter, setMachineFilter] = useState('All');

  const filteredMachines = machineStatusData.filter(
    (m) => machineFilter === 'All' || m.status === machineFilter
  );

  // Donut Ring SVG math for 89.4% OEE
  const oeePercent = 89.4;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (oeePercent / 100) * circumference;

  return (
    <div className="space-y-5">
      {/* Horizontal KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-all flex items-center gap-4"
            >
              {/* Left Rounded Square Tinted Icon Badge */}
              <div
                className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Right Title + Large Bold Metric + Subtle Support */}
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

      {/* Production Overview Chart + OEE Donut Card */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Production Overview Area Chart (7 cols) */}
        <section className="xl:col-span-7 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">Production Overview</h3>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">
                Target vs Actual hourly parts production
              </p>
            </div>

            {/* Segmented Date Tabs */}
            <div className="inline-flex items-center bg-[#f3f6fb] p-1 rounded-xl self-start sm:self-auto">
              {[
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setDateFilter(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    dateFilter === tab.key
                      ? 'bg-[#0b57d0] text-white shadow-xs'
                      : 'text-[#475569] hover:text-[#0f172a]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Smooth Area / Line Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={productionChartData}
                margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0b57d0" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#0b57d0" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}K`)}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#edf1f7',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(15,23,42,0.1)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Target"
                  name="Target Production"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="none"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="Actual"
                  name="Actual Production"
                  stroke="#0b57d0"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#actualGradient)"
                  dot={{ r: 4, fill: '#ffffff', stroke: '#0b57d0', strokeWidth: 2.5 }}
                  activeDot={{ r: 6, fill: '#0b57d0', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend + 4 Production Metrics Footer */}
          <div className="mt-4 pt-4 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs font-semibold text-[#475569]">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-2 rounded-full bg-[#0b57d0]" />
                <span>Actual Good Parts: <strong className="text-[#0f172a]">14,820 pcs</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 border-t-2 border-dashed border-[#94a3b8]" />
                <span>Target Production: <strong className="text-[#0f172a]">16,000 pcs</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-lg bg-[#feeceb] text-[#b91c1c]">
                Rejected: 142 pcs (0.95%)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0]">
                Cycle Count: 7,481 shots
              </span>
            </div>
          </div>
        </section>

        {/* Right: Overall Equipment Effectiveness (OEE) Card (5 cols) */}
        <section className="xl:col-span-5 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              Overall Equipment Effectiveness (OEE)
            </h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">Current Performance</p>
          </div>

          <div className="my-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Circular Donut Ring */}
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="14"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#0b57d0"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
                  89.4%
                </span>
                <span className="text-xs font-semibold text-[#64748b] mt-0.5">OEE</span>
              </div>
            </div>

            {/* 3 Pill Bars: Availability, Performance, Quality */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f4f7fb]">
                <div className="flex items-center gap-2.5">
                  <Gauge className="w-4 h-4 text-[#0b57d0]" />
                  <span className="text-xs font-semibold text-[#334155]">Availability</span>
                </div>
                <span className="text-sm font-extrabold text-[#0f172a]">95.2%</span>
              </div>

              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f4f7fb]">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-[#0b57d0]" />
                  <span className="text-xs font-semibold text-[#334155]">Performance</span>
                </div>
                <span className="text-sm font-extrabold text-[#0f172a]">93.1%</span>
              </div>

              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f4f7fb]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#0b57d0]" />
                  <span className="text-xs font-semibold text-[#334155]">Quality</span>
                </div>
                <span className="text-sm font-extrabold text-[#0f172a]">99.0%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Shift A • Plant-1 Injection Molding</span>
            <span className="font-bold text-[#16a34a]">+1.8% vs yesterday</span>
          </div>
        </section>
      </div>

      {/* Machine Status Overview (Full Width) */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">Machine Status Overview</h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Live operational status across injection molding lines
            </p>
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Running', 'Under Breakdown', 'Under Scheduled PM', 'Idle'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setMachineFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  machineFilter === status
                    ? 'bg-[#0b57d0] text-white shadow-xs'
                    : 'bg-[#f3f6fb] text-[#475569] hover:text-[#0f172a]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-6">Machine ID</th>
                <th className="py-3.5 px-6">Machine Name</th>
                <th className="py-3.5 px-6">Production Line</th>
                <th className="py-3.5 px-6">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13.5px]">
              {filteredMachines.map((machine) => (
                <tr key={machine.id} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-[#0b57d0] whitespace-nowrap">
                    {machine.id}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-[#0f172a] whitespace-nowrap">
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
                </tr>
              ))}
              {filteredMachines.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-[#64748b]">
                    No machines match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Active Breakdowns & Upcoming Preventive Maintenance */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Active Breakdowns (6 cols) */}
        <section className="xl:col-span-6 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="p-6 border-b border-[#f1f5f9] flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">Active Breakdowns</h3>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">
                Real-time breakdown tickets requiring immediate attention
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#feeceb] text-[#b91c1c]">
              {activeBreakdownsData.length} Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Machine</th>
                  <th className="py-3.5 px-5">Start Time</th>
                  <th className="py-3.5 px-5">Fault Category</th>
                  <th className="py-3.5 px-5">Technician</th>
                  <th className="py-3.5 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                {activeBreakdownsData.map((bd) => (
                  <tr key={bd.machineId} className="hover:bg-[#f8fafc]/80 transition-colors">
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="font-bold text-[#dc2626] block">{bd.machineId}</span>
                      <span className="text-xs text-[#64748b]">{bd.machineName}</span>
                    </td>
                    <td className="py-3.5 px-5 text-[#64748b] whitespace-nowrap">{bd.startTime}</td>
                    <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                      {bd.faultCategory}
                    </td>
                    <td className="py-3.5 px-5 text-[#475569] font-medium whitespace-nowrap">
                      {bd.technician}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          bd.status === 'Under Repair'
                            ? 'bg-[#fff4e5] text-[#c2410c]'
                            : bd.status === 'Awaiting Spare'
                            ? 'bg-[#feeceb] text-[#b91c1c]'
                            : 'bg-[#eef4ff] text-[#0b57d0]'
                        }`}
                      >
                        {bd.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Upcoming Preventive Maintenance (6 cols) */}
        <section className="xl:col-span-6 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="p-6 border-b border-[#f1f5f9] flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">
                Upcoming Preventive Maintenance
              </h3>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">
                Scheduled daily, weekly, monthly, and cycle-based PM tasks
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold">
              PM Schedule
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Machine Name</th>
                  <th className="py-3.5 px-5">PM Type</th>
                  <th className="py-3.5 px-5">Due Date</th>
                  <th className="py-3.5 px-5">Engineer</th>
                  <th className="py-3.5 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                {upcomingPmData.map((pm) => (
                  <tr key={pm.id} className="hover:bg-[#f8fafc]/80 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                      {pm.machineName}
                    </td>
                    <td className="py-3.5 px-5 text-[#0b57d0] font-semibold whitespace-nowrap">
                      {pm.pmType}
                    </td>
                    <td className="py-3.5 px-5 text-[#64748b] whitespace-nowrap">{pm.dueDate}</td>
                    <td className="py-3.5 px-5 text-[#475569] font-medium whitespace-nowrap">
                      {pm.engineer}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${pmBadgeStyle(
                          pm.status
                        )}`}
                      >
                        {pm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
