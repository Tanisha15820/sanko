// Dummy data and calculation helpers for Production Management (Plan + Monitoring)
// Frontend-only React state (no localStorage or backend APIs)

export const PRODUCTION_ROLES = [
  'Production Engineer',
  'Engineer',
  'Technician',
  'Admin',
];

export const PLAN_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'On Hold'];

export const PLAN_STATUS_VARIANTS = {
  Scheduled: 'orange',
  'In Progress': 'blue',
  Completed: 'green',
  'On Hold': 'slate',
};

export const SHIFT_OPTIONS = ['Shift A', 'Shift B', 'Shift C'];

export const PLANT_OPTIONS = ['Plant 1 - Pune', 'Plant 2 - Chakan'];

export const DEPARTMENT_OPTIONS = [
  'Injection Molding',
  'Interior Trim Assembly',
  'Exterior Bumper Molding',
  'Precision Gear Molding',
];

export const PRODUCTION_LINE_OPTIONS = [
  'Line A - Automotive',
  'Line B - Interior Trim',
  'Line C - Bumper Line',
  'Line D - Precision Gear',
];

export const PRODUCTION_ENGINEERS = [
  'Priya Deshmukh',
  'Ananya Joshi',
  'Nikhil Kulkarni',
];

export const MACHINE_CATALOG = [
  {
    id: 'IMM-01',
    name: 'Toshiba 180T Injection',
    plant: 'Plant 1 - Pune',
    department: 'Injection Molding',
    line: 'Line A - Automotive',
  },
  {
    id: 'IMM-02',
    name: 'Sumitomo 220T High-Speed',
    plant: 'Plant 1 - Pune',
    department: 'Injection Molding',
    line: 'Line A - Automotive',
  },
  {
    id: 'IMM-03',
    name: 'Fanuc Roboshot 150T',
    plant: 'Plant 1 - Pune',
    department: 'Injection Molding',
    line: 'Line A - Automotive',
  },
  {
    id: 'IMM-04',
    name: 'Toshiba 250T Servo',
    plant: 'Plant 1 - Pune',
    department: 'Interior Trim Assembly',
    line: 'Line B - Interior Trim',
  },
  {
    id: 'IMM-05',
    name: 'Nissei 350T Precision',
    plant: 'Plant 1 - Pune',
    department: 'Interior Trim Assembly',
    line: 'Line B - Interior Trim',
  },
  {
    id: 'IMM-06',
    name: 'JSW 450T Heavy Mold',
    plant: 'Plant 1 - Pune',
    department: 'Exterior Bumper Molding',
    line: 'Line C - Bumper Line',
  },
  {
    id: 'IMM-07',
    name: 'Engel 300T Duo',
    plant: 'Plant 1 - Pune',
    department: 'Exterior Bumper Molding',
    line: 'Line C - Bumper Line',
  },
  {
    id: 'IMM-08',
    name: 'Sumitomo 180T Electric',
    plant: 'Plant 1 - Pune',
    department: 'Precision Gear Molding',
    line: 'Line D - Precision Gear',
  },
  {
    id: 'IMM-09',
    name: 'Fanuc Roboshot 100T',
    plant: 'Plant 1 - Pune',
    department: 'Precision Gear Molding',
    line: 'Line D - Precision Gear',
  },
  {
    id: 'IMM-10',
    name: 'Toshiba 350T Hydraulic',
    plant: 'Plant 1 - Pune',
    department: 'Precision Gear Molding',
    line: 'Line D - Precision Gear',
  },
];

// Formulas:
// Good Production = Actual Production - Rejected Quantity
// Achievement Percentage = (Good Production / Planned Quantity) * 100
export const calculateGoodProduction = (actualProduction, rejectedQuantity) =>
  Math.max(0, Number(actualProduction || 0) - Number(rejectedQuantity || 0));

export const calculateAchievementPct = (goodProduction, plannedQuantity) => {
  const planned = Number(plannedQuantity || 0);
  if (planned <= 0) return 0;
  return Number(((Number(goodProduction || 0) / planned) * 100).toFixed(1));
};

