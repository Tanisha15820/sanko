// Dummy RCA / CAPA records and helpers for Sanko Gosei Maintenance 4.0
// Pure React state only (no backend APIs or localStorage)

export const RCA_STATUSES = [
  'RCA Required',
  'Draft',
  'Pending Admin Review',
  'Closed',
];

export const RCA_STATUS_VARIANTS = {
  'RCA Required': 'red',
  Draft: 'slate',
  'Pending Admin Review': 'orange',
  Closed: 'green',
};

export const initialRcaReports = [
  {
    rcaId: 'RCA-2026-001',
    breakdownId: 'BD-2026-041',
    productName: 'Glove Box Latch Cover',
    status: 'Pending Admin Review',
    submittedBy: 'Karan Mehta',
    submissionDate: '2026-11-20',
    targetDate: '2026-11-28',
    // Section B - Problem Details
    problemDescription:
      'Main proportional pressure valve solenoid coil overheated causing sudden clamping pressure drop.',
    breakdownCategory: 'Hydraulic',
    failureDetails:
      'Clamping pressure dropped from 145 Bar to 68 Bar mid-cycle during Shift A production. Solenoid coil resistance measured open circuit after thermal trip.',
    defectImageName: 'IMM04_SOLENOID_VALVE.JPG',
    defectImageUrl: null,
    // Section C - Root Cause (5-Why style)
    why1: 'Clamping pressure dropped suddenly during injection molding cycle.',
    why2: 'Proportional pressure relief 24V solenoid coil failed electrically.',
    why3: 'Solenoid coil winding insulation degraded due to excessive operating temperature (> 85 °C).',
    why4: 'Hydraulic oil cooler fins were clogged with shopfloor dust, raising manifold temperature during sustained high-duty clamping.',
    finalRootCause:
      'Clogged hydraulic oil cooler fins caused elevated hydraulic manifold temperature, leading to thermal insulation breakdown of the 24V proportional pressure solenoid coil.',
    // Section D - Corrective Actions
    temporaryCountermeasure:
      'Replaced failed 24V proportional solenoid coil (SP-106) and externally air-cleaned oil cooler fins to restore 145 Bar clamping pressure.',
    permanentCountermeasure:
      'Install fine mesh pre-filter screen on oil cooler intake and upgrade solenoid coil to Class-H high-temperature insulation rating.',
    responsiblePerson: 'Karan Mehta',
    targetCompletionDate: '2026-11-28',
    // Section E - Preventive Actions
    inspectionControlPlan:
      'Add bi-weekly infrared thermal scan of hydraulic manifold and solenoid coils (limit < 65 °C) to PM checklist.',
    processControlPlan:
      'Configure PLC hydraulic oil temperature warning alarm at 50 °C and auto-interlock at 55 °C.',
    preventionPlan:
      'Horizontal deployment of cooler pre-filter screens across all Toshiba servo-hydraulic molding machines (IMM-01, IMM-04, IMM-10).',
    // Section F - Improvement Evidence
    beforeImageName: 'BEFORE_CLOGGED_COOLER_FINS.JPG',
    beforeImageUrl: null,
    afterImageName: 'AFTER_NEW_SOLENOID_CLEAN_COOLER.JPG',
    afterImageUrl: null,
    preventionImageName: 'PREVENTION_PM_THERMAL_CHECKLIST.JPG',
    preventionImageUrl: null,
    // Section G - Engineer Remarks
    engineerRemarks:
      'Machine ran 24 hours continuously post-repair with manifold oil temperature stable at 42.8 °C. Submitted for Admin review and formal CAPA closure.',
    // Admin Review
    adminRemarks: '',
    closedBy: '',
    closedAt: '',
  },
  {
    rcaId: 'RCA-2026-002',
    breakdownId: 'BD-2026-038',
    productName: 'Front Bumper Lower Grille',
    status: 'Closed',
    submittedBy: 'Rohan Sharma',
    submissionDate: '2026-11-18',
    targetDate: '2026-11-25',
    problemDescription:
      'Hot runner gate pin sticking on cavity #2 causing short-shot molding defects.',
    breakdownCategory: 'Tooling',
    failureDetails:
      'Valve gate pin #2 seized in partially closed position after resin grade changeover, resulting in incomplete fill on lower grille ribs.',
    defectImageName: 'IMM06_GATE_PIN_SEIZED.JPG',
    defectImageUrl: null,
    why1: 'Cavity #2 produced short-shot bumper grille parts.',
    why2: 'Hot runner valve gate pin #2 failed to retract completely during injection.',
    why3: 'Carbonized polymer residue accumulated inside valve bushing #2.',
    why4: 'Mandatory purge compound cycle was skipped during prior ABS-to-PP resin changeover while hot half remained at 265 °C.',
    finalRootCause:
      'Skipping the purge compound cycle during resin grade changeover left residual polymer at 265 °C, causing carbon buildup and valve pin seizure.',
    temporaryCountermeasure:
      'Dismantled hot half, removed carbonized resin from bushing #2, polished gate pin, and verified 10 consecutive QC-approved trial shots.',
    permanentCountermeasure:
      'Update resin changeover SOP with mandatory purge verification sign-off by Shift Engineer before heating changeover.',
    responsiblePerson: 'Rohan Sharma',
    targetCompletionDate: '2026-11-25',
    inspectionControlPlan:
      'Inspect valve pin stroke indicator and hot runner drop balance every 25,000 shots during mold PM.',
    processControlPlan:
      'Enforce barcode-logged purge compound consumption step in Shift Changeover Sheet.',
    preventionPlan:
      'Train all Line C operators and tool setters on high-temp resin purge procedure and post visual SOP at IMM-06 & IMM-07.',
    beforeImageName: 'BEFORE_CARBON_BUILDUP_PIN2.JPG',
    beforeImageUrl: null,
    afterImageName: 'AFTER_POLISHED_VALVE_PIN2.JPG',
    afterImageUrl: null,
    preventionImageName: 'PREVENTION_CHANGEOVER_SOP_BOARD.JPG',
    preventionImageUrl: null,
    engineerRemarks:
      'All 4 hot runner drops balanced and QC cleared production batch. SOP training completed for Shift A & B.',
    adminRemarks:
      'Root cause and preventive actions verified on shopfloor. Changeover SOP audit scheduled for next month. RCA formally approved and closed.',
    closedBy: 'Rajesh Kumar (Admin)',
    closedAt: '2026-11-18 16:20',
  },
];

