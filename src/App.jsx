import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import DashboardLayout from './Components/DashboardLayout';
import Dashboard from './Pages/Dashboard';
import MachineStatus from './Pages/MachineStatus';
import BreakdownManagement from './Pages/BreakdownManagement';
import MachineDetails from './Pages/MachineDetails';
import ProductionMonitoring from './Pages/ProductionMonitoring';
import PMCalendar from './Pages/PMCalendar';
import PMChecklist from './Pages/PMChecklist';
import PMHistory from './Pages/PMHistory';
import SparePartsInventory from './Pages/SparePartsInventory';
import ToolManagement from './Pages/ToolManagement';
import NotificationsAlerts from './Pages/NotificationsAlerts';
import EscalationManagement from './Pages/EscalationManagement';

const initialBreakdowns = [
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

const initialPmTasks = [
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

const initialSpareParts = [
  {
    partCode: 'SP-108',
    description: 'Ceramic Barrel Heater Band 240V',
    compatibleMachine: 'IMM-01 / IMM-02 (Toshiba & Sumitomo)',
    binLocation: 'Rack A-01',
    availableStock: 5,
    minThreshold: 4,
    unit: 'pcs',
  },
  {
    partCode: 'SP-104',
    description: 'Hydraulic Return Line Filter Element 10µm',
    compatibleMachine: 'IMM-04 / IMM-10 (Toshiba Hydraulic)',
    binLocation: 'Rack A-03',
    availableStock: 20,
    minThreshold: 6,
    unit: 'pcs',
  },
  {
    partCode: 'SP-215',
    description: 'Synthetic High-Temp Toggle Grease Cartridge',
    compatibleMachine: 'All Molding Machines (IMM-01 to IMM-10)',
    binLocation: 'Rack B-01',
    availableStock: 4,
    minThreshold: 5,
    unit: 'tubes',
  },
  {
    partCode: 'SP-302',
    description: 'K-Type Barrel Thermocouple Sensor Probe',
    compatibleMachine: 'IMM-08 / IMM-09 (Electric Series)',
    binLocation: 'Rack B-02',
    availableStock: 9,
    minThreshold: 4,
    unit: 'pcs',
  },
  {
    partCode: 'SP-410',
    description: 'Viton Hydraulic Seal & O-Ring Kit',
    compatibleMachine: 'IMM-06 (JSW 450T Heavy Mold)',
    binLocation: 'Rack C-01',
    availableStock: 15,
    minThreshold: 6,
    unit: 'kits',
  },
  {
    partCode: 'SP-512',
    description: 'Proportional Pressure Relief Solenoid Coil 24V',
    compatibleMachine: 'IMM-04 (Toshiba 250T Servo)',
    binLocation: 'Rack C-04',
    availableStock: 0,
    minThreshold: 2,
    unit: 'pcs',
  },
];

const initialStockLedger = [
  {
    transactionId: 'TXN-2026-904',
    partCode: 'SP-104',
    description: 'Hydraulic Return Line Filter Element 10µm',
    transactionType: 'Stock Added',
    quantity: 10,
    reference: 'GRN-2026-118 (Vendor Restock)',
    dateTime: '2026-11-18 09:30',
  },
  {
    transactionId: 'TXN-2026-903',
    partCode: 'SP-215',
    description: 'Synthetic High-Temp Toggle Grease Cartridge',
    transactionType: 'Stock Deducted',
    quantity: 1,
    reference: 'PM-2026-407 (IMM-03)',
    dateTime: '2026-11-15 14:20',
  },
  {
    transactionId: 'TXN-2026-902',
    partCode: 'SP-410',
    description: 'Viton Hydraulic Seal & O-Ring Kit',
    transactionType: 'Stock Deducted',
    quantity: 1,
    reference: 'PM-2026-408 (IMM-10)',
    dateTime: '2026-11-12 17:45',
  },
  {
    transactionId: 'TXN-2026-901',
    partCode: 'SP-512',
    description: 'Proportional Pressure Relief Solenoid Coil 24V',
    transactionType: 'Stock Deducted',
    quantity: 2,
    reference: 'BD-2026-041 (IMM-04)',
    dateTime: '2026-11-10 11:15',
  },
];

const sampleCompletedChecklist = [
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

const initialPmHistory = [
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

const initialNotifications = [
  {
    notificationId: 'NTF-2026-101',
    eventKey: 'BD-TOP-BD-2026-041',
    title: 'Critical Breakdown Escalated to Top-Level Management (IMM-04)',
    type: 'Machine Breakdown Alert',
    description:
      'Breakdown BD-2026-041 on IMM-04 (Toshiba 250T Servo) exceeded 90m critical duration (Downtime: 2h 20m). Automatically escalated to Plant Head & Operations Leadership.',
    relatedEntity: 'IMM-04 • BD-2026-041',
    priority: 'Critical',
    dateTime: '2026-11-20 11:45',
    status: 'Unread',
    recommendedAction:
      'Expedite emergency procurement of 24V proportional pressure solenoid coil (SP-512) and reallocate Line B molds.',
  },
  {
    notificationId: 'NTF-2026-102',
    eventKey: 'BD-MID-BD-2026-040',
    title: 'Active Machine Breakdown Reported on IMM-08',
    type: 'Machine Breakdown Alert',
    description:
      'IMM-08 (Sumitomo 180T Electric) stopped due to Barrel Heater Zone-2 thermocouple fault (BD-2026-040). Assigned to Mid-Level Management.',
    relatedEntity: 'IMM-08 • BD-2026-040',
    priority: 'High',
    dateTime: '2026-11-20 11:40',
    status: 'Unread',
    recommendedAction:
      'Shift Manager & Maintenance Manager to verify sensor replacement from Rack B-02 (SP-302).',
  },
  {
    notificationId: 'NTF-2026-103',
    eventKey: 'REORDER-SP-512',
    title: 'Spare Part Out of Stock — Immediate Reorder Required',
    type: 'Spare Part Reorder Alert',
    description:
      'Proportional Pressure Relief Solenoid Coil 24V (SP-512) available stock is 0 pcs (Minimum reorder threshold: 2 pcs).',
    relatedEntity: 'SP-512 (Rack C-04)',
    priority: 'Critical',
    dateTime: '2026-11-20 10:30',
    status: 'Unread',
    recommendedAction:
      'Raise urgent purchase requisition PR-2026-884 with approved hydraulic vendor.',
  },
  {
    notificationId: 'NTF-2026-104',
    eventKey: 'PM-OVERDUE-PM-2026-402',
    title: 'Overdue Preventive Maintenance on IMM-06',
    type: 'Overdue Maintenance',
    description:
      'Cycle-based PM (PM-2026-402) for IMM-06 (JSW 450T Heavy Mold) passed its scheduled date (2026-11-18) without sign-off.',
    relatedEntity: 'IMM-06 • PM-2026-402',
    priority: 'High',
    dateTime: '2026-11-20 09:00',
    status: 'Unread',
    recommendedAction:
      'Coordinate with Production Line C to release IMM-06 for 50,000-shot inspection.',
  },
  {
    notificationId: 'NTF-2026-105',
    eventKey: 'LOW-STOCK-SP-215',
    title: 'Low Spare Parts Stock Below Minimum Threshold',
    type: 'Low Stock Alert',
    description:
      'Synthetic High-Temp Toggle Grease Cartridge (SP-215) stock dropped to 4 tubes (Minimum reorder quantity: 5 tubes).',
    relatedEntity: 'SP-215 (Rack B-01)',
    priority: 'Medium',
    dateTime: '2026-11-20 08:45',
    status: 'Read',
    recommendedAction:
      'Add SP-215 to weekly maintenance store replenishment batch.',
  },
  {
    notificationId: 'NTF-2026-106',
    eventKey: 'PM-DUE-PM-2026-401',
    title: 'Scheduled Monthly PM Due Today for IMM-02',
    type: 'PM Due Reminder',
    description:
      'Monthly Preventive Maintenance (PM-2026-401) for IMM-02 (Sumitomo 220T High-Speed) is due today (2026-11-20). Assigned to Karan Mehta.',
    relatedEntity: 'IMM-02 • PM-2026-401',
    priority: 'Medium',
    dateTime: '2026-11-20 08:00',
    status: 'Read',
    recommendedAction:
      'Open PM Checklist for PM-2026-401 and complete 5-point inspection before 18:00 hrs.',
  },
  {
    notificationId: 'NTF-2026-107',
    eventKey: 'TOOL-REFURB-MLD-SG-204',
    title: 'Upcoming Tool Refurbishment Threshold Reached',
    type: 'Tool Maintenance Reminder',
    description:
      'Door Trim Clip Housing 2-Cavity Mold (MLD-SG-204) reached 48,200 / 50,000 shots (96.4% life). Refurbishment scheduled for 2026-11-23.',
    relatedEntity: 'MLD-SG-204 (IMM-01)',
    priority: 'Medium',
    dateTime: '2026-11-19 17:15',
    status: 'Read',
    recommendedAction:
      'Schedule Tool Room Bay-1 slot for cavity mirror polishing and guide pin lubrication.',
  },
  {
    notificationId: 'NTF-2026-108',
    eventKey: 'BD-RESOLVED-BD-2026-039',
    title: 'Breakdown Resolved & Machine Restored (IMM-02)',
    type: 'Machine Breakdown Alert',
    description:
      'Pneumatic ejector blow valve fault (BD-2026-039) on IMM-02 was resolved by Amit Verma within 1h 15m.',
    relatedEntity: 'IMM-02 • BD-2026-039',
    priority: 'Low',
    dateTime: '2026-11-19 16:25',
    status: 'Resolved',
    recommendedAction: 'No further action required. Audit trail archived.',
  },
];

const initialEscalations = [
  {
    escalationId: 'ESC-2026-01',
    breakdownId: 'BD-2026-041',
    machineId: 'IMM-04',
    machineName: 'Toshiba 250T Servo',
    description:
      'Main proportional pressure valve solenoid coil overheated causing clamping pressure drop.',
    priority: 'Critical',
    escalationLevel: 'Top-Level Management',
    assignedRole: 'Plant Head & Operations Leadership',
    startDate: '2026-11-20',
    startTime: '20 Nov 2026, 10:15 AM',
    escalationDateTime: '20 Nov 2026, 11:45 AM',
    downtimeMinutes: 140,
    recoveryEta: 'Today, 03:30 PM',
    status: 'Escalated to Top Management',
    rootCause:
      'Proportional pressure relief valve 24V solenoid coil winding insulation failure.',
    resourceBottlenecks:
      'Spare coil SP-512 out of stock in Rack C-04; emergency courier dispatched from Pune vendor.',
    technician: 'Suresh Nair',
    repairProgress: '60% — Faulty valve dismantled, awaiting spare coil arrival',
    remarks:
      'Plant Head authorized express air courier and temporary shift production transfer to IMM-05.',
    resolutionDateTime: null,
    history: [
      {
        dateTime: '20 Nov 2026, 10:15 AM',
        event: 'Breakdown Reported',
        description: 'Hydraulic clamping pressure drop alarm triggered on IMM-04.',
        responsible: 'Line B Operator',
      },
      {
        dateTime: '20 Nov 2026, 10:17 AM',
        event: 'Maintenance Engineer Notified',
        description: 'Alert dispatched to assigned technician Suresh Nair.',
        responsible: 'Maintenance 4.0 System',
      },
      {
        dateTime: '20 Nov 2026, 10:20 AM',
        event: 'Mid-Level Management Notified',
        description: 'Escalation Level 1 opened for Shift Manager & Maintenance Manager.',
        responsible: 'Shift Manager & Maintenance Manager',
      },
      {
        dateTime: '20 Nov 2026, 10:35 AM',
        event: 'Recovery Started',
        description: 'Technician diagnosed solenoid coil failure; checked Rack C-04 stock.',
        responsible: 'Suresh Nair (Maintenance Engineer)',
      },
      {
        dateTime: '20 Nov 2026, 11:45 AM',
        event: 'Escalated to Top-Level Management',
        description:
          'Critical duration (90 mins) exceeded due to spare part stockout. Auto-escalated to Plant Head & Operations Leadership.',
        responsible: 'Plant Head & Operations Leadership',
      },
    ],
  },
  {
    escalationId: 'ESC-2026-02',
    breakdownId: 'BD-2026-040',
    machineId: 'IMM-08',
    machineName: 'Sumitomo 180T Electric',
    description:
      'Barrel Heater Zone-2 K-type thermocouple open circuit fault stopping injection cycle.',
    priority: 'High',
    escalationLevel: 'Mid-Level Management',
    assignedRole: 'Shift Manager & Maintenance Manager',
    startDate: '2026-11-20',
    startTime: '20 Nov 2026, 11:40 AM',
    escalationDateTime: '20 Nov 2026, 11:42 AM',
    downtimeMinutes: 55,
    recoveryEta: 'Today, 01:15 PM',
    status: 'In Progress',
    rootCause: 'K-type thermocouple probe lead wire fatigue at Zone-2 heater clamp.',
    resourceBottlenecks: 'Barrel cooling down before safe sensor replacement (SP-302 in stock).',
    technician: 'Vikram Singh',
    repairProgress: '75% — Replacement sensor SP-302 drawn from store, installation underway',
    remarks: 'Expected to resume production within critical duration window.',
    resolutionDateTime: null,
    history: [
      {
        dateTime: '20 Nov 2026, 11:40 AM',
        event: 'Breakdown Reported',
        description: 'Temperature sensor open-circuit fault logged on IMM-08.',
        responsible: 'Line D Operator',
      },
      {
        dateTime: '20 Nov 2026, 11:41 AM',
        event: 'Maintenance Engineer Notified',
        description: 'Assigned to electrical technician Vikram Singh.',
        responsible: 'Maintenance 4.0 System',
      },
      {
        dateTime: '20 Nov 2026, 11:42 AM',
        event: 'Mid-Level Management Notified',
        description: 'Shift Manager & Maintenance Manager alerted for downtime tracking.',
        responsible: 'Shift Manager & Maintenance Manager',
      },
      {
        dateTime: '20 Nov 2026, 11:55 AM',
        event: 'Recovery Started',
        description: 'Replacement probe SP-302 issued; barrel cooldown initiated.',
        responsible: 'Vikram Singh (Maintenance Engineer)',
      },
    ],
  },
  {
    escalationId: 'ESC-2026-03',
    breakdownId: 'BD-2026-038',
    machineId: 'IMM-06',
    machineName: 'JSW 450T Heavy Mold',
    description: 'Hot runner gate pin sticking on cavity #2 causing short-shot defects.',
    priority: 'Critical',
    escalationLevel: 'Top-Level Management',
    assignedRole: 'Plant Head & Operations Leadership',
    startDate: '2026-11-18',
    startTime: '18 Nov 2026, 09:20 AM',
    escalationDateTime: '18 Nov 2026, 10:50 AM',
    downtimeMinutes: 105,
    recoveryEta: 'Completed',
    status: 'Resolved',
    rootCause: 'Carbonized resin buildup inside hot runner valve bushing #2.',
    resourceBottlenecks: 'Required crane hoist to unclamp hot half platen in press.',
    technician: 'Rohan Sharma',
    repairProgress: '100% Completed',
    remarks: 'Resolved after 1h 45m downtime; trial shots verified by QC.',
    resolutionDateTime: '18 Nov 2026, 11:05 AM',
    history: [
      {
        dateTime: '18 Nov 2026, 09:20 AM',
        event: 'Breakdown Reported',
        description: 'Cavity #2 gate pin seizure reported on IMM-06.',
        responsible: 'Line C Supervisor',
      },
      {
        dateTime: '18 Nov 2026, 09:22 AM',
        event: 'Mid-Level Management Notified',
        description: 'Shift Manager & Maintenance Manager assigned.',
        responsible: 'Shift Manager & Maintenance Manager',
      },
      {
        dateTime: '18 Nov 2026, 10:50 AM',
        event: 'Escalated to Top-Level Management',
        description: 'Downtime exceeded 90m threshold; escalated to Plant Head.',
        responsible: 'Plant Head & Operations Leadership',
      },
      {
        dateTime: '18 Nov 2026, 11:05 AM',
        event: 'Breakdown Resolved',
        description: 'Pin polished and reassembled; full production resumed.',
        responsible: 'Rohan Sharma',
      },
    ],
  },
  {
    escalationId: 'ESC-2026-04',
    breakdownId: 'BD-2026-039',
    machineId: 'IMM-02',
    machineName: 'Sumitomo 220T High-Speed',
    description: 'Ejector blow valve air regulator pressure fluctuation.',
    priority: 'Medium',
    escalationLevel: 'Mid-Level Management',
    assignedRole: 'Shift Manager & Maintenance Manager',
    startDate: '2026-11-19',
    startTime: '19 Nov 2026, 03:10 PM',
    escalationDateTime: '19 Nov 2026, 03:12 PM',
    downtimeMinutes: 75,
    recoveryEta: 'Completed',
    status: 'Resolved',
    rootCause: 'Damaged diaphragm seal in FRL pneumatic regulator unit.',
    resourceBottlenecks: 'None — spare FRL seal available in store.',
    technician: 'Amit Verma',
    repairProgress: '100% Completed',
    remarks: 'Resolved within Mid-Level SLA before critical duration.',
    resolutionDateTime: '19 Nov 2026, 04:25 PM',
    history: [
      {
        dateTime: '19 Nov 2026, 03:10 PM',
        event: 'Breakdown Reported',
        description: 'Low pneumatic pressure alarm on IMM-02.',
        responsible: 'Line A Operator',
      },
      {
        dateTime: '19 Nov 2026, 03:12 PM',
        event: 'Mid-Level Management Notified',
        description: 'Assigned to Shift Manager & Maintenance Manager.',
        responsible: 'Shift Manager & Maintenance Manager',
      },
      {
        dateTime: '19 Nov 2026, 04:25 PM',
        event: 'Breakdown Resolved',
        description: 'Replaced FRL seal and verified 6 Bar pressure.',
        responsible: 'Amit Verma',
      },
    ],
  },
];

function App() {
  const [breakdowns, setBreakdowns] = useState(initialBreakdowns);
  const [pmTasks, setPmTasks] = useState(initialPmTasks);
  const [spareParts, setSpareParts] = useState(initialSpareParts);
  const [stockLedger, setStockLedger] = useState(initialStockLedger);
  const [pmHistory, setPmHistory] = useState(initialPmHistory);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [escalations, setEscalations] = useState(initialEscalations);
  const [criticalDurationMins, setCriticalDurationMins] = useState(90);

  // Helper to add a notification without duplicate eventKeys
  const addUniqueNotification = (newNotif) => {
    setNotifications((prev) => {
      if (newNotif.eventKey && prev.some((n) => n.eventKey === newNotif.eventKey)) {
        return prev;
      }
      return [newNotif, ...prev];
    });
  };

  // Automatic Escalation Check whenever criticalDurationMins is adjusted
  useEffect(() => {
    const newlyEscalated = [];

    setEscalations((prev) =>
      prev.map((esc) => {
        if (
          esc.status !== 'Resolved' &&
          esc.escalationLevel === 'Mid-Level Management' &&
          esc.downtimeMinutes >= criticalDurationMins
        ) {
          newlyEscalated.push(esc);
          return {
            ...esc,
            escalationLevel: 'Top-Level Management',
            assignedRole: 'Plant Head & Operations Leadership',
            status: 'Escalated to Top Management',
            escalationDateTime: '20 Nov 2026, 05:15 PM',
            history: [
              ...esc.history,
              {
                dateTime: '20 Nov 2026, 05:15 PM',
                event: 'Escalated to Top-Level Management',
                description: `Downtime (${esc.downtimeMinutes}m) exceeded critical threshold (${criticalDurationMins}m). Auto-escalated to Plant Head & Operations Leadership.`,
                responsible: 'Plant Head & Operations Leadership',
              },
            ],
          };
        }
        return esc;
      })
    );

    newlyEscalated.forEach((esc) => {
      addUniqueNotification({
        notificationId: `NTF-2026-${110 + Math.floor(Math.random() * 890)}`,
        eventKey: `BD-TOP-${esc.breakdownId}`,
        title: `Breakdown Auto-Escalated to Top-Level Management (${esc.machineId})`,
        type: 'Machine Breakdown Alert',
        description: `Breakdown ${esc.breakdownId} on ${esc.machineId} (${esc.machineName}) exceeded the ${criticalDurationMins}m critical duration. Assigned to Plant Head & Operations Leadership.`,
        relatedEntity: `${esc.machineId} • ${esc.breakdownId}`,
        priority: 'Critical',
        dateTime: '2026-11-20 17:15',
        status: 'Unread',
        recommendedAction:
          'Top-Level Management to review resource bottlenecks and approve emergency recovery plan.',
      });
    });
  }, [criticalDurationMins]);

  // 1. Update Notification Status (Unread / Read / Resolved)
  const handleUpdateNotificationStatus = (notificationId, newStatus) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notificationId ? { ...n, status: newStatus } : n
      )
    );
  };

  // 2. When a New Breakdown is logged in BreakdownManagement:
  //    - Add to breakdowns list
  //    - Create initial Mid-Level Management Escalation record
  //    - Auto-generate Machine Breakdown Alert notification
  const handleAddBreakdown = (newBreakdown) => {
    const withMins = { ...newBreakdown, downtimeMinutes: 15 };
    setBreakdowns((prev) => [withMins, ...prev]);

    const newEscId = `ESC-2026-0${escalations.length + 1}`;
    const newEscalation = {
      escalationId: newEscId,
      breakdownId: newBreakdown.breakdownId,
      machineId: newBreakdown.machineId,
      machineName: newBreakdown.machineName,
      description: newBreakdown.rootCauseNotes,
      priority:
        newBreakdown.faultCategory === 'Hydraulic' ||
        newBreakdown.faultCategory === 'Electrical'
          ? 'Critical'
          : 'High',
      escalationLevel: 'Mid-Level Management',
      assignedRole: 'Shift Manager & Maintenance Manager',
      startDate: '2026-11-20',
      startTime: newBreakdown.startTime,
      escalationDateTime: newBreakdown.startTime,
      downtimeMinutes: 15,
      recoveryEta: 'Today, +1h 30m',
      status: 'In Progress',
      rootCause: newBreakdown.rootCauseNotes,
      resourceBottlenecks: 'Initial diagnostic check underway by maintenance team.',
      technician: newBreakdown.technician,
      repairProgress: '25% — Technician assigned & inspecting fault',
      remarks: 'Assigned to Mid-Level Management (Shift Manager & Maintenance Manager).',
      resolutionDateTime: null,
      history: [
        {
          dateTime: newBreakdown.startTime,
          event: 'Breakdown Reported',
          description: `${newBreakdown.faultCategory} fault reported on ${newBreakdown.machineId}.`,
          responsible: 'Machine Operator',
        },
        {
          dateTime: newBreakdown.startTime,
          event: 'Maintenance Engineer Notified',
          description: `Alert sent to ${newBreakdown.technician}.`,
          responsible: 'Maintenance 4.0 System',
        },
        {
          dateTime: newBreakdown.startTime,
          event: 'Mid-Level Management Notified',
          description: 'Escalation opened for Shift Manager & Maintenance Manager.',
          responsible: 'Shift Manager & Maintenance Manager',
        },
      ],
    };

    setEscalations((prev) => [newEscalation, ...prev]);

    addUniqueNotification({
      notificationId: `NTF-2026-${109 + notifications.length}`,
      eventKey: `BD-MID-${newBreakdown.breakdownId}`,
      title: `Machine Breakdown Reported on ${newBreakdown.machineId} (${newBreakdown.faultCategory})`,
      type: 'Machine Breakdown Alert',
      description: `${newBreakdown.machineId} (${newBreakdown.machineName}) reported ${newBreakdown.faultCategory} fault (${newBreakdown.breakdownId}). Mid-Level Management & ${newBreakdown.technician} notified.`,
      relatedEntity: `${newBreakdown.machineId} • ${newBreakdown.breakdownId}`,
      priority: 'Critical',
      dateTime: '2026-11-20 17:10',
      status: 'Unread',
      recommendedAction: `Coordinate with ${newBreakdown.technician} and Shift Manager to restore machine before ${criticalDurationMins}m critical threshold.`,
    });
  };

  // 3. Manually / Demo Escalate an active Mid-Level breakdown to Top-Level Management
  const handleEscalateToTop = (escalationId) => {
    const target = escalations.find((e) => e.escalationId === escalationId);
    if (!target || target.status === 'Resolved') return;

    const newDowntime = Math.max(target.downtimeMinutes, criticalDurationMins + 15);

    setEscalations((prev) =>
      prev.map((esc) => {
        if (esc.escalationId !== escalationId) return esc;
        return {
          ...esc,
          downtimeMinutes: newDowntime,
          escalationLevel: 'Top-Level Management',
          assignedRole: 'Plant Head & Operations Leadership',
          status: 'Escalated to Top Management',
          escalationDateTime: '20 Nov 2026, 05:20 PM',
          history: [
            ...esc.history,
            {
              dateTime: '20 Nov 2026, 05:20 PM',
              event: 'Escalated to Top-Level Management',
              description: `Critical duration (${criticalDurationMins}m) exceeded. Breakdown escalated to Plant Head & Operations Leadership.`,
              responsible: 'Plant Head & Operations Leadership',
            },
          ],
        };
      })
    );

    addUniqueNotification({
      notificationId: `NTF-2026-${109 + notifications.length}`,
      eventKey: `BD-TOP-${target.breakdownId}`,
      title: `Critical Breakdown Escalated to Top-Level Management (${target.machineId})`,
      type: 'Machine Breakdown Alert',
      description: `Breakdown ${target.breakdownId} on ${target.machineId} (${target.machineName}) exceeded ${criticalDurationMins}m critical duration and has been escalated to Plant Head & Operations Leadership.`,
      relatedEntity: `${target.machineId} • ${target.breakdownId}`,
      priority: 'Critical',
      dateTime: '2026-11-20 17:20',
      status: 'Unread',
      recommendedAction:
        'Plant Head & Operations Leadership to review root cause, resource bottlenecks, and recovery ETA.',
    });
  };

  // 4. Update Escalation Recovery Info
  const handleUpdateEscalation = (escalationId, updatedFields) => {
    if (updatedFields.status === 'Resolved') {
      handleResolveEscalation(escalationId);
      return;
    }

    setEscalations((prev) =>
      prev.map((esc) => {
        if (esc.escalationId !== escalationId) return esc;
        return {
          ...esc,
          ...updatedFields,
          history: [
            ...esc.history,
            {
              dateTime: '20 Nov 2026, 05:25 PM',
              event: 'Recovery Information Updated',
              description: `Status: ${updatedFields.status} • Progress: ${updatedFields.repairProgress} • ETA: ${updatedFields.recoveryEta}`,
              responsible: esc.assignedRole,
            },
          ],
        };
      })
    );
  };

  // 5. Resolve Escalation (Synchronizes Breakdowns, Escalations, and Notifications)
  const handleResolveEscalation = (escalationId) => {
    const target = escalations.find((e) => e.escalationId === escalationId);
    if (!target) return;

    setEscalations((prev) =>
      prev.map((esc) => {
        if (esc.escalationId !== escalationId) return esc;
        return {
          ...esc,
          status: 'Resolved',
          recoveryEta: 'Completed',
          repairProgress: '100% Completed',
          resolutionDateTime: '20 Nov 2026, 05:30 PM',
          history: [
            ...esc.history,
            {
              dateTime: '20 Nov 2026, 05:30 PM',
              event: 'Breakdown Resolved',
              description: 'Machine repaired, tested, and handed back to production.',
              responsible: esc.technician,
            },
          ],
        };
      })
    );

    // Sync BreakdownManagement record
    setBreakdowns((prev) =>
      prev.map((b) =>
        b.breakdownId === target.breakdownId ? { ...b, status: 'Resolved' } : b
      )
    );

    // Sync related notifications to Resolved
    setNotifications((prev) =>
      prev.map((n) =>
        n.relatedEntity.includes(target.breakdownId)
          ? { ...n, status: 'Resolved' }
          : n
      )
    );
  };

  // Toggle breakdown status from BreakdownManagement page & sync with Escalations
  const handleToggleBreakdownStatus = (breakdownId) => {
    const target = breakdowns.find((b) => b.breakdownId === breakdownId);
    if (!target) return;
    const nextStatus = target.status === 'Active' ? 'Resolved' : 'Active';

    setBreakdowns((prev) =>
      prev.map((b) =>
        b.breakdownId === breakdownId ? { ...b, status: nextStatus } : b
      )
    );

    if (nextStatus === 'Resolved') {
      const linkedEsc = escalations.find((e) => e.breakdownId === breakdownId);
      if (linkedEsc) {
        handleResolveEscalation(linkedEsc.escalationId);
      }
    }
  };

  // Add or Edit a Spare Part from SparePartsInventory page & auto-generate Low Stock / Reorder notifications
  const handleSaveSparePart = (partData, isEditMode) => {
    const nowStr = '2026-11-20 17:00';

    if (isEditMode) {
      const existing = spareParts.find((p) => p.partCode === partData.partCode);
      const diff =
        Number(partData.availableStock) - Number(existing?.availableStock || 0);

      setSpareParts((prev) =>
        prev.map((p) =>
          p.partCode === partData.partCode ? { ...p, ...partData } : p
        )
      );

      if (diff !== 0) {
        const newTx = {
          transactionId: `TXN-2026-${905 + stockLedger.length}`,
          partCode: partData.partCode,
          description: partData.description,
          transactionType: diff > 0 ? 'Stock Added' : 'Stock Deducted',
          quantity: Math.abs(diff),
          reference: 'Manual Inventory Adjustment',
          dateTime: nowStr,
        };
        setStockLedger((prev) => [newTx, ...prev]);
      }
    } else {
      setSpareParts((prev) => [partData, ...prev]);
      if (Number(partData.availableStock) > 0) {
        const newTx = {
          transactionId: `TXN-2026-${905 + stockLedger.length}`,
          partCode: partData.partCode,
          description: partData.description,
          transactionType: 'Stock Added',
          quantity: Number(partData.availableStock),
          reference: 'Initial SKU Registration',
          dateTime: nowStr,
        };
        setStockLedger((prev) => [newTx, ...prev]);
      }
    }

    // Auto-generate Low Stock or Reorder notification if stock < threshold
    if (Number(partData.availableStock) <= 0) {
      addUniqueNotification({
        notificationId: `NTF-2026-${109 + notifications.length}`,
        eventKey: `REORDER-${partData.partCode}`,
        title: `Spare Part Out of Stock — Reorder Alert (${partData.partCode})`,
        type: 'Spare Part Reorder Alert',
        description: `${partData.description} (${partData.partCode}) stock is at 0 ${partData.unit || 'pcs'} (Min reorder threshold: ${partData.minThreshold}).`,
        relatedEntity: `${partData.partCode} (${partData.binLocation})`,
        priority: 'Critical',
        dateTime: nowStr,
        status: 'Unread',
        recommendedAction: `Raise urgent purchase requisition for ${partData.partCode}.`,
      });
    } else if (Number(partData.availableStock) < Number(partData.minThreshold)) {
      addUniqueNotification({
        notificationId: `NTF-2026-${109 + notifications.length}`,
        eventKey: `LOW-STOCK-${partData.partCode}`,
        title: `Low Spare Parts Stock Alert (${partData.partCode})`,
        type: 'Low Stock Alert',
        description: `${partData.description} (${partData.partCode}) available quantity is ${partData.availableStock} (Below minimum reorder threshold of ${partData.minThreshold}).`,
        relatedEntity: `${partData.partCode} (${partData.binLocation})`,
        priority: 'High',
        dateTime: nowStr,
        status: 'Unread',
        recommendedAction: `Replenish ${partData.partCode} in ${partData.binLocation}.`,
      });
    }
  };

  // Handle PM Checklist submission:
  // 1. Update PM task status to Completed
  // 2. Automatically decrease spare part quantities & record in Stock Ledger
  // 3. Auto-generate Low Stock / Reorder notifications if remaining stock < threshold
  // 4. Save completed record into PM History state
  const handleChecklistSubmit = (submittedData) => {
    setPmTasks((prev) =>
      prev.map((task) =>
        task.pmId === submittedData.pmId ? { ...task, status: 'Completed' } : task
      )
    );

    if (submittedData.sparePartsUsed && submittedData.sparePartsUsed.length > 0) {
      const ledgerEntries = [];
      const lowStockGenerated = [];

      setSpareParts((prevParts) =>
        prevParts.map((part) => {
          const matchingUses = submittedData.sparePartsUsed.filter(
            (u) => u.partCode === part.partCode
          );
          if (matchingUses.length === 0) return part;

          const totalUsed = matchingUses.reduce(
            (sum, u) => sum + Number(u.quantityUsed || 0),
            0
          );
          const actualDeducted = Math.min(part.availableStock, totalUsed);
          const newStock = Math.max(0, part.availableStock - totalUsed);

          if (actualDeducted > 0) {
            ledgerEntries.push({
              transactionId: `TXN-2026-${905 + stockLedger.length + ledgerEntries.length}`,
              partCode: part.partCode,
              description: part.description,
              transactionType: 'Stock Deducted',
              quantity: actualDeducted,
              reference: `${submittedData.pmId} (${submittedData.machineId})`,
              dateTime: submittedData.completionDate,
            });
          }

          if (newStock < part.minThreshold) {
            lowStockGenerated.push({ ...part, availableStock: newStock });
          }

          return {
            ...part,
            availableStock: newStock,
          };
        })
      );

      if (ledgerEntries.length > 0) {
        setStockLedger((prev) => [...ledgerEntries, ...prev]);
      }

      lowStockGenerated.forEach((p) => {
        addUniqueNotification({
          notificationId: `NTF-2026-${115 + Math.floor(Math.random() * 800)}`,
          eventKey:
            p.availableStock === 0
              ? `REORDER-${p.partCode}`
              : `LOW-STOCK-${p.partCode}`,
          title:
            p.availableStock === 0
              ? `Spare Part Depleted During PM (${p.partCode})`
              : `Low Spare Parts Stock After PM (${p.partCode})`,
          type:
            p.availableStock === 0
              ? 'Spare Part Reorder Alert'
              : 'Low Stock Alert',
          description: `${p.description} (${p.partCode}) remaining stock is ${p.availableStock} ${p.unit} after ${submittedData.pmId} (Minimum threshold: ${p.minThreshold} ${p.unit}).`,
          relatedEntity: `${p.partCode} (${p.binLocation})`,
          priority: p.availableStock === 0 ? 'Critical' : 'High',
          dateTime: submittedData.completionDate,
          status: 'Unread',
          recommendedAction: `Initiate purchase reorder for ${p.partCode} (${p.description}).`,
        });
      });
    }

    // Resolve any PM Due / Overdue notification tied to this PM ID
    setNotifications((prev) =>
      prev.map((n) =>
        n.relatedEntity.includes(submittedData.pmId)
          ? { ...n, status: 'Resolved' }
          : n
      )
    );

    const failedCount = submittedData.checklistItems.filter(
      (i) => i.result === 'Fail'
    ).length;
    const inspectionResult =
      failedCount === 0 ? 'All Passed' : `${failedCount} Failed`;
    const completionDay = submittedData.completionDate.slice(0, 10);
    const isDelayed = completionDay > submittedData.scheduledDate;

    const newHistoryEntry = {
      pmId: submittedData.pmId,
      machineId: submittedData.machineId,
      machineName: submittedData.machineName,
      line: submittedData.line,
      pmType: submittedData.pmType,
      scheduledDate: submittedData.scheduledDate,
      completionDate: submittedData.completionDate,
      technician: submittedData.technician,
      inspectionResult,
      status: isDelayed ? 'Delayed' : 'Completed On Time',
      finalRemarks: submittedData.finalRemarks,
      evidencePhoto: `IMG_${submittedData.machineId}_PM_VERIFIED.JPG`,
      checklistItems: submittedData.checklistItems,
      sparePartsUsed: submittedData.sparePartsUsed,
    };

    setPmHistory((prev) => [
      newHistoryEntry,
      ...prev.filter((r) => r.pmId !== submittedData.pmId),
    ]);
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Common Dashboard Layout wrapping all Sidebar Navigation Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/machines" element={<MachineStatus />} />
          <Route
            path="/breakdowns"
            element={
              <BreakdownManagement
                breakdowns={breakdowns}
                onAddBreakdown={handleAddBreakdown}
                onToggleBreakdownStatus={handleToggleBreakdownStatus}
              />
            }
          />
          <Route path="/machines/details" element={<MachineDetails />} />
          <Route path="/production" element={<ProductionMonitoring />} />
          <Route
            path="/pm/calendar"
            element={<PMCalendar pmTasks={pmTasks} />}
          />
          <Route
            path="/pm/checklist"
            element={
              <PMChecklist
                pmTasks={pmTasks}
                spareParts={spareParts}
                onSubmitChecklist={handleChecklistSubmit}
              />
            }
          />
          <Route
            path="/pm/history"
            element={<PMHistory pmHistory={pmHistory} />}
          />
          <Route
            path="/inventory/spare-parts"
            element={
              <SparePartsInventory
                spareParts={spareParts}
                stockLedger={stockLedger}
                onSaveSparePart={handleSaveSparePart}
              />
            }
          />
          <Route path="/inventory/tools" element={<ToolManagement />} />
          <Route
            path="/notifications"
            element={
              <NotificationsAlerts
                notifications={notifications}
                onUpdateNotificationStatus={handleUpdateNotificationStatus}
              />
            }
          />
          <Route
            path="/escalations"
            element={
              <EscalationManagement
                escalations={escalations}
                criticalDurationMins={criticalDurationMins}
                onChangeCriticalDuration={setCriticalDurationMins}
                onEscalateToTop={handleEscalateToTop}
                onUpdateEscalation={handleUpdateEscalation}
                onResolveEscalation={handleResolveEscalation}
              />
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<></>} />
      </Routes>
    </Router>
  );
}

export default App;
