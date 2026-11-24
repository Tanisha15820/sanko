// Dummy Breakdown Management data and helpers for Maintenance 4.0 workflow
// Frontend-only React state (no localStorage or backend APIs)

export const BREAKDOWN_ROLES = [
  'Technician',
  'Production Engineer',
  'Engineer',
  'Admin',
];

export const BREAKDOWN_STATUSES = [
  'All Status',
  'Reported',
  'Assigned',
  'Under Inspection',
  'Under Repair',
  'RCA Required',
  'RCA Submitted',
  'Pending Admin Approval',
  'Resolved',
  'Closed',
];

export const BREAKDOWN_STATUS_VARIANTS = {
  Reported: 'blue',
  Assigned: 'blue',
  'Under Inspection': 'orange',
  'Under Repair': 'orange',
  'RCA Required': 'red',
  'RCA Submitted': 'orange',
  'Pending Admin Approval': 'orange',
  Resolved: 'green',
  Closed: 'green',
};

export const PRIORITY_VARIANTS = {
  Critical: 'red',
  High: 'orange',
  Medium: 'blue',
  Low: 'slate',
};

export const MACHINE_CATALOG = [
  { id: 'IMM-01', name: 'Toshiba 180T Injection', line: 'Plant 1 • Line A - Automotive' },
  { id: 'IMM-02', name: 'Sumitomo 220T High-Speed', line: 'Plant 1 • Line A - Automotive' },
  { id: 'IMM-03', name: 'Fanuc Roboshot 150T', line: 'Plant 1 • Line A - Automotive' },
  { id: 'IMM-04', name: 'Toshiba 250T Servo', line: 'Plant 1 • Line B - Interior Trim' },
  { id: 'IMM-05', name: 'Nissei 350T Precision', line: 'Plant 1 • Line B - Interior Trim' },
  { id: 'IMM-06', name: 'JSW 450T Heavy Mold', line: 'Plant 1 • Line C - Bumper Line' },
  { id: 'IMM-07', name: 'Engel 300T Duo', line: 'Plant 1 • Line C - Bumper Line' },
  { id: 'IMM-08', name: 'Sumitomo 180T Electric', line: 'Plant 1 • Line D - Precision Gear' },
  { id: 'IMM-09', name: 'Fanuc Roboshot 100T', line: 'Plant 1 • Line D - Precision Gear' },
  { id: 'IMM-10', name: 'Toshiba 350T Hydraulic', line: 'Plant 1 • Line D - Precision Gear' },
];

export const ENGINEER_OPTIONS = [
  'Karan Mehta',
  'Rohan Sharma',
  'Deepak Patel',
];

export const CATEGORY_OPTIONS = [
  'Mechanical',
  'Electrical',
  'Hydraulic',
  'Pneumatic',
  'Tooling',
];

export const PRIORITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low'];