export const initialProductionPlans = [
  {
    planId: 'PLN-2026-001',
    plant: 'Plant 1 - Pune',
    department: 'Injection Molding',
    productionLine: 'Line A - Automotive',
    machineId: 'IMM-01',
    machineName: 'Toshiba 180T Injection',
    productName: 'Door Trim Clip Housing',
    plannedQuantity: 2400,
    targetDate: '2026-11-20',
    shift: 'Shift A',
    assignedProductionEngineer: 'Priya Deshmukh',
    planStatus: 'Completed',
  },
  {
    planId: 'PLN-2026-002',
    plant: 'Plant 1 - Pune',
    department: 'Injection Molding',
    productionLine: 'Line A - Automotive',
    machineId: 'IMM-02',
    machineName: 'Sumitomo 220T High-Speed',
    productName: 'Center Console Bracket',
    plannedQuantity: 2800,
    targetDate: '2026-11-20',
    shift: 'Shift A',
    assignedProductionEngineer: 'Priya Deshmukh',
    planStatus: 'Completed',
  },
  {
    planId: 'PLN-2026-003',
    plant: 'Plant 1 - Pune',
    department: 'Injection Molding',
    productionLine: 'Line A - Automotive',
    machineId: 'IMM-03',
    machineName: 'Fanuc Roboshot 150T',
    productName: 'Sensor Mount Retainer',
    plannedQuantity: 3200,
    targetDate: '2026-11-20',
    shift: 'Shift B',
    assignedProductionEngineer: 'Priya Deshmukh',
    planStatus: 'In Progress',
  },
  {
    planId: 'PLN-2026-004',
    plant: 'Plant 1 - Pune',
    department: 'Interior Trim Assembly',
    productionLine: 'Line B - Interior Trim',
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    productName: 'Glove Box Latch Cover',
    plannedQuantity: 2000,
    targetDate: '2026-11-20',
    shift: 'Shift A',
    assignedProductionEngineer: 'Ananya Joshi',
    planStatus: 'In Progress',
  },
  {
    planId: 'PLN-2026-005',
    plant: 'Plant 1 - Pune',
    department: 'Interior Trim Assembly',
    productionLine: 'Line B - Interior Trim',
    machineId: 'IMM-05',
    machineName: 'Nissei 350T Precision',
    productName: 'Instrument Cluster Bezel',
    plannedQuantity: 1800,
    targetDate: '2026-11-20',
    shift: 'Shift B',
    assignedProductionEngineer: 'Ananya Joshi',
    planStatus: 'Completed',
  },
  {
    planId: 'PLN-2026-006',
    plant: 'Plant 1 - Pune',
    department: 'Exterior Bumper Molding',
    productionLine: 'Line C - Bumper Line',
    machineId: 'IMM-06',
    machineName: 'JSW 450T Heavy Mold',
    productName: 'Front Bumper Lower Grille',
    plannedQuantity: 1200,
    targetDate: '2026-11-20',
    shift: 'Shift A',
    assignedProductionEngineer: 'Nikhil Kulkarni',
    planStatus: 'Completed',
  },
  {
    planId: 'PLN-2026-007',
    plant: 'Plant 1 - Pune',
    department: 'Precision Gear Molding',
    productionLine: 'Line D - Precision Gear',
    machineId: 'IMM-08',
    machineName: 'Sumitomo 180T Electric',
    productName: 'Actuator Spur Gear 42T',
    plannedQuantity: 2600,
    targetDate: '2026-11-20',
    shift: 'Shift B',
    assignedProductionEngineer: 'Priya Deshmukh',
    planStatus: 'In Progress',
  },
  {
    planId: 'PLN-2026-008',
    plant: 'Plant 1 - Pune',
    department: 'Precision Gear Molding',
    productionLine: 'Line D - Precision Gear',
    machineId: 'IMM-09',
    machineName: 'Fanuc Roboshot 100T',
    productName: 'HVAC Damper Pinion',
    plannedQuantity: 3000,
    targetDate: '2026-11-21',
    shift: 'Shift C',
    assignedProductionEngineer: 'Ananya Joshi',
    planStatus: 'Scheduled',
  },
];