export const createEmptyRcaDraft = (breakdown, nextRcaId, engineerName) => ({
  rcaId: nextRcaId,
  breakdownId: breakdown.breakdownId,
  productName: breakdown.machineName,
  status: 'Draft',
  submittedBy:
    breakdown.assignedEngineer && breakdown.assignedEngineer !== 'Unassigned'
      ? breakdown.assignedEngineer
      : engineerName,
  submissionDate: '',
  targetDate: '',
  problemDescription: breakdown.problemDescription || '',
  breakdownCategory: breakdown.category || 'Mechanical',
  failureDetails: '',
  defectImageName: breakdown.imageName || '',
  defectImageUrl: breakdown.imageUrl || null,
  why1: '',
  why2: '',
  why3: '',
  why4: '',
  finalRootCause: '',
  temporaryCountermeasure: '',
  permanentCountermeasure: '',
  responsiblePerson:
    breakdown.assignedEngineer && breakdown.assignedEngineer !== 'Unassigned'
      ? breakdown.assignedEngineer
      : engineerName,
  targetCompletionDate: '',
  inspectionControlPlan: '',
  processControlPlan: '',
  preventionPlan: '',
  beforeImageName: '',
  beforeImageUrl: null,
  afterImageName: '',
  afterImageUrl: null,
  preventionImageName: '',
  preventionImageUrl: null,
  engineerRemarks: breakdown.engineerRemarks || '',
  adminRemarks: '',
  closedBy: '',
  closedAt: '',
});
