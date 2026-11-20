import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const machineProductionChartData = [
  { name: 'IMM-01', Target: 2400, Actual: 2310 },
  { name: 'IMM-02', Target: 2800, Actual: 2690 },
  { name: 'IMM-03', Target: 3200, Actual: 3120 },
  { name: 'IMM-04', Target: 2000, Actual: 1490 },
  { name: 'IMM-05', Target: 1800, Actual: 1715 },
  { name: 'IMM-06', Target: 1200, Actual: 1145 },
  { name: 'IMM-07', Target: 1600, Actual: 1505 },
  { name: 'IMM-08', Target: 2600, Actual: 2180 },
  { name: 'IMM-09', Target: 3000, Actual: 2910 },
  { name: 'IMM-10', Target: 2200, Actual: 2105 },
];

const shiftComparisonData = [
  { shift: 'Shift A', Actual: 7635, Rejected: 108 },
  { shift: 'Shift B', Actual: 7015, Rejected: 87 },
  { shift: 'Shift C', Actual: 6520, Rejected: 54 },
];

// ============================================================================
// Temporary Sample Data for Additional Analytics (Ready for Future API Integration)
// ============================================================================
const SAMPLE_PRODUCTION_TREND = {
  '7d': [
    { date: '14 Nov', ActualGood: 19450, Rejected: 210 },
    { date: '15 Nov', ActualGood: 20120, Rejected: 185 },
    { date: '16 Nov', ActualGood: 18940, Rejected: 260 },
    { date: '17 Nov', ActualGood: 21300, Rejected: 175 },
    { date: '18 Nov', ActualGood: 20880, Rejected: 192 },
    { date: '19 Nov', ActualGood: 21640, Rejected: 164 },
    { date: '20 Nov', ActualGood: 21170, Rejected: 249 },
  ],
  '30d': [
    { date: '25 Oct', ActualGood: 18600, Rejected: 230 },
    { date: '29 Oct', ActualGood: 19250, Rejected: 215 },
    { date: '02 Nov', ActualGood: 20400, Rejected: 190 },
    { date: '06 Nov', ActualGood: 19850, Rejected: 240 },
    { date: '10 Nov', ActualGood: 21100, Rejected: 178 },
    { date: '14 Nov', ActualGood: 19450, Rejected: 210 },
    { date: '17 Nov', ActualGood: 21300, Rejected: 175 },
    { date: '20 Nov', ActualGood: 21170, Rejected: 249 },
  ],
  month: [
    { date: '01 Nov', ActualGood: 19800, Rejected: 195 },
    { date: '04 Nov', ActualGood: 20540, Rejected: 182 },
    { date: '07 Nov', ActualGood: 19120, Rejected: 245 },
    { date: '10 Nov', ActualGood: 21100, Rejected: 178 },
    { date: '13 Nov', ActualGood: 20750, Rejected: 190 },
    { date: '16 Nov', ActualGood: 18940, Rejected: 260 },
    { date: '20 Nov', ActualGood: 21170, Rejected: 249 },
  ],
};

const SAMPLE_MACHINE_STATUS = [
  { status: 'Running' },
  { status: 'Running' },
  { status: 'Running' },
  { status: 'Running' },
  { status: 'Running' },
  { status: 'Idle' },
  { status: 'Under Maintenance' },
  { status: 'Under Maintenance' },
  { status: 'Breakdown' },
  { status: 'Breakdown' },
];

const SAMPLE_PM_MONTHLY_TREND = [
  { month: 'Jun', Scheduled: 24, Completed: 22, Pending: 2 },
  { month: 'Jul', Scheduled: 26, Completed: 25, Pending: 1 },
  { month: 'Aug', Scheduled: 28, Completed: 24, Pending: 4 },
  { month: 'Sep', Scheduled: 25, Completed: 23, Pending: 2 },
  { month: 'Oct', Scheduled: 30, Completed: 28, Pending: 2 },
  { month: 'Nov', Scheduled: 27, Completed: 21, Pending: 6 },
];