export const initialMonitoringRecords = [
  {
    id: 'PMON-101',
    planId: 'PLN-2026-001',
    date: '2026-11-20',
    machineId: 'IMM-01',
    machineName: 'Toshiba 180T Injection',
    productionLine: 'Line A - Automotive',
    productName: 'Door Trim Clip Housing',
    shift: 'Shift A',
    plannedQuantity: 2400,
    actualProduction: 2332,
    rejectedQuantity: 22,
    remarks: 'Stable cycle time at 28.4s; minor startup purge scrap only.',
    breakdown: null,
  },
  {
    id: 'PMON-102',
    planId: 'PLN-2026-002',
    date: '2026-11-20',
    machineId: 'IMM-02',
    machineName: 'Sumitomo 220T High-Speed',
    productionLine: 'Line A - Automotive',
    productName: 'Center Console Bracket',
    shift: 'Shift A',
    plannedQuantity: 2800,
    actualProduction: 2718,
    rejectedQuantity: 28,
    remarks: 'Achieved 96.1% good output after minor ejector air check.',
    breakdown: null,
  },
  {
    id: 'PMON-103',
    planId: 'PLN-2026-003',
    date: '2026-11-20',
    machineId: 'IMM-03',
    machineName: 'Fanuc Roboshot 150T',
    productionLine: 'Line A - Automotive',
    productName: 'Sensor Mount Retainer',
    shift: 'Shift B',
    plannedQuantity: 3200,
    actualProduction: 3138,
    rejectedQuantity: 18,
    remarks: 'High-efficiency all-electric run with low scrap rate.',
    breakdown: null,
  },
  {
    id: 'PMON-104',
    planId: 'PLN-2026-004',
    date: '2026-11-20',
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    productionLine: 'Line B - Interior Trim',
    productName: 'Glove Box Latch Cover',
    shift: 'Shift A',
    plannedQuantity: 2000,
    actualProduction: 1536,
    rejectedQuantity: 46,
    remarks: 'Output impacted by hydraulic proportional solenoid coil breakdown.',
    breakdown: {
      breakdownId: 'BD-2026-041',
      startTime: '20 Nov 2026, 10:15 AM',
      downtime: '140 mins (2h 20m)',
      productionImpact: '-510 pcs lost',
      status: 'Under Breakdown',
    },
  },
  {
    id: 'PMON-105',
    planId: 'PLN-2026-005',
    date: '2026-11-20',
    machineId: 'IMM-05',
    machineName: 'Nissei 350T Precision',
    productionLine: 'Line B - Interior Trim',
    productName: 'Instrument Cluster Bezel',
    shift: 'Shift B',
    plannedQuantity: 1800,
    actualProduction: 1730,
    rejectedQuantity: 15,
    remarks: 'Smooth Shift B run; zero unplanned stops.',
    breakdown: null,
  },
  {
    id: 'PMON-106',
    planId: 'PLN-2026-006',
    date: '2026-11-20',
    machineId: 'IMM-06',
    machineName: 'JSW 450T Heavy Mold',
    productionLine: 'Line C - Bumper Line',
    productName: 'Front Bumper Lower Grille',
    shift: 'Shift A',
    plannedQuantity: 1200,
    actualProduction: 1157,
    rejectedQuantity: 12,
    remarks: 'Hot runner balanced after previous refurbishment.',
    breakdown: null,
  },
  {
    id: 'PMON-107',
    planId: 'PLN-2026-007',
    date: '2026-11-20',
    machineId: 'IMM-08',
    machineName: 'Sumitomo 180T Electric',
    productionLine: 'Line D - Precision Gear',
    productName: 'Actuator Spur Gear 42T',
    shift: 'Shift B',
    plannedQuantity: 2600,
    actualProduction: 2234,
    rejectedQuantity: 54,
    remarks: 'Zone-2 thermocouple open circuit fault caused 55m stoppage.',
    breakdown: {
      breakdownId: 'BD-2026-040',
      startTime: '20 Nov 2026, 11:40 AM',
      downtime: '55 mins (0h 55m)',
      productionImpact: '-420 pcs lost',
      status: 'Breakdown Impacted',
    },
  },
];

export const dailyProductionTrendData = [
  { date: '15 Nov', Planned: 15800, Good: 14920, Rejected: 165 },
  { date: '16 Nov', Planned: 16200, Good: 15110, Rejected: 210 },
  { date: '17 Nov', Planned: 16000, Good: 15480, Rejected: 145 },
  { date: '18 Nov', Planned: 15500, Good: 14890, Rejected: 172 },
  { date: '19 Nov', Planned: 16400, Good: 15740, Rejected: 158 },
  { date: '20 Nov', Planned: 16000, Good: 14650, Rejected: 195 },
];
