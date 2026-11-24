import { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Edit3,
  Eye,
  RotateCcw,
  MapPin,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput from '../../components/common/SearchInput';
import TablePagination from '../../components/common/TablePagination';
import { usePagination } from '../../hooks/usePagination';
import {
  PART_CATEGORIES,
  UNIT_OPTIONS,
  MACHINE_OPTIONS,
  STOCK_OUT_PURPOSES,
  STAFF_OPTIONS,
  getStockStatus,
  initialSpareParts,
  initialStockTransactions,
} from './inventoryData';

const TODAY_DATE = '2026-11-24';

const SparePartsInventory = () => {
  const { activeRole, user, hasPermission } = useAuth();
  const [spareParts, setSpareParts] = useState(initialSpareParts);
  const [transactions, setTransactions] = useState(initialStockTransactions);

  // Active tab: 'parts' (Spare Parts List) | 'history' (Stock History)
  const [activeTab, setActiveTab] = useState('parts');

  // Spare parts filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Transaction history filters
  const [txnSearch, setTxnSearch] = useState('');
  const [txnTypeFilter, setTxnTypeFilter] = useState('All Types');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [partFormError, setPartFormError] = useState('');
  const [selectedPartDetails, setSelectedPartDetails] = useState(null);

  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);
  const [stockOutStep, setStockOutStep] = useState('form'); // 'form' | 'confirm'
  const [stockOutError, setStockOutError] = useState('');

  // Add / Edit spare part form
  const [partForm, setPartForm] = useState({
    partId: '',
    partName: '',
    partCategory: PART_CATEGORIES[0],
    partNumber: '',
    availableStock: 10,
    minStockLevel: 5,
    unit: 'pcs',
    storageLocation: 'Rack A-01',
    supplier: '',
  });

  // Stock In form
  const [stockInForm, setStockInForm] = useState({
    partId: initialSpareParts[0].partId,
    quantity: 5,
    supplier: initialSpareParts[0].supplier,
    receivedDate: TODAY_DATE,
    remarks: '',
  });

  // Stock Out form
  const [stockOutForm, setStockOutForm] = useState({
    partId: initialSpareParts[0].partId,
    quantity: 1,
    machine: MACHINE_OPTIONS[0],
    purpose: STOCK_OUT_PURPOSES[0],
    issuedTo: STAFF_OPTIONS[0],
    issueDate: TODAY_DATE,
    remarks: '',
  });

  const currentUserName = user?.name || 'Rajesh Kumar';
  const currentTechnicianLabel = `${currentUserName} (Technician)`;
  const isTechnician = activeRole === 'Technician';

  // Permissions driven by global roleService.js via useAuth()
  const canAddPart = hasPermission('inventory.add_spare_parts');
  const canEditPart = hasPermission('inventory.edit_spare_parts');
  const canStockIn =
    hasPermission('inventory.add_spare_parts') &&
    hasPermission('inventory.update_stock');
  const canStockOut = hasPermission('inventory.update_stock');

  // Derive status for every spare part
  const partsWithStatus = spareParts.map((part) => ({
    ...part,
    stockStatus: getStockStatus(part.availableStock, part.minStockLevel),
  }));

  // Alert items (Low Stock / Out of Stock)
  const alertParts = partsWithStatus.filter(
    (p) => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock'
  );

  // Filtered spare parts
  const filteredParts = partsWithStatus.filter((part) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      part.partId.toLowerCase().includes(q) ||
      part.partName.toLowerCase().includes(q) ||
      part.partNumber.toLowerCase().includes(q) ||
      part.storageLocation.toLowerCase().includes(q) ||
      part.supplier.toLowerCase().includes(q);
    const matchesCategory =
      categoryFilter === 'All Categories' || part.partCategory === categoryFilter;
    const matchesStatus =
      statusFilter === 'All Status' ||
      (statusFilter === 'Low & Out of Stock'
        ? part.stockStatus === 'Low Stock' || part.stockStatus === 'Out of Stock'
        : part.stockStatus === statusFilter);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Role-scoped & filtered transactions
  const visibleTransactions = transactions.filter((txn) => {
    if (isTechnician) {
      const ownRecord =
        txn.party.includes(currentUserName) ||
        txn.updatedBy === currentUserName;
      if (!ownRecord) return false;
    }
    const q = txnSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      txn.transactionId.toLowerCase().includes(q) ||
      txn.partName.toLowerCase().includes(q) ||
      txn.party.toLowerCase().includes(q) ||
      txn.machine.toLowerCase().includes(q);
    const matchesType =
      txnTypeFilter === 'All Types' || txn.transactionType === txnTypeFilter;

    return matchesSearch && matchesType;
  });

  const partsPagination = usePagination(
    filteredParts,
    10,
    `${activeRole}|${searchQuery}|${categoryFilter}|${statusFilter}`
  );

  const txnPagination = usePagination(
    visibleTransactions,
    10,
    `${activeRole}|${txnSearch}|${txnTypeFilter}`
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All Categories');
    setStatusFilter('All Status');
  };

  // Open Add Part Modal
  const handleOpenAddModal = () => {
    if (!canAddPart) return;
    setIsEditMode(false);
    setPartFormError('');
    setPartForm({
      partId: `SP-${101 + spareParts.length}`,
      partName: '',
      partCategory: PART_CATEGORIES[0],
      partNumber: '',
      availableStock: 10,
      minStockLevel: 5,
      unit: 'pcs',
      storageLocation: 'Rack A-02',
      supplier: '',
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Part Modal
  const handleOpenEditModal = (part) => {
    if (!canEditPart) return;
    setIsEditMode(true);
    setPartFormError('');
    setPartForm({
      partId: part.partId,
      partName: part.partName,
      partCategory: part.partCategory,
      partNumber: part.partNumber,
      availableStock: part.availableStock,
      minStockLevel: part.minStockLevel,
      unit: part.unit,
      storageLocation: part.storageLocation,
      supplier: part.supplier,
    });
    setIsFormModalOpen(true);
  };

  // Submit Add / Edit Part (with Duplicate Part ID validation)
  const handlePartSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && !canEditPart) return;
    if (!isEditMode && !canAddPart) return;
    const normalized = {
      ...partForm,
      partId: partForm.partId.trim(),
      partName: partForm.partName.trim(),
      partNumber: partForm.partNumber.trim(),
      storageLocation: partForm.storageLocation.trim(),
      supplier: partForm.supplier.trim(),
      availableStock: Math.max(0, Number(partForm.availableStock) || 0),
      minStockLevel: Math.max(1, Number(partForm.minStockLevel) || 1),
      lastUpdated: TODAY_DATE,
    };

    if (!isEditMode) {
      const duplicateExists = spareParts.some(
        (p) => p.partId.toLowerCase() === normalized.partId.toLowerCase()
      );
      if (duplicateExists) {
        setPartFormError(
          `Part ID "${normalized.partId}" already exists. Please enter a unique Part ID.`
        );
        return;
      }
    }

    setPartFormError('');

    if (isEditMode) {
      setSpareParts((prev) =>
        prev.map((p) => (p.partId === normalized.partId ? normalized : p))
      );
    } else {
      setSpareParts((prev) => [normalized, ...prev]);
      if (normalized.availableStock > 0) {
        const newTxn = {
          transactionId: `TXN-2026-${901 + transactions.length}`,
          partId: normalized.partId,
          partName: normalized.partName,
          transactionType: 'Stock In',
          quantity: normalized.availableStock,
          previousStock: 0,
          updatedStock: normalized.availableStock,
          machine: '—',
          party: normalized.supplier,
          purpose: 'Initial Stock Entry',
          transactionDate: TODAY_DATE,
          updatedBy: currentUserName,
          remarks: 'New spare part added to inventory catalog.',
        };
        setTransactions((prev) => [newTxn, ...prev]);
      }
    }

    setIsFormModalOpen(false);
  };

  // Open Stock In Modal
  const handleOpenStockIn = (preselectedPart = null) => {
    if (!canStockIn) return;
    const target = preselectedPart || spareParts[0];
    setStockInForm({
      partId: target.partId,
      quantity: 5,
      supplier: target.supplier,
      receivedDate: TODAY_DATE,
      remarks: '',
    });
    setIsStockInOpen(true);
  };

  // Submit Stock In
  const handleStockInSubmit = (e) => {
    e.preventDefault();
    if (!canStockIn) return;
    const qty = Number(stockInForm.quantity);
    if (!qty || qty <= 0) return;

    const targetPart = spareParts.find((p) => p.partId === stockInForm.partId);
    if (!targetPart) return;

    const previousStock = targetPart.availableStock;
    const updatedStock = previousStock + qty;

    setSpareParts((prev) =>
      prev.map((p) =>
        p.partId === targetPart.partId
          ? {
              ...p,
              availableStock: updatedStock,
              supplier: stockInForm.supplier.trim() || p.supplier,
              lastUpdated: stockInForm.receivedDate || TODAY_DATE,
            }
          : p
      )
    );

    const newTxn = {
      transactionId: `TXN-2026-${901 + transactions.length}`,
      partId: targetPart.partId,
      partName: targetPart.partName,
      transactionType: 'Stock In',
      quantity: qty,
      previousStock,
      updatedStock,
      machine: '—',
      party: stockInForm.supplier.trim() || targetPart.supplier,
      purpose: 'Stock Replenishment',
      transactionDate: stockInForm.receivedDate || TODAY_DATE,
      updatedBy: currentUserName,
      remarks: stockInForm.remarks.trim() || 'Stock received into maintenance store.',
    };
    setTransactions((prev) => [newTxn, ...prev]);
    setIsStockInOpen(false);
  };

  // Open Stock Out Modal
  const handleOpenStockOut = (preselectedPart = null) => {
    if (!canStockOut) return;
    const fallbackPart =
      spareParts.find((p) => p.availableStock > 0) || spareParts[0];
    const target = preselectedPart || fallbackPart;
    setStockOutForm({
      partId: target.partId,
      quantity: 1,
      machine: MACHINE_OPTIONS[0],
      purpose: STOCK_OUT_PURPOSES[0],
      issuedTo: isTechnician ? currentTechnicianLabel : STAFF_OPTIONS[0],
      issueDate: TODAY_DATE,
      remarks: '',
    });
    setStockOutError('');
    setStockOutStep('form');
    setIsStockOutOpen(true);
  };

  // Validate Stock Out and move to confirmation step
  const handleStockOutProceed = (e) => {
    e.preventDefault();
    if (!canStockOut) return;
    const targetPart = spareParts.find((p) => p.partId === stockOutForm.partId);
    const qty = Number(stockOutForm.quantity);

    if (!targetPart) {
      setStockOutError('Please select a valid spare part.');
      return;
    }
    if (!qty || qty <= 0) {
      setStockOutError('Issued quantity must be greater than 0.');
      return;
    }
    if (qty > targetPart.availableStock) {
      setStockOutError(
        `Cannot issue ${qty} ${targetPart.unit}. Only ${targetPart.availableStock} ${targetPart.unit} available in stock.`
      );
      return;
    }

    setStockOutError('');
    setStockOutStep('confirm');
  };

  // Finalize Stock Out after confirmation
  const handleConfirmStockOut = () => {
    if (!canStockOut) return;
    const targetPart = spareParts.find((p) => p.partId === stockOutForm.partId);
    const qty = Number(stockOutForm.quantity);
    if (!targetPart || qty <= 0 || qty > targetPart.availableStock) return;

    const previousStock = targetPart.availableStock;
    const updatedStock = previousStock - qty;

    setSpareParts((prev) =>
      prev.map((p) =>
        p.partId === targetPart.partId
          ? {
              ...p,
              availableStock: updatedStock,
              lastUpdated: stockOutForm.issueDate || TODAY_DATE,
            }
          : p
      )
    );

    const issuedToParty = isTechnician
      ? currentTechnicianLabel
      : stockOutForm.issuedTo;

    const newTxn = {
      transactionId: `TXN-2026-${901 + transactions.length}`,
      partId: targetPart.partId,
      partName: targetPart.partName,
      transactionType: 'Stock Out',
      quantity: qty,
      previousStock,
      updatedStock,
      machine: stockOutForm.machine,
      party: issuedToParty,
      purpose: stockOutForm.purpose,
      transactionDate: stockOutForm.issueDate || TODAY_DATE,
      updatedBy: currentUserName,
      remarks:
        stockOutForm.remarks.trim() ||
        `Issued for ${stockOutForm.purpose} on ${stockOutForm.machine}.`,
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setIsStockOutOpen(false);
    setStockOutStep('form');
  };

  const selectedStockInPart = spareParts.find((p) => p.partId === stockInForm.partId);
  const selectedStockOutPart = spareParts.find((p) => p.partId === stockOutForm.partId);

  return (
    <div className="space-y-5">
      {/* Low Stock & Out of Stock Warning Banner */}
          {alertParts.length > 0 && (
            <section className="bg-[#fff4e5] border border-[#fed7aa] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#9a3412]">
                    Low Stock Warning ({alertParts.length} Part
                    {alertParts.length > 1 ? 's' : ''} At or Below Minimum Stock Level)
                  </h4>
                  <p className="text-xs text-[#c2410c] mt-1 leading-relaxed">
                    {alertParts
                      .map(
                        (p) =>
                          `${p.partId} ${p.partName} (${p.availableStock}/${p.minStockLevel} ${p.unit} — ${p.stockStatus})`
                      )
                      .join(' • ')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('parts');
                  setStatusFilter('Low & Out of Stock');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shrink-0 cursor-pointer self-start sm:self-center"
              >
                Show Low Stock Items
              </button>
            </section>
          )}

      {/* Tab Switcher: Spare Parts List | Stock History */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center bg-white border border-[#edf1f7] p-1 rounded-2xl shadow-[0_2px_10px_rgba(15,23,42,0.03)] gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('parts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'parts'
                ? 'bg-[#0b57d0] text-white shadow-[0_4px_12px_rgba(11,87,208,0.22)]'
                : 'text-[#475569] hover:text-[#0b57d0] hover:bg-[#f3f6fb]'
            }`}
          >
            <span>Spare Parts List</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                activeTab === 'parts'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#eef4ff] text-[#0b57d0]'
              }`}
            >
              {partsWithStatus.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#0b57d0] text-white shadow-[0_4px_12px_rgba(11,87,208,0.22)]'
                : 'text-[#475569] hover:text-[#0b57d0] hover:bg-[#f3f6fb]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Stock History</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                activeTab === 'history'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#eef4ff] text-[#0b57d0]'
              }`}
            >
              {visibleTransactions.length}
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canStockIn && (
            <button
              type="button"
              onClick={() => handleOpenStockIn()}
              className="h-10 px-4 rounded-xl bg-[#e8f8ef] hover:bg-[#15803d] text-[#15803d] hover:text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Stock In</span>
            </button>
          )}

          {canStockOut && (
            <button
              type="button"
              onClick={() => handleOpenStockOut()}
              className="h-10 px-4 rounded-xl bg-[#fff4e5] hover:bg-[#c2410c] text-[#c2410c] hover:text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowUpFromLine className="w-4 h-4" />
              <span>{isTechnician ? 'Record Stock Usage' : 'Stock Out'}</span>
            </button>
          )}

          {canAddPart && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="h-10 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Spare Part</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: SPARE PARTS LIST */}
      {activeTab === 'parts' ? (
        <>
          {/* Search & Filters */}
          <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                    Search Spare Part
                  </label>
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="ID, name, part no, location..."
                    variant="bordered"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                    Part Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                  >
                    <option value="All Categories">All Categories</option>
                    {PART_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                    Stock Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                  >
                    {[
                      'All Status',
                      'In Stock',
                      'Low Stock',
                      'Out of Stock',
                      'Low & Out of Stock',
                    ].map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </section>

          {/* Simplified 8-Column Spare Parts List Table */}
          <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#0f172a]">
                  Spare Parts List
                </h3>
                <p className="text-xs font-medium text-[#64748b] mt-0.5">
                  Current stock levels, reorder thresholds, and storage locations
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold self-start sm:self-auto">
                {filteredParts.length} Parts Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Part ID</th>
                    <th className="py-3.5 px-4">Part Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Available Stock</th>
                    <th className="py-3.5 px-4">Min Stock</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                  {partsPagination.paginatedItems.map((part) => (
                    <tr
                      key={part.partId}
                      className="hover:bg-[#f8fafc]/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#0b57d0] whitespace-nowrap">
                        {part.partId}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-[#0f172a] block">
                          {part.partName}
                        </span>
                        <span className="font-mono text-[11px] text-[#64748b]">
                          {part.partNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                          {part.partCategory}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0f172a] whitespace-nowrap">
                        {part.availableStock} {part.unit}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#64748b] whitespace-nowrap">
                        {part.minStockLevel} {part.unit}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                          <MapPin className="w-3 h-3 text-[#0b57d0]" />
                          {part.storageLocation}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={part.stockStatus} showDot />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedPartDetails(part)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155] text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        {canEditPart && (
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(part)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}
                        {canStockIn && (
                          <button
                            type="button"
                            onClick={() => handleOpenStockIn(part)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#e8f8ef] hover:bg-[#15803d] text-[#15803d] hover:text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            <ArrowDownToLine className="w-3.5 h-3.5" />
                            <span>Stock In</span>
                          </button>
                        )}
                        {canStockOut && part.availableStock > 0 && (
                          <button
                            type="button"
                            onClick={() => handleOpenStockOut(part)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#fff4e5] hover:bg-[#c2410c] text-[#c2410c] hover:text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            <ArrowUpFromLine className="w-3.5 h-3.5" />
                            <span>Stock Out</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredParts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-sm text-[#64748b]">
                        No spare parts match your current search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={partsPagination.currentPage}
              totalPages={partsPagination.totalPages}
              totalItems={partsPagination.totalItems}
              startItem={partsPagination.startItem}
              endItem={partsPagination.endItem}
              onPageChange={partsPagination.setCurrentPage}
            />
          </section>
        </>
      ) : (
        /* TAB 2: STOCK HISTORY */
        <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#f1f5f9] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <History className="w-5 h-5 text-[#0b57d0] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-extrabold text-[#0f172a]">
                    Inventory Transaction History
                  </h3>
                  <p className="text-xs font-medium text-[#64748b] mt-0.5">
                    {isTechnician
                      ? `Showing your own Stock In / Stock Out records (${currentUserName})`
                      : 'Complete immutable ledger of all Stock In and Stock Out transactions'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="w-full sm:w-60">
                  <SearchInput
                    value={txnSearch}
                    onChange={setTxnSearch}
                    placeholder="Search txn ID, part, machine..."
                    variant="bordered"
                  />
                </div>
                <select
                  value={txnTypeFilter}
                  onChange={(e) => setTxnTypeFilter(e.target.value)}
                  className="h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  <option value="All Types">All Types</option>
                  <option value="Stock In">Stock In</option>
                  <option value="Stock Out">Stock Out</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Part Name</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Quantity</th>
                    <th className="py-3.5 px-4">Previous Stock</th>
                    <th className="py-3.5 px-4">Updated Stock</th>
                    <th className="py-3.5 px-4">Machine</th>
                    <th className="py-3.5 px-4">Issued To / Received From</th>
                    <th className="py-3.5 px-4">Purpose</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Updated By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                  {txnPagination.paginatedItems.map((txn) => (
                    <tr
                      key={txn.transactionId}
                      className="hover:bg-[#f8fafc]/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#0b57d0] whitespace-nowrap">
                        {txn.transactionId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#0f172a] whitespace-nowrap">
                        {txn.partName}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge
                          status={txn.transactionType}
                          variant={txn.transactionType === 'Stock In' ? 'green' : 'orange'}
                          showDot
                        />
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0f172a] whitespace-nowrap">
                        {txn.transactionType === 'Stock In' ? '+' : '-'}
                        {txn.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748b] font-semibold whitespace-nowrap">
                        {txn.previousStock}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0f172a] whitespace-nowrap">
                        {txn.updatedStock}
                      </td>
                      <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                        {txn.machine}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                        {txn.party}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                          {txn.purpose}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                        {txn.transactionDate}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                        {txn.updatedBy}
                      </td>
                    </tr>
                  ))}
                  {visibleTransactions.length === 0 && (
                    <tr>
                      <td colSpan={11} className="py-10 text-center text-sm text-[#64748b]">
                        No stock transactions found for the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={txnPagination.currentPage}
              totalPages={txnPagination.totalPages}
              totalItems={txnPagination.totalItems}
              startItem={txnPagination.startItem}
              endItem={txnPagination.endItem}
              onPageChange={txnPagination.setCurrentPage}
            />
          </section>
      )}

      {/* Modal 1: Add / Edit Spare Part */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setPartFormError('');
        }}
        title={isEditMode ? `Edit Spare Part (${partForm.partId})` : 'Add New Spare Part'}
        subtitle={
          isEditMode
            ? 'Update spare part details, minimum stock level, or storage location'
            : 'Register a new spare part SKU in maintenance inventory'
        }
        scrollable
      >
        <form onSubmit={handlePartSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {partFormError && (
            <div className="p-3 rounded-xl bg-[#feeceb] border border-[#fecaca] text-[#b91c1c] font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{partFormError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Part ID *</label>
              <input
                type="text"
                required
                disabled={isEditMode}
                value={partForm.partId}
                onChange={(e) => {
                  setPartForm({ ...partForm, partId: e.target.value });
                  setPartFormError('');
                }}
                placeholder="e.g. SP-108"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] disabled:opacity-60 focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Part Number *</label>
              <input
                type="text"
                required
                value={partForm.partNumber}
                onChange={(e) => setPartForm({ ...partForm, partNumber: e.target.value })}
                placeholder="e.g. SG-HYD-FLT-10U"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1.5">Part Name *</label>
            <input
              type="text"
              required
              value={partForm.partName}
              onChange={(e) => setPartForm({ ...partForm, partName: e.target.value })}
              placeholder="Enter spare part name..."
              className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Part Category *</label>
              <select
                value={partForm.partCategory}
                onChange={(e) =>
                  setPartForm({ ...partForm, partCategory: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {PART_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Unit *</label>
              <select
                value={partForm.unit}
                onChange={(e) => setPartForm({ ...partForm, unit: e.target.value })}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Available Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                disabled={isEditMode}
                value={partForm.availableStock}
                onChange={(e) =>
                  setPartForm({ ...partForm, availableStock: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] disabled:opacity-60 focus:outline-none focus:border-[#0b57d0]"
              />
              {isEditMode && (
                <p className="text-[10.5px] text-[#64748b] mt-1">
                  Use Stock In / Stock Out to change available stock.
                </p>
              )}
            </div>
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Minimum Stock Level *
              </label>
              <input
                type="number"
                min="1"
                required
                value={partForm.minStockLevel}
                onChange={(e) =>
                  setPartForm({ ...partForm, minStockLevel: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Storage Location *
              </label>
              <input
                type="text"
                required
                value={partForm.storageLocation}
                onChange={(e) =>
                  setPartForm({ ...partForm, storageLocation: e.target.value })
                }
                placeholder="e.g. Rack A-01"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Supplier *</label>
              <input
                type="text"
                required
                value={partForm.supplier}
                onChange={(e) => setPartForm({ ...partForm, supplier: e.target.value })}
                placeholder="e.g. Parker Hannifin India"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
            >
              {isEditMode ? 'Update Spare Part' : 'Save Spare Part'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: View Spare Part Details */}
      <Modal
        isOpen={Boolean(selectedPartDetails)}
        onClose={() => setSelectedPartDetails(null)}
        maxWidth="max-w-xl"
        headerContent={
          selectedPartDetails && (
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                {selectedPartDetails.partId}
              </span>
              <StatusBadge status={selectedPartDetails.stockStatus} showDot />
            </div>
          )
        }
      >
        {selectedPartDetails && (
          <div className="p-6 space-y-4 text-xs">
            <div>
              <p className="text-[#64748b] font-medium">Part Name</p>
              <h4 className="text-base font-extrabold text-[#0f172a] mt-0.5">
                {selectedPartDetails.partName}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <div>
                <p className="text-[#64748b]">Part Category</p>
                <p className="font-bold text-[#0f172a] mt-0.5">
                  {selectedPartDetails.partCategory}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Part Number</p>
                <p className="font-mono font-bold text-[#0f172a] mt-0.5">
                  {selectedPartDetails.partNumber}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Available Stock</p>
                <p className="text-sm font-extrabold text-[#0f172a] mt-0.5">
                  {selectedPartDetails.availableStock} {selectedPartDetails.unit}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Minimum Stock Level</p>
                <p className="text-sm font-extrabold text-[#475569] mt-0.5">
                  {selectedPartDetails.minStockLevel} {selectedPartDetails.unit}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Storage Location</p>
                <p className="font-bold text-[#0b57d0] mt-0.5">
                  {selectedPartDetails.storageLocation}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Supplier</p>
                <p className="font-bold text-[#0f172a] mt-0.5">
                  {selectedPartDetails.supplier}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Last Updated</p>
                <p className="font-semibold text-[#334155] mt-0.5">
                  {selectedPartDetails.lastUpdated}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              {canStockIn && (
                <button
                  type="button"
                  onClick={() => {
                    const part = selectedPartDetails;
                    setSelectedPartDetails(null);
                    handleOpenStockIn(part);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#e8f8ef] text-[#15803d] font-bold hover:bg-[#15803d] hover:text-white transition-colors cursor-pointer"
                >
                  Stock In
                </button>
              )}
              {canStockOut && selectedPartDetails.availableStock > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const part = selectedPartDetails;
                    setSelectedPartDetails(null);
                    handleOpenStockOut(part);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#fff4e5] text-[#c2410c] font-bold hover:bg-[#c2410c] hover:text-white transition-colors cursor-pointer"
                >
                  Stock Out
                </button>
              )}
              {canEditPart && (
                <button
                  type="button"
                  onClick={() => {
                    const part = selectedPartDetails;
                    setSelectedPartDetails(null);
                    handleOpenEditModal(part);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#eef4ff] text-[#0b57d0] font-bold hover:bg-[#0b57d0] hover:text-white transition-colors cursor-pointer"
                >
                  Edit Part
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedPartDetails(null)}
                className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 3: Stock In */}
      <Modal
        isOpen={isStockInOpen}
        onClose={() => setIsStockInOpen(false)}
        title="Stock In — Receive Spare Parts"
        subtitle="Record incoming stock from supplier and automatically update available quantity"
      >
        <form onSubmit={handleStockInSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#334155] mb-1.5">
              Select Spare Part *
            </label>
            <select
              value={stockInForm.partId}
              onChange={(e) => {
                const nextPart = spareParts.find((p) => p.partId === e.target.value);
                setStockInForm({
                  ...stockInForm,
                  partId: e.target.value,
                  supplier: nextPart?.supplier || stockInForm.supplier,
                });
              }}
              className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
            >
              {spareParts.map((part) => (
                <option key={part.partId} value={part.partId}>
                  {part.partId} — {part.partName} (Current: {part.availableStock} {part.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Received Quantity *
              </label>
              <input
                type="number"
                min="1"
                required
                value={stockInForm.quantity}
                onChange={(e) =>
                  setStockInForm({ ...stockInForm, quantity: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Received Date *
              </label>
              <input
                type="date"
                required
                value={stockInForm.receivedDate}
                onChange={(e) =>
                  setStockInForm({ ...stockInForm, receivedDate: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1.5">Supplier *</label>
            <input
              type="text"
              required
              value={stockInForm.supplier}
              onChange={(e) =>
                setStockInForm({ ...stockInForm, supplier: e.target.value })
              }
              placeholder="Enter supplier name..."
              className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1.5">Remarks</label>
            <input
              type="text"
              value={stockInForm.remarks}
              onChange={(e) =>
                setStockInForm({ ...stockInForm, remarks: e.target.value })
              }
              placeholder="e.g. GRN reference, batch details..."
              className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>

          {selectedStockInPart && (
            <div className="p-3.5 rounded-xl bg-[#e8f8ef] border border-[#bbf7d0] flex items-center justify-between">
              <span className="font-bold text-[#15803d]">Stock Preview</span>
              <span className="font-extrabold text-[#15803d]">
                {selectedStockInPart.availableStock} →{' '}
                {selectedStockInPart.availableStock +
                  Math.max(0, Number(stockInForm.quantity) || 0)}{' '}
                {selectedStockInPart.unit}
              </span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
            <button
              type="button"
              onClick={() => setIsStockInOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold cursor-pointer"
            >
              Confirm Stock In
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 4: Stock Out (with Validation & Confirmation Step) */}
      <Modal
        isOpen={isStockOutOpen}
        onClose={() => {
          setIsStockOutOpen(false);
          setStockOutStep('form');
          setStockOutError('');
        }}
        title={
          stockOutStep === 'confirm'
            ? 'Confirm Stock Issue'
            : 'Stock Out — Issue Spare Parts'
        }
        subtitle={
          stockOutStep === 'confirm'
            ? 'Review transaction details carefully before deducting stock'
            : 'Issue spare parts for Breakdown, Preventive Maintenance, or General Use'
        }
        scrollable
      >
        {stockOutStep === 'form' ? (
          <form
            onSubmit={handleStockOutProceed}
            className="p-6 overflow-y-auto space-y-4 text-xs"
          >
            {stockOutError && (
              <div className="p-3 rounded-xl bg-[#feeceb] border border-[#fecaca] text-[#b91c1c] font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{stockOutError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Select Spare Part *
              </label>
              <select
                value={stockOutForm.partId}
                onChange={(e) => {
                  setStockOutForm({ ...stockOutForm, partId: e.target.value });
                  setStockOutError('');
                }}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {spareParts.map((part) => (
                  <option key={part.partId} value={part.partId}>
                    {part.partId} — {part.partName} (Available: {part.availableStock}{' '}
                    {part.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Issued Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={stockOutForm.quantity}
                  onChange={(e) => {
                    setStockOutForm({ ...stockOutForm, quantity: e.target.value });
                    setStockOutError('');
                  }}
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
                {selectedStockOutPart && (
                  <p className="text-[10.5px] text-[#64748b] mt-1">
                    Available stock: {selectedStockOutPart.availableStock}{' '}
                    {selectedStockOutPart.unit}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={stockOutForm.issueDate}
                  onChange={(e) =>
                    setStockOutForm({ ...stockOutForm, issueDate: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#334155] mb-1.5">Machine *</label>
                <select
                  value={stockOutForm.machine}
                  onChange={(e) =>
                    setStockOutForm({ ...stockOutForm, machine: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  {MACHINE_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">Purpose *</label>
                <select
                  value={stockOutForm.purpose}
                  onChange={(e) =>
                    setStockOutForm({ ...stockOutForm, purpose: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  {STOCK_OUT_PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Issued To (Technician / Engineer) *
              </label>
              {isTechnician ? (
                <input
                  type="text"
                  disabled
                  value={currentTechnicianLabel}
                  className="w-full h-10 px-3 bg-[#f1f5f9] border border-[#d6deeb] rounded-xl font-bold text-[#475569]"
                />
              ) : (
                <select
                  value={stockOutForm.issuedTo}
                  onChange={(e) =>
                    setStockOutForm({ ...stockOutForm, issuedTo: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  {STAFF_OPTIONS.map((staff) => (
                    <option key={staff} value={staff}>
                      {staff}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Remarks</label>
              <input
                type="text"
                value={stockOutForm.remarks}
                onChange={(e) =>
                  setStockOutForm({ ...stockOutForm, remarks: e.target.value })
                }
                placeholder="e.g. Breakdown ticket ID or PM reference..."
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
              <button
                type="button"
                onClick={() => setIsStockOutOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
              >
                Review &amp; Confirm
              </button>
            </div>
          </form>
        ) : (
          selectedStockOutPart && (
            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#fff4e5] border border-[#fed7aa] text-[#9a3412] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#ea580c]" />
                <div>
                  <p className="font-extrabold">Please confirm this Stock Out issue</p>
                  <p className="mt-0.5 text-[#c2410c]">
                    This will deduct{' '}
                    <strong>
                      {stockOutForm.quantity} {selectedStockOutPart.unit}
                    </strong>{' '}
                    and add a permanent entry to the transaction history.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                <div className="col-span-2">
                  <p className="text-[#64748b]">Spare Part</p>
                  <p className="font-extrabold text-[#0f172a] mt-0.5">
                    {selectedStockOutPart.partId} — {selectedStockOutPart.partName}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Stock Change</p>
                  <p className="font-extrabold text-[#c2410c] mt-0.5">
                    {selectedStockOutPart.availableStock} →{' '}
                    {selectedStockOutPart.availableStock - Number(stockOutForm.quantity)}{' '}
                    {selectedStockOutPart.unit}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Purpose</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {stockOutForm.purpose}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Machine</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {stockOutForm.machine}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Issued To</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {stockOutForm.issuedTo}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Issue Date</p>
                  <p className="font-semibold text-[#334155] mt-0.5">
                    {stockOutForm.issueDate}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Remarks</p>
                  <p className="font-medium text-[#334155] mt-0.5">
                    {stockOutForm.remarks || '—'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setStockOutStep('form')}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Back to Edit
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStockOut}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Stock Issue</span>
                </button>
              </div>
            </div>
          )
        )}
      </Modal>
    </div>
  );
};

export default SparePartsInventory;