const SAMPLE_LOW_STOCK_PARTS = [
  { partCode: 'SP-512', description: 'Proportional Pressure Relief Solenoid Coil 24V', availableStock: 0, minThreshold: 2 },
  { partCode: 'SP-215', description: 'Synthetic High-Temp Toggle Grease Cartridge', availableStock: 4, minThreshold: 5 },
  { partCode: 'SP-108', description: 'Ceramic Barrel Heater Band 240V', availableStock: 3, minThreshold: 4 },
  { partCode: 'SP-302', description: 'K-Type Barrel Thermocouple Sensor Probe', availableStock: 2, minThreshold: 4 },
];

// Executive Industrial Color Palette
const CHART_COLORS = {
  primary: '#1d4ed8',
  primarySoft: '#3b82f6',
  baseline: '#e2e8f0',
  slateMuted: '#94a3b8',
  emerald: '#059669',
  amber: '#d97706',
  rose: '#e11d48',
};

const AXIS_TICK_STYLE = {
  fill: '#64748b',
  fontSize: 11,
  fontWeight: 500,
};

const loadRegisteredMachines = () => {
  try {
    const saved = localStorage.getItem('sanko_gosei_machines_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fallback to temporary sample data
  }
  return SAMPLE_MACHINE_STATUS;
};

// Compact Inline Legend for Card Headers
const InlineLegend = ({ items }) => (
  <div className="flex flex-wrap items-center gap-4 text-[11.5px] font-medium text-[#475569]">
    {items.map((item) => (
      <span key={item.label} className="inline-flex items-center gap-1.5">
        <span
          className={`shrink-0 ${
            item.dashed ? 'w-3.5 border-t-2 border-dashed' : 'w-2.5 h-2.5 rounded-xs'
          }`}
          style={
            item.dashed
              ? { borderColor: item.color }
              : { backgroundColor: item.color }
          }
        />
        <span>{item.label}</span>
      </span>
    ))}
  </div>
);

const Dashboard = ({ pmTasks = [], spareParts = [] }) => {
  const [trendRange, setTrendRange] = useState('7d');

  const totalMachineTarget = machineProductionChartData.reduce((s, r) => s + r.Target, 0);
  const totalMachineActual = machineProductionChartData.reduce((s, r) => s + r.Actual, 0);
  const overallAchievement =
    totalMachineTarget > 0
      ? ((totalMachineActual / totalMachineTarget) * 100).toFixed(1)
      : '0.0';

  // 1. Production Trend Analysis
  const trendData = SAMPLE_PRODUCTION_TREND[trendRange] || SAMPLE_PRODUCTION_TREND['7d'];

  // 2. Machine Status Overview (uses saved machines from Machine Status if available)
  const registeredMachines = loadRegisteredMachines();
  const machineStatusCounts = registeredMachines.reduce(
    (acc, m) => {
      const st = (m.status || '').toLowerCase();
      if (st.includes('breakdown')) acc.Breakdown += 1;
      else if (st.includes('pm') || st.includes('maintenance')) acc['Under Maintenance'] += 1;
      else if (st.includes('idle')) acc.Idle += 1;
      else acc.Running += 1;
      return acc;
    },
    { Running: 0, Idle: 0, 'Under Maintenance': 0, Breakdown: 0 }
  );
  const totalMachinesCount = registeredMachines.length || 1;
  const machineStatusDonutData = [
    { name: 'Running', value: machineStatusCounts.Running, color: CHART_COLORS.emerald },
    { name: 'Idle', value: machineStatusCounts.Idle, color: CHART_COLORS.slateMuted },
    { name: 'Under Maintenance', value: machineStatusCounts['Under Maintenance'], color: CHART_COLORS.amber },
    { name: 'Breakdown', value: machineStatusCounts.Breakdown, color: CHART_COLORS.rose },
  ];

  // 3. Preventive Maintenance Status (uses live pmTasks prop from App state)
  const pmStatusCounts = pmTasks.reduce(
    (acc, t) => {
      if (acc[t.status] !== undefined) acc[t.status] += 1;
      return acc;
    },
    { Upcoming: 0, 'Due Today': 0, Overdue: 0, Completed: 0 }
  );
  const totalPmCount = pmTasks.length || 1;
  const pmStatusDonutData = [
    { name: 'Upcoming', value: pmStatusCounts.Upcoming, color: CHART_COLORS.primary },
    { name: 'Due Today', value: pmStatusCounts['Due Today'], color: CHART_COLORS.amber },
    { name: 'Overdue', value: pmStatusCounts.Overdue, color: CHART_COLORS.rose },
    { name: 'Completed', value: pmStatusCounts.Completed, color: CHART_COLORS.emerald },
  ];

  // 4. Spare Parts Stock Status (uses live spareParts prop from App state)
  const stockCounts = spareParts.reduce(
    (acc, p) => {
      const avail = Number(p.availableStock);
      const min = Number(p.minThreshold);
      if (avail <= 0) acc['Out of Stock'] += 1;
      else if (avail < min) acc['Low Stock'] += 1;
      else acc['In Stock'] += 1;
      return acc;
    },
    { 'In Stock': 0, 'Low Stock': 0, 'Out of Stock': 0 }
  );
  const totalSparePartsCount = spareParts.length || 1;
  const sparePartsDonutData = [
    { name: 'In Stock', value: stockCounts['In Stock'], color: CHART_COLORS.emerald },
    { name: 'Low Stock', value: stockCounts['Low Stock'], color: CHART_COLORS.amber },
    { name: 'Out of Stock', value: stockCounts['Out of Stock'], color: CHART_COLORS.rose },
  ];

  // 5. Top Low Stock Spare Parts (uses live spareParts below threshold, falls back to sample)
  const liveLowStock = spareParts
    .filter((p) => Number(p.availableStock) < Number(p.minThreshold))
    .sort((a, b) => Number(a.availableStock) - Number(b.availableStock));
  const lowStockChartData = (
    liveLowStock.length > 0 ? liveLowStock : SAMPLE_LOW_STOCK_PARTS
  ).map((p) => ({
    partCode: p.partCode,
    description: p.description,
    Available: Number(p.availableStock),
    MinReorder: Number(p.minThreshold),
    isOutOfStock: Number(p.availableStock) <= 0,
  }));

  return (
    <div className="space-y-5">
      {/* Graph 1: Production Trend Analysis (Full Width) */}
      <section className="bg-white rounded-2xl border border-[#e8eef5] shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-5 border-b border-[#f1f5f9]">
          <div>
            <h3 className="text-[15px] font-bold text-[#0f172a] tracking-tight">
              Production Trend Analysis
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">
              Daily output volume of Actual Good Parts vs Rejected Parts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <InlineLegend
              items={[
                { label: 'Actual Good Parts', color: CHART_COLORS.primary },
                { label: 'Rejected Parts', color: CHART_COLORS.rose, dashed: true },
              ]}
            />

            <div className="inline-flex items-center bg-[#f1f5f9] p-0.5 rounded-lg border border-[#e2e8f0]/80">
              {[
                { key: '7d', label: 'Last 7 Days' },
                { key: '30d', label: 'Last 30 Days' },
                { key: 'month', label: 'This Month' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setTrendRange(tab.key)}
                  className={`px-3 py-1.5 rounded-md text-[11.5px] font-semibold transition-all cursor-pointer ${
                    trendRange === tab.key
                      ? 'bg-white text-[#0f172a] shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={trendData}
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="trendGoodFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.14} />
                  <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={AXIS_TICK_STYLE}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                dy={6}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(v) => (v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`)}
                tick={AXIS_TICK_STYLE}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="ActualGood"
                name="Actual Good Parts"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                fill="url(#trendGoodFill)"
                dot={false}
                activeDot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Rejected"
                name="Rejected Parts"
                stroke={CHART_COLORS.rose}
                strokeWidth={1.75}
                strokeDasharray="4 4"
                dot={false}
                activeDot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Graphs 2 & 3: Machine-wise Target vs Actual & Shift Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Target Production vs Actual Good Parts (7 cols) */}
        <section className="xl:col-span-7 bg-white rounded-2xl border border-[#e8eef5] shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 mb-5 border-b border-[#f1f5f9]">
            <div>
              <h3 className="text-[15px] font-bold text-[#0f172a] tracking-tight">
                Target Production vs Actual Good Parts
              </h3>
              <p className="text-xs text-[#64748b] mt-0.5">
                Machine-wise output comparison across molding lines
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <InlineLegend
                items={[
                  { label: 'Target', color: CHART_COLORS.baseline },
                  { label: 'Actual', color: CHART_COLORS.primary },
                ]}
              />
              <span className="px-2.5 py-1 rounded-md bg-[#f1f5f9] border border-[#e2e8f0] text-[#0f172a] text-[11px] font-semibold tabular-nums">
                {overallAchievement}% Achieved
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={machineProductionChartData}
                barGap={4}
                margin={{ top: 4, right: 6, left: -12, bottom: 0 }}
              >
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={AXIS_TICK_STYLE}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  dy={6}
                />
                <YAxis
                  tickFormatter={(v) => (v === 0 ? '0' : `${(v / 1000).toFixed(1)}k`)}
                  tick={AXIS_TICK_STYLE}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar
                  dataKey="Target"
                  name="Target Output"
                  fill={CHART_COLORS.baseline}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="Actual"
                  name="Actual Good Parts"
                  fill={CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Shift Performance & Rejected Parts (5 cols) */}
        <section className="xl:col-span-5 bg-white rounded-2xl border border-[#e8eef5] shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 mb-5 border-b border-[#f1f5f9]">
            <div>
              <h3 className="text-[15px] font-bold text-[#0f172a] tracking-tight">
                Shift Performance &amp; Rejected Parts
              </h3>
              <p className="text-xs text-[#64748b] mt-0.5">
                Good output and scrap across Shift A, B, and C
              </p>
            </div>
            <InlineLegend
              items={[
                { label: 'Good', color: CHART_COLORS.emerald },
                { label: 'Rejected', color: CHART_COLORS.rose },
              ]}
            />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shiftComparisonData}
                barGap={8}
                margin={{ top: 4, right: 6, left: -12, bottom: 0 }}
              >
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="shift"
                  tick={AXIS_TICK_STYLE}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  dy={6}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) => (v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`)}
                  tick={AXIS_TICK_STYLE}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar
                  yAxisId="left"
                  dataKey="Actual"
                  name="Good Parts"
                  fill={CHART_COLORS.emerald}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Rejected"
                  name="Rejected Parts"
                  fill={CHART_COLORS.rose}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Graphs 4, 5 & 6: Three Enterprise Donut Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Machine Status Overview */}
        <section className="bg-white rounded-2xl border border-[#e8eef5] shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div className="pb-3 border-b border-[#f1f5f9]">
            <h3 className="text-[15px] font-bold text-[#0f172a] tracking-tight">
              Machine Status Overview
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">
              Distribution of registered molding machines
            </p>
          </div>

          <div className="relative h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={machineStatusDonutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={76}
                  paddingAngle={2}
                  cornerRadius={3}
                  stroke="none"
                >
                  {machineStatusDonutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-[#0f172a] tabular-nums">
                {registeredMachines.length}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b] mt-0.5">
                Total Units
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#f1f5f9] text-xs">
            {machineStatusDonutData.map((item) => {
              const pct = ((item.value / totalMachinesCount) * 100).toFixed(0);
              return (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-[#475569] font-medium">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </span>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="font-bold text-[#0f172a]">{item.value}</span>
                    <span className="text-[11px] text-[#94a3b8] w-9 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Preventive Maintenance Status */}
        <section className="bg-white rounded-2xl border border-[#e8eef5] shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div className="pb-3 border-b border-[#f1f5f9]">
            <h3 className="text-[15px] font-bold text-[#0f172a] tracking-tight">
              Preventive Maintenance Status
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">
              Current breakdown of scheduled PM tasks
            </p>
          </div>

          <div className="relative h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pmStatusDonutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={76}
                  paddingAngle={2}
                  cornerRadius={3}
                  stroke="none"
                >
                  {pmStatusDonutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-[#0f172a] tabular-nums">
                {pmTasks.length}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b] mt-0.5">
                PM Tasks
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#f1f5f9] text-xs">
            {pmStatusDonutData.map((item) => {
              const pct = ((item.value / totalPmCount) * 100).toFixed(0);
              return (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-[#475569] font-medium">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </span>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="font-bold text-[#0f172a]">{item.value}</span>
                    <span className="text-[11px] text-[#94a3b8] w-9 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Spare Parts Stock Status */}
        <section className="bg-white rounded-2xl border border-[#e8eef5] shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div className="pb-3 border-b border-[#f1f5f9]">
            <h3 className="text-[15px] font-bold text-[#0f172a] tracking-tight">
              Spare Parts Stock Status
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">
              Inventory health across maintenance store SKUs
            </p>
          </div>

          <div className="relative h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sparePartsDonutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={76}
                  paddingAngle={2}
                  cornerRadius={3}
                  stroke="none"
                >
                  {sparePartsDonutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-[#0f172a] tabular-nums">
                {spareParts.length}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b] mt-0.5">
                Total SKUs
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#f1f5f9] text-xs">
            {sparePartsDonutData.map((item) => {
              const pct = ((item.value / totalSparePartsCount) * 100).toFixed(0);
              return (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-[#475569] font-medium">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </span>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="font-bold text-[#0f172a]">{item.value}</span>
                    <span className="text-[11px] text-[#94a3b8] w-9 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Graphs 7 & 8: PM Completion Trend & Top Low Stock Spare Parts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Preventive Maintenance Completion Trend (6 cols) */}
        <section className="xl:col-span-6 bg-white rounded-2xl border border-[#e8eef5] shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 mb-5 border-b border-[#f1f5f9]">
            <div>
              <h3 className="text-[15px] font-bold text-[#0f172a] tracking-tight">
                Preventive Maintenance Completion Trend
              </h3>
              <p className="text-xs text-[#64748b] mt-0.5">
                Monthly Scheduled, Completed, and Pending PM tasks
              </p>
            </div>
            <InlineLegend
              items={[
                { label: 'Scheduled', color: '#cbd5e1' },
                { label: 'Completed', color: CHART_COLORS.emerald },
                { label: 'Pending', color: CHART_COLORS.amber },
              ]}
            />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SAMPLE_PM_MONTHLY_TREND}
                barGap={4}
                margin={{ top: 4, right: 6, left: -16, bottom: 0 }}
              >
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={AXIS_TICK_STYLE}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  dy={6}
                />
                <YAxis
                  tick={AXIS_TICK_STYLE}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar
                  dataKey="Scheduled"
                  name="Scheduled PM"
                  fill="#cbd5e1"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="Completed"
                  name="Completed PM"
                  fill={CHART_COLORS.emerald}
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="Pending"
                  name="Pending PM"
                  fill={CHART_COLORS.amber}
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Top Low Stock Spare Parts (Horizontal Bar Chart - 6 cols) */}
        <section className="xl:col-span-6 bg-white rounded-2xl border border-[#e8eef5] shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 mb-5 border-b border-[#f1f5f9]">
            <div>
              <h3 className="text-[15px] font-bold text-[#0f172a] tracking-tight">
                Top Low Stock Spare Parts
              </h3>
              <p className="text-xs text-[#64748b] mt-0.5">
                Available Stock vs Minimum Reorder Quantity
              </p>
            </div>
            <InlineLegend
              items={[
                { label: 'Min Reorder', color: CHART_COLORS.baseline },
                { label: 'Low Stock', color: CHART_COLORS.amber },
                { label: 'Out of Stock', color: CHART_COLORS.rose },
              ]}
            />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lowStockChartData}
                layout="vertical"
                barGap={4}
                margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
              >
                <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={AXIS_TICK_STYLE}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="partCode"
                  width={62}
                  tick={{ fill: '#334155', fontSize: 11.5, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar
                  dataKey="MinReorder"
                  name="Min Reorder Qty"
                  fill={CHART_COLORS.baseline}
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="Available"
                  name="Available Stock"
                  fill={CHART_COLORS.amber}
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                >
                  {lowStockChartData.map((entry) => (
                    <Cell
                      key={entry.partCode}
                      fill={entry.isOutOfStock ? CHART_COLORS.rose : CHART_COLORS.amber}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Clean Structured Low-Stock Summary List */}
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] divide-y divide-[#f8fafc] text-xs">
            {lowStockChartData.map((part) => (
              <div
                key={part.partCode}
                className="py-1.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: part.isOutOfStock
                        ? CHART_COLORS.rose
                        : CHART_COLORS.amber,
                    }}
                  />
                  <span className="font-semibold text-[#0f172a] shrink-0">
                    {part.partCode}
                  </span>
                  <span className="text-[#64748b] truncate">{part.description}</span>
                </div>
                <span className="font-semibold tabular-nums shrink-0 text-[#334155]">
                  <span
                    className={
                      part.isOutOfStock ? 'text-[#e11d48]' : 'text-[#d97706]'
                    }
                  >
                    {part.Available}
                  </span>
                  <span className="text-[#94a3b8]"> / {part.MinReorder}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
