// Dummy PM Checklist data for Technician Pass/Fail and Admin Failure Review workflow
// Pure React state only (no localStorage or backend API calls)

export const PM_ROLES = ['Technician', 'Engineer', 'Admin'];

export const TECHNICIAN_OPTIONS = [
  'Suresh Nair',
  'Deepak Patel',
  'Vikram Singh',
  'Amit Verma',
  'Rohan Sharma',
];

export const ENGINEER_OPTIONS = ['Karan Mehta', 'Nikhil Deshpande', 'Prashant Joshi'];

export const PM_STATUSES = [
  'Scheduled',
  'In Progress',
  'Draft',
  'Completed',
  'Failed / Pending Admin Review',
  'Closed',
];

export const CHECKLIST_STATUS_VARIANTS = {
  Scheduled: 'blue',
  'In Progress': 'blue',
  Draft: 'slate',
  Completed: 'green',
  'Failed / Pending Admin Review': 'red',
  Closed: 'green',
};

export const createChecklistItemsTemplate = () => [
  {
    id: 1,
    task: 'Check machine lubrication & automatic grease distributor block pressure',
    result: 'Pass',
    requiresNumeric: true,
    paramLabel: 'Lubrication Pressure (Bar)',
    paramValue: '42',
    remarks: 'Grease lines clear; pressure within 40–45 Bar specification.',
  },
  {
    id: 2,
    task: 'Inspect hydraulic system return filter, hose fittings & oil temperature',
    result: 'Pass',
    requiresNumeric: true,
    paramLabel: 'Hydraulic Oil Temp (°C)',
    paramValue: '43.5',
    remarks: 'No oil leakage observed; oil cooler operating normally.',
  },
  {
    id: 3,
    task: 'Check electrical connections, barrel heater band resistance & thermocouples',
    result: 'Pass',
    requiresNumeric: true,
    paramLabel: 'Heater Insulation (MΩ)',
    paramValue: '120',
    remarks: 'All 4 barrel heating zones balanced and terminals tightened.',
  },
  {
    id: 4,
    task: 'Inspect machine safety guards, operator door limit switch & emergency stops',
    result: 'Pass',
    requiresNumeric: false,
    paramLabel: 'Interlock Test',
    paramValue: 'Verified',
    remarks: 'Dual-channel safety door interlock trips immediately on opening.',
  },
  {
    id: 5,
    task: 'Check machine operating condition, clamping toggle pins & platen parallelism',
    result: 'Pass',
    requiresNumeric: true,
    paramLabel: 'Clamping Pressure (Bar)',
    paramValue: '145',
    remarks: 'Smooth clamping stroke without abnormal vibration or noise.',
  },
];

export const createPmChecklistFromSchedule = (task) => ({
  pmId: task.pmId,
  machineId: task.machineId,
  machineName: task.machineName,
  line: task.line,
  scheduledDate: task.scheduledDate,
  pmSchedule: `${task.scheduledDate}${task.scheduledTime ? ` • ${task.scheduledTime}` : ''}`,
  frequency: task.frequency,
  assignedTechnician: task.assignedTechnician || 'Suresh Nair',
  assignedEngineer: task.engineer || 'Karan Mehta',
  inspectionDate: task.scheduledDate,
  submissionDate: 'Not Submitted',
  status: 'Scheduled',
  finalRemarks: task.notes || '',
  adminRemarks: '',
  closedBy: '',
  closedAt: '',
  supportingImages: [],
  usedParts: [],
  checklistItems: createChecklistItemsTemplate(),
});

