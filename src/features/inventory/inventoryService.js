import { loadFromStorage, saveToStorage } from '../../utils/storage';

export const SPARE_PARTS_STORAGE_KEY = 'sanko_gosei_spare_parts_v1';

export const initialSpareParts = [
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

export const initialStockLedger = [
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

// Future backend integration: replace localStorage operations with API calls
export const inventoryService = {
  getSpareParts() {
    return loadFromStorage(SPARE_PARTS_STORAGE_KEY, initialSpareParts);
  },

  saveSpareParts(parts) {
    saveToStorage(SPARE_PARTS_STORAGE_KEY, parts);
  },

  getStockLedger() {
    return initialStockLedger;
  },
};
