import { loadFromStorage, saveToStorage } from '../../utils/storage';

export const PM_TASKS_STORAGE_KEY = 'sanko_gosei_pm_tasks_v1';

export const initialPmTasks = [
  {
    pmId: 'PM-2026-401',
    machineId: 'IMM-02',
    machineName: 'Sumitomo 220T High-Speed',
    line: 'Line A - Automotive',
    frequency: 'Monthly',
    scheduledDate: '2026-11-20',
    engineer: 'Karan Mehta',
    status: 'Due Today',
  },
  {
    pmId: 'PM-2026-402',
    machineId: 'IMM-06',
    machineName: 'JSW 450T Heavy Mold',
    line: 'Line C - Bumper Line',
    frequency: 'Cycle-based',
    scheduledDate: '2026-11-18',
    engineer: 'Rohan Sharma',
    status: 'Overdue',
  },
  {
    pmId: 'PM-2026-403',
    machineId: 'IMM-01',
    machineName: 'Toshiba 180T Injection',
    line: 'Line A - Automotive',
    frequency: 'Daily',
    scheduledDate: '2026-11-20',
    engineer: 'Deepak Patel',
    status: 'Due Today',
  },
  {
    pmId: 'PM-2026-404',
    machineId: 'IMM-05',
    machineName: 'Nissei 350T Precision',
    line: 'Line B - Interior Trim',
    frequency: 'Weekly',
    scheduledDate: '2026-11-22',
    engineer: 'Karan Mehta',
    status: 'Upcoming',
  },
  {
    pmId: 'PM-2026-405',
    machineId: 'IMM-08',
    machineName: 'Sumitomo 180T Electric',
    line: 'Line D - Precision Gear',
    frequency: 'Monthly',
    scheduledDate: '2026-11-25',
    engineer: 'Vikram Singh',
    status: 'Upcoming',
  },
  {
    pmId: 'PM-2026-406',
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    line: 'Line B - Interior Trim',
    frequency: 'Weekly',
    scheduledDate: '2026-11-16',
    engineer: 'Suresh Nair',
    status: 'Overdue',
  },
  {
    pmId: 'PM-2026-407',
    machineId: 'IMM-03',
    machineName: 'Fanuc Roboshot 150T',
    line: 'Line A - Automotive',
    frequency: 'Weekly',
    scheduledDate: '2026-11-15',
    engineer: 'Deepak Patel',
    status: 'Completed',
  },
  {
    pmId: 'PM-2026-408',
    machineId: 'IMM-10',
    machineName: 'Toshiba 350T Hydraulic',
    line: 'Line D - Precision Gear',
    frequency: 'Monthly',
    scheduledDate: '2026-11-12',
    engineer: 'Rohan Sharma',
    status: 'Completed',
  },
  {
    pmId: 'PM-2026-409',
    machineId: 'IMM-09',
    machineName: 'Fanuc Roboshot 100T',
    line: 'Line D - Precision Gear',
    frequency: 'Cycle-based',
    scheduledDate: '2026-11-27',
    engineer: 'Karan Mehta',
    status: 'Upcoming',
  },
];

export const sampleCompletedChecklist = [
  {
    task: 'Check machine lubrication & automatic grease distributor block pressure',
    result: 'Pass',
    paramLabel: 'Lubrication Pressure (Bar)',
    paramValue: '43',
    remarks: 'Grease pressure optimal across all toggle points.',
  },
  {
    task: 'Inspect hydraulic system return filter, hose fittings & oil temperature',
    result: 'Pass',
    paramLabel: 'Hydraulic Oil Temp (°C)',
    paramValue: '41.8',
    remarks: 'Replaced return filter element; no leaks.',
  },
  {
    task: 'Check electrical connections, barrel heater band resistance & thermocouples',
    result: 'Pass',
    paramLabel: 'Heater Insulation (MΩ)',
    paramValue: '135',
    remarks: 'All heater zones operating within tolerance.',
  },
  {
    task: 'Inspect machine safety guards, operator door limit switch & emergency stops',
    result: 'Pass',
    paramLabel: 'Interlock Test',
    paramValue: 'Verified',
    remarks: 'Safety door cutoff verified.',
  },
  {
    task: 'Check machine operating condition, clamping toggle pins & platen parallelism',
    result: 'Pass',
    paramLabel: 'Clamping Pressure (Bar)',
    paramValue: '146',
    remarks: 'Clamping stroke smooth.',
  },
];

