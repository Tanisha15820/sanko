import { createContext, useContext, useState, useEffect } from 'react';
import { inventoryService } from '../features/inventory/inventoryService';

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const [spareParts, setSpareParts] = useState(() => inventoryService.getSpareParts());
  const [stockLedger, setStockLedger] = useState(() => inventoryService.getStockLedger());

  useEffect(() => {
    inventoryService.saveSpareParts(spareParts);
  }, [spareParts]);

  // Add or edit a spare part and update the stock ledger
  const saveSparePart = (partData, isEditMode) => {
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
  };

  // Deduct spare parts used during a PM checklist submission and log ledger
  const deductSparePartsForPm = ({
    pmId,
    machineId,
    completionDate,
    sparePartsUsed = [],
  }) => {
    if (!sparePartsUsed || sparePartsUsed.length === 0) return;

    const ledgerEntries = [];

    const updatedParts = spareParts.map((part) => {
      const matchingUses = sparePartsUsed.filter((u) => u.partCode === part.partCode);
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
          reference: `${pmId} (${machineId})`,
          dateTime: completionDate,
        });
      }

      return { ...part, availableStock: newStock };
    });

    setSpareParts(updatedParts);

    if (ledgerEntries.length > 0) {
      setStockLedger((prev) => [...ledgerEntries, ...prev]);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        spareParts,
        stockLedger,
        saveSparePart,
        deductSparePartsForPm,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
