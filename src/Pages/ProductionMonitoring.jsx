import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  XCircle,
  RefreshCw,
  TrendingUp,
  Search,
  Eye,
  Calendar,
  RotateCcw,
  X,
  Clock,
  AlertTriangle,
  Cpu,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const productionRecords = [
  {
    id: 'PR-101',
    date: '2026-11-20',
    machineId: 'IMM-01',
    machineName: 'Toshiba 180T Injection',
    line: 'Line A - Automotive',
    shift: 'Shift A',
    targetOutput: 2400,
    actualGoodParts: 2310,
    rejectedParts: 22,
    cycleCount: 1166,
    stoppageDuration: '18 mins',
    lostProduction: 68,
    moldId: 'MLD-SG-204 (2-Cavity)',
    partName: 'Door Trim Clip Housing',
  },
  {
    id: 'PR-102',
    date: '2026-11-20',
    machineId: 'IMM-02',
    machineName: 'Sumitomo 220T High-Speed',
    line: 'Line A - Automotive',
    shift: 'Shift A',
    targetOutput: 2800,
    actualGoodParts: 2690,
    rejectedParts: 28,
    cycleCount: 1359,
    stoppageDuration: '15 mins',
    lostProduction: 82,
    moldId: 'MLD-SG-118 (2-Cavity)',
    partName: 'Center Console Bracket',
  },
  {
    id: 'PR-103',
    date: '2026-11-20',
    machineId: 'IMM-03',
    machineName: 'Fanuc Roboshot 150T',
    line: 'Line A - Automotive',
    shift: 'Shift B',
    targetOutput: 3200,
    actualGoodParts: 3120,
    rejectedParts: 18,
    cycleCount: 785,
    stoppageDuration: '10 mins',
    lostProduction: 62,
    moldId: 'MLD-SG-309 (4-Cavity)',
    partName: 'Sensor Mount Retainer',
  },
  {
    id: 'PR-104',
    date: '2026-11-20',
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    line: 'Line B - Interior Trim',
    shift: 'Shift A',
    targetOutput: 2000,
    actualGoodParts: 1490,
    rejectedParts: 46,
    cycleCount: 768,
    stoppageDuration: '1h 45m',
    lostProduction: 464,
    moldId: 'MLD-SG-412 (2-Cavity)',
    partName: 'Glove Box Latch Cover',
  },
  {
    id: 'PR-105',
    date: '2026-11-20',
    machineId: 'IMM-05',
    machineName: 'Nissei 350T Precision',
    line: 'Line B - Interior Trim',
    shift: 'Shift B',
    targetOutput: 1800,
    actualGoodParts: 1715,
    rejectedParts: 15,
    cycleCount: 1730,
    stoppageDuration: '20 mins',
    lostProduction: 70,
    moldId: 'MLD-SG-501 (1-Cavity)',
    partName: 'Instrument Cluster Bezel',
  },
  {
    id: 'PR-106',
    date: '2026-11-20',
    machineId: 'IMM-06',
    machineName: 'JSW 450T Heavy Mold',
    line: 'Line C - Bumper Line',
    shift: 'Shift A',
    targetOutput: 1200,
    actualGoodParts: 1145,
    rejectedParts: 12,
    cycleCount: 1157,
    stoppageDuration: '22 mins',
    lostProduction: 43,
    moldId: 'MLD-SG-610 (1-Cavity)',
    partName: 'Front Bumper Lower Grille',
  },
  {
    id: 'PR-107',
    date: '2026-11-20',
    machineId: 'IMM-07',
    machineName: 'Engel 300T Duo',
    line: 'Line C - Bumper Line',
    shift: 'Shift C',
    targetOutput: 1600,
    actualGoodParts: 1505,
    rejectedParts: 19,
    cycleCount: 762,
    stoppageDuration: '25 mins',
    lostProduction: 76,
    moldId: 'MLD-SG-625 (2-Cavity)',
    partName: 'Rear Bumper Diffuser Clip',
  },
  {
    id: 'PR-108',
    date: '2026-11-20',
    machineId: 'IMM-08',
    machineName: 'Sumitomo 180T Electric',
    line: 'Line D - Precision Gear',
    shift: 'Shift B',
    targetOutput: 2600,
    actualGoodParts: 2180,
    rejectedParts: 54,
    cycleCount: 1117,
    stoppageDuration: '55 mins',
    lostProduction: 366,
    moldId: 'MLD-SG-702 (2-Cavity)',
    partName: 'Actuator Spur Gear 42T',
  },
  {
    id: 'PR-109',
    date: '2026-11-20',
    machineId: 'IMM-09',
    machineName: 'Fanuc Roboshot 100T',
    line: 'Line D - Precision Gear',
    shift: 'Shift C',
    targetOutput: 3000,
    actualGoodParts: 2910,
    rejectedParts: 14,
    cycleCount: 731,
    stoppageDuration: '12 mins',
    lostProduction: 76,
    moldId: 'MLD-SG-719 (4-Cavity)',
    partName: 'HVAC Damper Pinion',
  },
  {
    id: 'PR-110',
    date: '2026-11-20',
    machineId: 'IMM-10',
    machineName: 'Toshiba 350T Hydraulic',
    line: 'Line D - Precision Gear',
    shift: 'Shift C',
    targetOutput: 2200,
    actualGoodParts: 2105,
    rejectedParts: 21,
    cycleCount: 1063,
    stoppageDuration: '18 mins',
    lostProduction: 74,
    moldId: 'MLD-SG-734 (2-Cavity)',
    partName: 'Throttle Valve Housing',
  },
  {
    id: 'PR-111',
    date: '2026-11-19',
    machineId: 'IMM-01',
    machineName: 'Toshiba 180T Injection',
    line: 'Line A - Automotive',
    shift: 'Shift A',
    targetOutput: 2400,
    actualGoodParts: 2360,
    rejectedParts: 15,
    cycleCount: 1188,
    stoppageDuration: '10 mins',
    lostProduction: 25,
    moldId: 'MLD-SG-204 (2-Cavity)',
    partName: 'Door Trim Clip Housing',
  },
  {
    id: 'PR-112',
    date: '2026-11-19',
    machineId: 'IMM-05',
    machineName: 'Nissei 350T Precision',
    line: 'Line B - Interior Trim',
    shift: 'Shift B',
    targetOutput: 1800,
    actualGoodParts: 1750,
    rejectedParts: 12,
    cycleCount: 1762,
    stoppageDuration: '14 mins',
    lostProduction: 38,
    moldId: 'MLD-SG-501 (1-Cavity)',
    partName: 'Instrument Cluster Bezel',
  },
];

