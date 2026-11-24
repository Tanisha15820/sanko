import { loadFromStorage, saveToStorage } from '../../utils/storage';

export const TOOLS_STORAGE_KEY = 'sanko_gosei_tools_v1';

export const initialTools = [
  {
    toolId: 'MLD-SG-204',
    toolName: 'Door Trim Clip Housing 2-Cavity Mold',
    toolType: 'Molds',
    compatibleMachine: 'IMM-01 (Toshiba 180T)',
    usageCount: 48200,
    maxRefurbShots: 50000,
    currentLocation: 'Press Line A - IMM-01',
    lastMaintenanceDate: '2026-10-25',
    nextRefurbishmentDate: '2026-11-23',
    status: 'In Press',
    remarks: 'Approaching 50,000-shot cavity polishing & guide pin lubrication threshold.',
    currentUsageInfo: 'Mounted on IMM-01 running Shift A batch #B-884 (28.4s cycle).',
    usageHistory: [
      { date: '20 Nov 2026', machine: 'IMM-01', shots: '1,166 shots', shift: 'Shift A' },
      { date: '19 Nov 2026', machine: 'IMM-01', shots: '2,350 shots', shift: 'Shift A & B' },
      { date: '18 Nov 2026', machine: 'IMM-01', shots: '2,280 shots', shift: 'Shift A & B' },
    ],
    maintenanceHistory: [
      {
        date: '25 Oct 2026',
        type: 'Preventive Polishing',
        description: 'Cavity mirror polishing, venting slot cleaning & ejector pin lubrication.',
        technician: 'Rohan Sharma',
        status: 'Completed',
      },
      {
        date: '28 Sep 2026',
        type: 'Seal Replacement',
        description: 'Replaced cooling manifold Viton O-rings and pressure tested channels.',
        technician: 'Karan Mehta',
        status: 'Completed',
      },
    ],
  },
  {
    toolId: 'MLD-SG-610',
    toolName: 'Front Bumper Lower Grille Heavy Mold',
    toolType: 'Molds',
    compatibleMachine: 'IMM-06 (JSW 450T)',
    usageCount: 34900,
    maxRefurbShots: 50000,
    currentLocation: 'Press Line C - IMM-06',
    lastMaintenanceDate: '2026-11-02',
    nextRefurbishmentDate: '2026-12-15',
    status: 'In Press',
    remarks: 'Hot runner manifold balanced across all 4 drops. Operating normally.',
    currentUsageInfo: 'Mounted on IMM-06 running Bumper Grille production.',
    usageHistory: [
      { date: '20 Nov 2026', machine: 'IMM-06', shots: '1,157 shots', shift: 'Shift A' },
      { date: '19 Nov 2026', machine: 'IMM-06', shots: '1,190 shots', shift: 'Shift A' },
    ],
    maintenanceHistory: [
      {
        date: '02 Nov 2026',
        type: 'Hot Runner Inspection',
        description: 'Verified gate pin actuation and heater thermocouple calibration.',
        technician: 'Suresh Nair',
        status: 'Completed',
      },
    ],
  },
  {
    toolId: 'DIE-SG-112',
    toolName: 'Bumper Bracket Progressive Trimming Die',
    toolType: 'Dies',
    compatibleMachine: 'IMM-07 (Engel 300T)',
    usageCount: 29400,
    maxRefurbShots: 40000,
    currentLocation: 'Tool Room Bay-2',
    lastMaintenanceDate: '2026-11-14',
    nextRefurbishmentDate: '2026-12-20',
    status: 'In Tool Room',
    remarks: 'Cleaned, anti-rust coated, and stored in Tool Room Bay-2 ready for next schedule.',
    currentUsageInfo: 'On standby in Tool Room Bay-2.',
    usageHistory: [
      { date: '13 Nov 2026', machine: 'IMM-07', shots: '1,840 cycles', shift: 'Shift B' },
    ],
    maintenanceHistory: [
      {
        date: '14 Nov 2026',
        type: 'Edge Sharpening',
        description: 'Trimming blade clearance check and post-run cleaning.',
        technician: 'Deepak Patel',
        status: 'Completed',
      },
    ],
  },
  {
    toolId: 'JIG-SG-305',
    toolName: 'Ultrasonic Welding Alignment Jig - Console',
    toolType: 'Jigs',
    compatibleMachine: 'IMM-02 (Sumitomo 220T)',
    usageCount: 49500,
    maxRefurbShots: 50000,
    currentLocation: 'Tool Maintenance Bay',
    lastMaintenanceDate: '2026-10-10',
    nextRefurbishmentDate: '2026-11-21',
    status: 'Under Maintenance',
    remarks: 'Undergoing 50k cycle clamp bushing replacement and coordinate calibration.',
    currentUsageInfo: 'Currently disassembled in Tool Maintenance Bay for refurbishment.',
    usageHistory: [
      { date: '18 Nov 2026', machine: 'IMM-02', shots: '1,420 cycles', shift: 'Shift A' },
    ],
    maintenanceHistory: [
      {
        date: '10 Oct 2026',
        type: 'CMM Calibration',
        description: 'Verified datum locator pins against 3D CAD tolerance.',
        technician: 'Vikram Singh',
        status: 'Completed',
      },
    ],
  },
  {
    toolId: 'FIX-SG-408',
    toolName: 'Interior Trim Cooling & Checking Fixture',
    toolType: 'Fixtures',
    compatibleMachine: 'IMM-05 (Nissei 350T)',
    usageCount: 21800,
    maxRefurbShots: 45000,
    currentLocation: 'Press Line B - IMM-05',
    lastMaintenanceDate: '2026-11-10',
    nextRefurbishmentDate: '2027-01-10',
    status: 'In Press',
    remarks: 'Pneumatic toggle clamps operating smoothly at 6 Bar.',
    currentUsageInfo: 'Active at Line B station adjacent to IMM-05.',
    usageHistory: [
      { date: '20 Nov 2026', machine: 'IMM-05', shots: '1,730 cycles', shift: 'Shift B' },
    ],
    maintenanceHistory: [
      {
        date: '10 Nov 2026',
        type: 'Routine Check',
        description: 'Checked pneumatic clamp cylinders and nylon resting pads.',
        technician: 'Amit Verma',
        status: 'Completed',
      },
    ],
  },
  {
    toolId: 'MLD-SG-702',
    toolName: 'Actuator Spur Gear 42T Precision Mold',
    toolType: 'Molds',
    compatibleMachine: 'IMM-08 (Sumitomo 180T)',
    usageCount: 47900,
    maxRefurbShots: 50000,
    currentLocation: 'Tool Room Bay-1',
    lastMaintenanceDate: '2026-10-18',
    nextRefurbishmentDate: '2026-11-24',
    status: 'In Tool Room',
    remarks: 'Scheduled for gear tooth profile inspection and core pin refurbishment this week.',
    currentUsageInfo: 'Stored in humidity-controlled Tool Room Bay-1.',
    usageHistory: [
      { date: '19 Nov 2026', machine: 'IMM-08', shots: '1,117 shots', shift: 'Shift B' },
    ],
    maintenanceHistory: [
      {
        date: '18 Oct 2026',
        type: 'Core Pin Inspection',
        description: 'Measured gear cavity concentricity and lubricated slides.',
        technician: 'Rohan Sharma',
        status: 'Completed',
      },
    ],
  },
];

// Future backend integration: replace localStorage operations with API calls
export const toolService = {
  getAll() {
    return loadFromStorage(TOOLS_STORAGE_KEY, initialTools);
  },

  saveAll(tools) {
    saveToStorage(TOOLS_STORAGE_KEY, tools);
  },
};