export const initialPmChecklists = [
  {
    pmId: 'PM-2026-401',
    machineId: 'IMM-02',
    machineName: 'Sumitomo 220T High-Speed',
    line: 'Line A - Automotive',
    scheduledDate: '2026-11-24',
    pmSchedule: '2026-11-24 • 10:00',
    frequency: 'Monthly',
    assignedTechnician: 'Suresh Nair',
    assignedEngineer: 'Karan Mehta',
    inspectionDate: '2026-11-24',
    submissionDate: 'Not Submitted',
    status: 'In Progress',
    finalRemarks:
      'Monthly preventive inspection underway. Clamping and lubrication checks verified.',
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
    supportingImages: [
      {
        id: 'img-401-1',
        name: 'IMM02_LUBE_PRESSURE_GAUGE.JPG',
        uploadedAt: '2026-11-24 10:15',
        url: null,
      },
    ],
    usedParts: [{ id: 1, partCode: 'SP-101', quantityUsed: 1 }],
    checklistItems: createChecklistItemsTemplate(),
  },
  {
    pmId: 'PM-2026-403',
    machineId: 'IMM-01',
    machineName: 'Toshiba 180T Injection',
    line: 'Line A - Automotive',
    scheduledDate: '2026-11-24',
    pmSchedule: '2026-11-24 • 08:30',
    frequency: 'Daily',
    assignedTechnician: 'Suresh Nair',
    assignedEngineer: 'Karan Mehta',
    inspectionDate: '2026-11-24',
    submissionDate: 'Not Submitted',
    status: 'Draft',
    finalRemarks: 'Draft saved while waiting for barrel heater zone-3 reading.',
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
    supportingImages: [],
    usedParts: [{ id: 1, partCode: 'SP-103', quantityUsed: 1 }],
    checklistItems: createChecklistItemsTemplate(),
  },
  {
    pmId: 'PM-2026-409',
    machineId: 'IMM-09',
    machineName: 'Fanuc Roboshot 100T',
    line: 'Line D - Precision Gear',
    scheduledDate: '2026-11-27',
    pmSchedule: '2026-11-27 • 14:00',
    frequency: 'Cycle-based',
    assignedTechnician: 'Suresh Nair',
    assignedEngineer: 'Karan Mehta',
    inspectionDate: '2026-11-27',
    submissionDate: 'Not Submitted',
    status: 'Scheduled',
    finalRemarks: '',
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
    supportingImages: [],
    usedParts: [],
    checklistItems: createChecklistItemsTemplate(),
  },
  {
    pmId: 'PM-2026-406',
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    line: 'Line B - Interior Trim',
    scheduledDate: '2026-11-20',
    pmSchedule: '2026-11-20 • 09:30',
    frequency: 'Weekly',
    assignedTechnician: 'Suresh Nair',
    assignedEngineer: 'Karan Mehta',
    inspectionDate: '2026-11-20',
    submissionDate: '2026-11-20 15:05',
    status: 'Failed / Pending Admin Review',
    finalRemarks:
      'Zone-2 ceramic heater band failed insulation resistance test (12 MΩ vs 100 MΩ min). Machine isolated pending Admin review.',
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
    supportingImages: [
      {
        id: 'img-406-1',
        name: 'IMM04_HEATER_MEGGER_FAIL.JPG',
        uploadedAt: '2026-11-20 14:55',
        url: null,
      },
    ],
    usedParts: [{ id: 1, partCode: 'SP-101', quantityUsed: 1 }],
    checklistItems: createChecklistItemsTemplate().map((item) =>
      item.id === 3
        ? {
            ...item,
            result: 'Fail',
            paramValue: '12',
            remarks:
              'CRITICAL FAIL: Zone-2 barrel heater band insulation dropped to 12 MΩ; risk of short circuit.',
          }
        : item
    ),
  },
  {
    pmId: 'PM-2026-407',
    machineId: 'IMM-03',
    machineName: 'Fanuc Roboshot 150T',
    line: 'Line A - Automotive',
    scheduledDate: '2026-11-18',
    pmSchedule: '2026-11-18 • 10:00',
    frequency: 'Weekly',
    assignedTechnician: 'Suresh Nair',
    assignedEngineer: 'Karan Mehta',
    inspectionDate: '2026-11-18',
    submissionDate: '2026-11-18 14:20',
    status: 'Completed',
    finalRemarks: 'All 5 inspection checkpoints passed within tolerance.',
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
    supportingImages: [
      {
        id: 'img-407-1',
        name: 'IMM03_SERVO_LUBE_OK.JPG',
        uploadedAt: '2026-11-18 14:10',
        url: null,
      },
    ],
    usedParts: [{ id: 1, partCode: 'SP-103', quantityUsed: 1 }],
    checklistItems: createChecklistItemsTemplate(),
  },
  {
    pmId: 'PM-2026-398',
    machineId: 'IMM-08',
    machineName: 'Sumitomo 180T Electric',
    line: 'Line D - Precision Gear',
    scheduledDate: '2026-11-14',
    pmSchedule: '2026-11-14 • 13:00',
    frequency: 'Monthly',
    assignedTechnician: 'Amit Verma',
    assignedEngineer: 'Karan Mehta',
    inspectionDate: '2026-11-14',
    submissionDate: '2026-11-14 16:40',
    status: 'Closed',
    finalRemarks:
      'Hydraulic return oil temperature exceeded 58 °C limit during load test. Oil cooler flushed and re-tested.',
    adminRemarks:
      'Corrective oil cooler flush and Viton seal kit replacement verified. Formally closed by Admin.',
    closedBy: 'Rajesh Kumar (Admin)',
    closedAt: '2026-11-15 09:30',
    supportingImages: [
      {
        id: 'img-398-1',
        name: 'IMM08_THERMAL_SCAN_58C.JPG',
        uploadedAt: '2026-11-14 16:25',
        url: null,
      },
    ],
    usedParts: [{ id: 1, partCode: 'SP-105', quantityUsed: 1 }],
    checklistItems: createChecklistItemsTemplate().map((item) =>
      item.id === 2
        ? {
            ...item,
            result: 'Fail',
            paramValue: '58.4',
            remarks:
              'FAIL: Hydraulic oil temperature at 58.4 °C (above 50 °C max limit); oil cooler inspection required.',
          }
        : item
    ),
  },
];
