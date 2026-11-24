import { loadFromStorage, saveToStorage } from '../../utils/storage';

export const BREAKDOWNS_STORAGE_KEY = 'sanko_gosei_breakdowns_v1';

export const initialBreakdowns = [
  {
    breakdownId: 'BD-2026-041',
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    faultCategory: 'Hydraulic',
    startTime: '20 Nov 2026, 10:15 AM',
    downtime: '2h 20m',
    downtimeMinutes: 140,
    technician: 'Suresh Nair',
    status: 'Active',
    rootCauseNotes:
      'Main proportional pressure valve solenoid coil overheated causing pressure drop in clamping cylinder.',
  },
  {
    breakdownId: 'BD-2026-040',
    machineId: 'IMM-08',
    machineName: 'Sumitomo 180T Electric',
    faultCategory: 'Electrical',
    startTime: '20 Nov 2026, 11:40 AM',
    downtime: '55m',
    downtimeMinutes: 55,
    technician: 'Vikram Singh',
    status: 'Active',
    rootCauseNotes:
      'Barrel Heater Zone-2 K-type thermocouple open circuit fault; replacement sensor requested from spare parts store.',
  },
  {
    breakdownId: 'BD-2026-039',
    machineId: 'IMM-02',
    machineName: 'Sumitomo 220T High-Speed',
    faultCategory: 'Pneumatic',
    startTime: '19 Nov 2026, 03:10 PM',
    downtime: '1h 15m',
    downtimeMinutes: 75,
    technician: 'Amit Verma',
    status: 'Resolved',
    rootCauseNotes:
      'Ejector blow valve air regulator pressure fluctuation fixed by replacing damaged FRL seal.',
  },
  {
    breakdownId: 'BD-2026-038',
    machineId: 'IMM-06',
    machineName: 'JSW 450T Heavy Mold',
    faultCategory: 'Tooling',
    startTime: '18 Nov 2026, 09:20 AM',
    downtime: '1h 45m',
    downtimeMinutes: 105,
    technician: 'Rohan Sharma',
    status: 'Resolved',
    rootCauseNotes:
      'Hot runner gate pin sticking on cavity #2; cleaned and polished pin assembly.',
  },
  {
    breakdownId: 'BD-2026-037',
    machineId: 'IMM-01',
    machineName: 'Toshiba 180T Injection',
    faultCategory: 'Mechanical',
    startTime: '17 Nov 2026, 02:00 PM',
    downtime: '1h 05m',
    downtimeMinutes: 65,
    technician: 'Suresh Nair',
    status: 'Resolved',
    rootCauseNotes:
      'Toggle link lubrication distributor block clogged; cleared blockage and verified grease pressure.',
  },
  {
    breakdownId: 'BD-2026-036',
    machineId: 'IMM-10',
    machineName: 'Toshiba 350T Hydraulic',
    faultCategory: 'Hydraulic',
    startTime: '15 Nov 2026, 04:30 PM',
    downtime: '1h 30m',
    downtimeMinutes: 90,
    technician: 'Deepak Patel',
    status: 'Resolved',
    rootCauseNotes:
      'Oil cooler return line O-ring leak sealed and hydraulic oil topped up.',
  },
];

// Future backend integration: replace localStorage operations with API calls
export const breakdownService = {
  getAll() {
    return loadFromStorage(BREAKDOWNS_STORAGE_KEY, initialBreakdowns);
  },

  saveAll(breakdowns) {
    saveToStorage(BREAKDOWNS_STORAGE_KEY, breakdowns);
  },
};
