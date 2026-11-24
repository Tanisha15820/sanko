// Sample analytics datasets for Dashboard charts (ready for future backend API integration)

export const machineProductionChartData = [
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

export const shiftComparisonData = [
  { shift: 'Shift A', Actual: 7635, Rejected: 108 },
  { shift: 'Shift B', Actual: 7015, Rejected: 87 },
  { shift: 'Shift C', Actual: 6520, Rejected: 54 },
];

export const SAMPLE_PRODUCTION_TREND = {
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

export const SAMPLE_MACHINE_STATUS = [
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

export const SAMPLE_PM_MONTHLY_TREND = [
  { month: 'Jun', Scheduled: 24, Completed: 22, Pending: 2 },
  { month: 'Jul', Scheduled: 26, Completed: 25, Pending: 1 },
  { month: 'Aug', Scheduled: 28, Completed: 24, Pending: 4 },
  { month: 'Sep', Scheduled: 25, Completed: 23, Pending: 2 },
  { month: 'Oct', Scheduled: 30, Completed: 28, Pending: 2 },
  { month: 'Nov', Scheduled: 27, Completed: 21, Pending: 6 },
];

export const SAMPLE_LOW_STOCK_PARTS = [
  {
    partCode: 'SP-512',
    description: 'Proportional Pressure Relief Solenoid Coil 24V',
    availableStock: 0,
    minThreshold: 2,
  },
  {
    partCode: 'SP-215',
    description: 'Synthetic High-Temp Toggle Grease Cartridge',
    availableStock: 4,
    minThreshold: 5,
  },
  {
    partCode: 'SP-108',
    description: 'Ceramic Barrel Heater Band 240V',
    availableStock: 3,
    minThreshold: 4,
  },
  {
    partCode: 'SP-302',
    description: 'K-Type Barrel Thermocouple Sensor Probe',
    availableStock: 2,
    minThreshold: 4,
  },
];

export const CHART_COLORS = {
  primary: '#1d4ed8',
  primarySoft: '#3b82f6',
  baseline: '#e2e8f0',
  slateMuted: '#94a3b8',
  emerald: '#059669',
  amber: '#d97706',
  rose: '#e11d48',
};

export const AXIS_TICK_STYLE = {
  fill: '#64748b',
  fontSize: 11,
  fontWeight: 500,
};