// Calculate downtime strictly as: Actual Repair Completion Time - Breakdown Start Time
export const calculateDowntimeMinutes = (startIso, completionIso) => {
  if (!startIso || !completionIso) return null;
  const start = new Date(startIso).getTime();
  const end = new Date(completionIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  return Math.round((end - start) / 60000);
};

// Display downtime in both minutes and hours
export const formatDowntime = (minutes) => {
  if (minutes === null || minutes === undefined) return 'Repair In Progress';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${minutes} mins (${hrs}h ${mins}m)`;
};

export const formatDateTimeDisplay = (isoStr) => {
  if (!isoStr) return '—';
  const parsed = new Date(isoStr);
  if (Number.isNaN(parsed.getTime())) return isoStr;
  return parsed.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const initialBreakdownRecords = [
  {
    breakdownId: 'BD-2026-041',
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    plantLine: 'Plant 1 • Line B - Interior Trim',
    breakdownDate: '2026-11-20',
    breakdownStartTime: '2026-11-20T10:15',
    repairStartTime: '2026-11-20T10:35',
    actualRepairCompletionTime: '2026-11-20T12:35',
    category: 'Hydraulic',
    priority: 'Critical',
    problemDescription:
      'Main proportional pressure valve solenoid coil overheated causing sudden clamping pressure drop.',
    reportedBy: 'Suresh Nair',
    reportedByRole: 'Technician',
    assignedEngineer: 'Karan Mehta',
    status: 'Pending Admin Approval',
    engineerRemarks:
      'Replaced 24V proportional pressure relief solenoid coil (SP-512) and verified clamping pressure stability at 145 Bar.',
    imageName: 'IMM04_SOLENOID_VALVE.JPG',
    imageUrl: null,
    rca: {
      rootCause: 'Proportional pressure valve 24V solenoid coil insulation degradation.',
      whyHappened:
        'Extended high-duty clamping cycles combined with clogged oil cooler fins caused elevated hydraulic manifold heat.',
      correctiveAction:
        'Installed new 24V solenoid coil and flushed hydraulic return line filter.',
      preventiveAction:
        'Add bi-weekly infrared thermal check of solenoid coils and cooler fin cleaning to PM checklist.',
      responsiblePerson: 'Karan Mehta',
      rcaDate: '2026-11-20',
      engineerRemarks: 'Submitted to Plant Admin for final verification and closure.',
    },
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
  },
  {
    breakdownId: 'BD-2026-040',
    machineId: 'IMM-08',
    machineName: 'Sumitomo 180T Electric',
    plantLine: 'Plant 1 • Line D - Precision Gear',
    breakdownDate: '2026-11-20',
    breakdownStartTime: '2026-11-20T11:40',
    repairStartTime: '2026-11-20T11:55',
    actualRepairCompletionTime: '2026-11-20T12:35',
    category: 'Electrical',
    priority: 'High',
    problemDescription:
      'Barrel Heater Zone-2 K-type thermocouple open circuit alarm halting injection cycle.',
    reportedBy: 'Priya Deshmukh',
    reportedByRole: 'Production Engineer',
    assignedEngineer: 'Karan Mehta',
    status: 'RCA Required',
    engineerRemarks:
      'Replaced faulty thermocouple sensor (SP-302) and verified Zone-2 stabilization at 220 °C. Downtime exceeded 30 minutes; RCA pending submission.',
    imageName: 'IMM08_THERMOCOUPLE_ALARM.JPG',
    imageUrl: null,
    rca: null,
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
  },
  {
    breakdownId: 'BD-2026-039',
    machineId: 'IMM-02',
    machineName: 'Sumitomo 220T High-Speed',
    plantLine: 'Plant 1 • Line A - Automotive',
    breakdownDate: '2026-11-19',
    breakdownStartTime: '2026-11-19T15:10',
    repairStartTime: '2026-11-19T15:15',
    actualRepairCompletionTime: '2026-11-19T15:35',
    category: 'Pneumatic',
    priority: 'Medium',
    problemDescription:
      'Ejector blow valve air regulator pressure fluctuation causing intermittent part drop.',
    reportedBy: 'Suresh Nair',
    reportedByRole: 'Technician',
    assignedEngineer: 'Rohan Sharma',
    status: 'Resolved',
    engineerRemarks:
      'Replaced damaged FRL diaphragm seal and verified 6 Bar line pressure within 25 minutes.',
    imageName: '',
    imageUrl: null,
    rca: null,
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
  },
  {
    breakdownId: 'BD-2026-038',
    machineId: 'IMM-06',
    machineName: 'JSW 450T Heavy Mold',
    plantLine: 'Plant 1 • Line C - Bumper Line',
    breakdownDate: '2026-11-18',
    breakdownStartTime: '2026-11-18T09:20',
    repairStartTime: '2026-11-18T09:35',
    actualRepairCompletionTime: '2026-11-18T11:05',
    category: 'Tooling',
    priority: 'Critical',
    problemDescription:
      'Hot runner gate pin sticking on cavity #2 causing short-shot molding defects.',
    reportedBy: 'Priya Deshmukh',
    reportedByRole: 'Production Engineer',
    assignedEngineer: 'Rohan Sharma',
    status: 'Closed',
    engineerRemarks:
      'Cleaned carbonized resin from valve bushing #2, polished pin, and verified 10 consecutive trial shots.',
    imageName: 'IMM06_GATE_PIN_CLEANED.JPG',
    imageUrl: null,
    rca: {
      rootCause: 'Carbonized resin buildup inside hot runner valve bushing #2.',
      whyHappened:
        'Purge cycle was skipped during prior grade changeover, leaving residual polymer at 265 °C.',
      correctiveAction: 'Dismantled hot half, cleaned bushing, and polished gate pin.',
      preventiveAction:
        'Enforce mandatory purge checklist sign-off before every resin grade changeover.',
      responsiblePerson: 'Rohan Sharma',
      rcaDate: '2026-11-18',
      engineerRemarks: 'Trial parts cleared by QC; submitted to Admin.',
    },
    adminRemarks:
      'RCA reviewed and changeover SOP updated across Line C. Case formally closed.',
    closedBy: 'Rajesh Kumar (Admin)',
    closedAt: '2026-11-18 16:20',
  },
  {
    breakdownId: 'BD-2026-042',
    machineId: 'IMM-01',
    machineName: 'Toshiba 180T Injection',
    plantLine: 'Plant 1 • Line A - Automotive',
    breakdownDate: '2026-11-21',
    breakdownStartTime: '2026-11-21T08:45',
    repairStartTime: '',
    actualRepairCompletionTime: '',
    category: 'Mechanical',
    priority: 'High',
    problemDescription:
      'Abnormal knocking noise near toggle link lubrication manifold during mold closing stroke.',
    reportedBy: 'Suresh Nair',
    reportedByRole: 'Technician',
    assignedEngineer: 'Unassigned',
    status: 'Reported',
    engineerRemarks: '',
    imageName: '',
    imageUrl: null,
    rca: null,
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
  },
  {
    breakdownId: 'BD-2026-043',
    machineId: 'IMM-05',
    machineName: 'Nissei 350T Precision',
    plantLine: 'Plant 1 • Line B - Interior Trim',
    breakdownDate: '2026-11-21',
    breakdownStartTime: '2026-11-21T09:10',
    repairStartTime: '2026-11-21T09:25',
    actualRepairCompletionTime: '',
    category: 'Hydraulic',
    priority: 'Medium',
    problemDescription:
      'Slow screw recovery pressure during high-viscosity ABS molding batch.',
    reportedBy: 'Priya Deshmukh',
    reportedByRole: 'Production Engineer',
    assignedEngineer: 'Karan Mehta',
    status: 'Under Repair',
    engineerRemarks: 'Checking back-pressure relief cartridge and hydraulic motor drain line.',
    imageName: '',
    imageUrl: null,
    rca: null,
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
  },
];