export const initialPmHistory = [
  {
    pmId: 'PM-2026-407',
    machineId: 'IMM-03',
    machineName: 'Fanuc Roboshot 150T',
    line: 'Line A - Automotive',
    pmType: 'Weekly',
    scheduledDate: '2026-11-15',
    completionDate: '2026-11-15 14:20',
    technician: 'Deepak Patel',
    inspectionResult: 'All Passed',
    status: 'Completed On Time',
    finalRemarks: 'Weekly preventive check completed on time. All servo axes lubricated.',
    evidencePhoto: 'IMG_IMM03_WEEKLY_SERVO_LUBE.JPG',
    checklistItems: sampleCompletedChecklist,
    sparePartsUsed: [
      {
        partCode: 'SP-215',
        description: 'Synthetic High-Temp Toggle Grease Cartridge',
        quantityUsed: 1,
      },
    ],
  },
  {
    pmId: 'PM-2026-408',
    machineId: 'IMM-10',
    machineName: 'Toshiba 350T Hydraulic',
    line: 'Line D - Precision Gear',
    pmType: 'Monthly',
    scheduledDate: '2026-11-12',
    completionDate: '2026-11-12 17:45',
    technician: 'Rohan Sharma',
    inspectionResult: 'All Passed',
    status: 'Completed On Time',
    finalRemarks: 'Monthly hydraulic filter and heater band inspection completed.',
    evidencePhoto: 'IMG_IMM10_HYDRAULIC_FILTER_PM.JPG',
    checklistItems: sampleCompletedChecklist,
    sparePartsUsed: [
      {
        partCode: 'SP-104',
        description: 'Hydraulic Return Line Filter Element 10µm',
        quantityUsed: 1,
      },
      {
        partCode: 'SP-410',
        description: 'Viton Hydraulic Seal & O-Ring Kit',
        quantityUsed: 1,
      },
    ],
  },
  {
    pmId: 'PM-2026-394',
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    line: 'Line B - Interior Trim',
    pmType: 'Monthly',
    scheduledDate: '2026-11-05',
    completionDate: '2026-11-07 11:30',
    technician: 'Suresh Nair',
    inspectionResult: '1 Failed',
    status: 'Delayed',
    finalRemarks: 'Zone-2 heater band insulation measured low; replaced ceramic heater band.',
    evidencePhoto: 'IMG_IMM04_HEATER_BAND_REPLACE.JPG',
    checklistItems: sampleCompletedChecklist.map((item, idx) =>
      idx === 2
        ? {
            ...item,
            result: 'Fail',
            paramValue: '12',
            remarks: 'Zone-2 heater band failed insulation check; replaced with SP-108.',
          }
        : item
    ),
    sparePartsUsed: [
      {
        partCode: 'SP-108',
        description: 'Ceramic Barrel Heater Band 240V',
        quantityUsed: 1,
      },
    ],
  },
  {
    pmId: 'PM-2026-389',
    machineId: 'IMM-01',
    machineName: 'Toshiba 180T Injection',
    line: 'Line A - Automotive',
    pmType: 'Cycle-based',
    scheduledDate: '2026-10-28',
    completionDate: '2026-10-28 16:10',
    technician: 'Karan Mehta',
    inspectionResult: 'All Passed',
    status: 'Completed On Time',
    finalRemarks: '50,000-shot cycle maintenance completed with zero defects.',
    evidencePhoto: 'IMG_IMM01_50K_CYCLE_AUDIT.JPG',
    checklistItems: sampleCompletedChecklist,
    sparePartsUsed: [
      {
        partCode: 'SP-302',
        description: 'K-Type Barrel Thermocouple Sensor Probe',
        quantityUsed: 1,
      },
    ],
  },
];

// Future backend integration: replace localStorage operations with API calls
export const maintenanceService = {
  getTasks() {
    return loadFromStorage(PM_TASKS_STORAGE_KEY, initialPmTasks);
  },

  saveTasks(tasks) {
    saveToStorage(PM_TASKS_STORAGE_KEY, tasks);
  },

  getHistory() {
    return initialPmHistory;
  },
};