const productionLines = [
  'All Lines',
  'Line A - Automotive',
  'Line B - Interior Trim',
  'Line C - Bumper Line',
  'Line D - Precision Gear',
];

const machineFilterOptions = [
  'All Machines',
  'IMM-01',
  'IMM-02',
  'IMM-03',
  'IMM-04',
  'IMM-05',
  'IMM-06',
  'IMM-07',
  'IMM-08',
  'IMM-09',
  'IMM-10',
];

const achievementBadge = (pct) => {
  if (pct >= 95) {
    return 'bg-[#e8f8ef] text-[#15803d]';
  }
  if (pct >= 85) {
    return 'bg-[#fff4e5] text-[#c2410c]';
  }
  return 'bg-[#feeceb] text-[#b91c1c]';
};

const achievementBar = (pct) => {
  if (pct >= 95) return 'bg-[#16a34a]';
  if (pct >= 85) return 'bg-[#ea580c]';
  return 'bg-[#dc2626]';
};

const ProductionMonitoring = () => {
  const [selectedDate, setSelectedDate] = useState('2026-11-20');
  const [selectedShift, setSelectedShift] = useState('All Shifts');
  const [selectedLine, setSelectedLine] = useState('All Lines');
  const [selectedMachine, setSelectedMachine] = useState('All Machines');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filter records by Date, Shift, Line, Machine, and Search Query
  const filteredRecords = productionRecords.filter((rec) => {
    const matchesDate = !selectedDate || rec.date === selectedDate;
    const matchesShift = selectedShift === 'All Shifts' || rec.shift === selectedShift;
    const matchesLine = selectedLine === 'All Lines' || rec.line === selectedLine;
    const matchesMachine =
      selectedMachine === 'All Machines' || rec.machineId === selectedMachine;
    const matchesSearch =
      !searchQuery.trim() ||
      rec.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.line.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.shift.toLowerCase().includes(searchQuery.toLowerCase());
    return (
      matchesDate &&
      matchesShift &&
      matchesLine &&
      matchesMachine &&
      matchesSearch
    );
  });

  // Dynamic Totals for Summary Cards
  const totalTarget = filteredRecords.reduce((acc, r) => acc + r.targetOutput, 0);
  const totalGood = filteredRecords.reduce((acc, r) => acc + r.actualGoodParts, 0);
  const totalRejected = filteredRecords.reduce((acc, r) => acc + r.rejectedParts, 0);
  const totalCycles = filteredRecords.reduce((acc, r) => acc + r.cycleCount, 0);
  const overallAchievement =
    totalTarget > 0 ? ((totalGood / totalTarget) * 100).toFixed(1) : '0.0';

  const summaryCards = [
    {
      id: 1,
      title: 'Total Target Production',
      value: totalTarget.toLocaleString(),
      support: 'Planned shift output (pcs)',
      icon: Target,
      iconBg: 'bg-[#eef4ff] text-[#0b57d0]',
    },
    {
      id: 2,
      title: 'Actual Good Parts',
      value: totalGood.toLocaleString(),
      support: 'QC passed molded parts',
      icon: CheckCircle2,
      iconBg: 'bg-[#e8f8ef] text-[#16a34a]',
    },
    {
      id: 3,
      title: 'Rejected Parts',
      value: totalRejected.toLocaleString(),
      support: `${
        totalGood + totalRejected > 0
          ? ((totalRejected / (totalGood + totalRejected)) * 100).toFixed(2)
          : '0.00'
      }% rejection rate`,
      icon: XCircle,
      iconBg: 'bg-[#feeceb] text-[#dc2626]',
    },
    {
      id: 4,
      title: 'Total Production Cycles',
      value: totalCycles.toLocaleString(),
      support: 'Cumulative molding shots',
      icon: RefreshCw,
      iconBg: 'bg-[#f3eefe] text-[#7c3aed]',
    },
    {
      id: 5,
      title: 'Production Achievement',
      value: `${overallAchievement}%`,
      support: 'Target vs Actual ratio',
      icon: TrendingUp,
      iconBg: 'bg-[#fff4e5] text-[#ea580c]',
    },
  ];

  // Chart 1: Target vs Actual Good Parts by Machine (from filtered records)
  const machineChartData = filteredRecords.map((r) => ({
    name: r.machineId,
    Target: r.targetOutput,
    Actual: r.actualGoodParts,
    Rejected: r.rejectedParts,
  }));

  // Chart 2: Shift-wise Production & Rejected Parts Comparison
  const shiftComparisonData = ['Shift A', 'Shift B', 'Shift C'].map((shiftName) => {
    const shiftRows = filteredRecords.filter((r) => r.shift === shiftName);
    const targetSum = shiftRows.reduce((s, r) => s + r.targetOutput, 0);
    const actualSum = shiftRows.reduce((s, r) => s + r.actualGoodParts, 0);
    const rejectedSum = shiftRows.reduce((s, r) => s + r.rejectedParts, 0);
    return {
      shift: shiftName,
      Target: targetSum,
      Actual: actualSum,
      Rejected: rejectedSum,
    };
  });

  const handleResetFilters = () => {
    setSelectedDate('2026-11-20');
    setSelectedShift('All Shifts');
    setSelectedLine('All Lines');
    setSelectedMachine('All Machines');
    setSearchQuery('');
  };

  return (
    <div className="space-y-5">
      {/* 1. Five Summary KPI Cards */}
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
                <h3 className="text-2xl sm:text-[26px] font-extrabold text-[#0f172a] leading-tight mt-0.5 tracking-tight">
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

      {/* 2. Production Filters Bar */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            {/* Date Filter */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Production Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#0b57d0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                />
              </div>
            </div>

            {/* Shift Filter */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Shift
              </label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Shifts', 'Shift A', 'Shift B', 'Shift C'].map((sh) => (
                  <option key={sh} value={sh}>
                    {sh}
                  </option>
                ))}
              </select>
            </div>

            {/* Production Line Filter */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Production Line
              </label>
              <select
                value={selectedLine}
                onChange={(e) => setSelectedLine(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {productionLines.map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
            </div>

            {/* Machine Filter */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Machine
              </label>
              <select
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {machineFilterOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters Button */}
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

      {/* 3. Production Overview Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left Chart: Machine-wise Target vs Actual Good Parts (7 cols) */}
        <section className="xl:col-span-7 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">
                Target Production vs Actual Good Parts
              </h3>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">
                Machine-wise output comparison for selected filters
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold self-start sm:self-auto">
              Achievement: {overallAchievement}%
            </span>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={machineChartData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12 }}
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
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                <Bar
                  dataKey="Target"
                  name="Target Output"
                  fill="#cbd5e1"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="Actual"
                  name="Actual Good Parts"
                  fill="#0b57d0"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Right Chart: Shift Performance & Rejected Parts Comparison (5 cols) */}
        <section className="xl:col-span-5 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              Shift Performance &amp; Rejected Parts
            </h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Production output and scrap comparison across Shift A, Shift B, and Shift C
            </p>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shiftComparisonData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="shift"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12 }}
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
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                <Bar
                  dataKey="Actual"
                  name="Good Parts"
                  fill="#16a34a"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="Rejected"
                  name="Rejected Parts"
                  fill="#dc2626"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* 4. Machine-wise Production Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              Machine-wise Production Table
            </h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Detailed shift output, cycle counts, rejection rates, and achievement indicators
            </p>
          </div>

          {/* Table Search Input */}
          <div className="relative w-full sm:w-68">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search machine ID, name, line, shift..."
              className="w-full h-9 pl-9 pr-3.5 bg-[#f3f6fb] hover:bg-[#edf2f9] focus:bg-white border border-transparent focus:border-[#0b57d0]/30 rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Machine ID</th>
                <th className="py-3.5 px-5">Machine Name</th>
                <th className="py-3.5 px-5">Production Line</th>
                <th className="py-3.5 px-5">Shift</th>
                <th className="py-3.5 px-5">Target Output</th>
                <th className="py-3.5 px-5">Actual Good Parts</th>
                <th className="py-3.5 px-5">Rejected Parts</th>
                <th className="py-3.5 px-5">Cycle Count</th>
                <th className="py-3.5 px-5">Achievement (%)</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13.5px]">
              {filteredRecords.map((row) => {
                const achievementPct = Number(
                  ((row.actualGoodParts / row.targetOutput) * 100).toFixed(1)
                );
                const isHighRejection = row.rejectedParts >= 30;

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-[#f8fafc]/80 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-bold text-[#0b57d0] whitespace-nowrap">
                      {row.machineId}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                      {row.machineName}
                    </td>
                    <td className="py-3.5 px-5 text-[#64748b] whitespace-nowrap">
                      {row.line}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                        {row.shift}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#334155] whitespace-nowrap">
                      {row.targetOutput.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-[#15803d] whitespace-nowrap">
                      {row.actualGoodParts.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isHighRejection
                            ? 'bg-[#feeceb] text-[#b91c1c]'
                            : 'bg-[#f1f5f9] text-[#475569]'
                        }`}
                      >
                        {row.rejectedParts} pcs
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-[#334155] whitespace-nowrap">
                      {row.cycleCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${achievementBadge(
                            achievementPct
                          )}`}
                        >
                          {achievementPct}%
                        </span>
                        <div className="w-16 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${achievementBar(
                              achievementPct
                            )}`}
                            style={{ width: `${Math.min(achievementPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(row)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-sm text-[#64748b]">
                    No production records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Machine Production Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                  {selectedRecord.machineId}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">
                    {selectedRecord.machineName}
                  </h3>
                  <p className="text-xs text-[#64748b]">
                    {selectedRecord.line} • {selectedRecord.shift} ({selectedRecord.date})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Machine & Tooling Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-[#0b57d0]" />
                  <div>
                    <p className="text-[#64748b]">Part Molded</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">{selectedRecord.partName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#0b57d0]" />
                  <div>
                    <p className="text-[#64748b]">Active Tooling / Mold ID</p>
                    <p className="font-bold text-[#0b57d0] mt-0.5">{selectedRecord.moldId}</p>
                  </div>
                </div>
              </div>

              {/* Target vs Actual & Production Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#f4f7fb]">
                  <p className="text-[#64748b] font-medium">Target Production</p>
                  <p className="text-base font-extrabold text-[#0f172a] mt-1">
                    {selectedRecord.targetOutput.toLocaleString()} pcs
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#e8f8ef]/70">
                  <p className="text-[#15803d] font-medium">Good Parts Produced</p>
                  <p className="text-base font-extrabold text-[#15803d] mt-1">
                    {selectedRecord.actualGoodParts.toLocaleString()} pcs
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#feeceb]/70">
                  <p className="text-[#b91c1c] font-medium">Rejected Parts</p>
                  <p className="text-base font-extrabold text-[#b91c1c] mt-1">
                    {selectedRecord.rejectedParts} pcs
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f4f7fb]">
                  <p className="text-[#64748b] font-medium">Cycle Count</p>
                  <p className="text-base font-extrabold text-[#0f172a] mt-1">
                    {selectedRecord.cycleCount.toLocaleString()} shots
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#eef4ff]">
                  <p className="text-[#0b57d0] font-medium">Production Achievement</p>
                  <p className="text-base font-extrabold text-[#0b57d0] mt-1">
                    {((selectedRecord.actualGoodParts / selectedRecord.targetOutput) * 100).toFixed(
                      1
                    )}
                    %
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#fff4e5]">
                  <p className="text-[#c2410c] font-medium">Stoppage Duration</p>
                  <p className="text-base font-extrabold text-[#c2410c] mt-1">
                    {selectedRecord.stoppageDuration}
                  </p>
                </div>
              </div>

              {/* Stoppage & Lost Production Highlight Box */}
              <div className="p-4 rounded-xl bg-[#fff4e5]/60 border border-[#fed7aa] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#fff4e5] text-[#ea580c] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0f172a]">
                      Lost Production due to Stoppage
                    </p>
                    <p className="text-[#64748b] mt-0.5">
                      Total downtime of {selectedRecord.stoppageDuration} during {selectedRecord.shift}
                    </p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-[#c2410c]">
                  -{selectedRecord.lostProduction} pcs
                </span>
              </div>

              {/* Footer Button */}
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionMonitoring;
