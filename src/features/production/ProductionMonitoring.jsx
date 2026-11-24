import { useState } from 'react';
import {
  Eye,
  Edit3,
  Plus,
  Calendar,
  RotateCcw,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import TablePagination from '../../components/common/TablePagination';
import { usePagination } from '../../hooks/usePagination';
import {
  PRODUCTION_LINE_OPTIONS,
  SHIFT_OPTIONS,
  initialProductionPlans,
  initialMonitoringRecords,
  calculateGoodProduction,
  calculateAchievementPct,
} from './productionData';

const achievementBadge = (pct) => {
  if (pct >= 95) return 'bg-[#e8f8ef] text-[#15803d]';
  if (pct >= 85) return 'bg-[#fff4e5] text-[#c2410c]';
  return 'bg-[#feeceb] text-[#b91c1c]';
};

const achievementBar = (pct) => {
  if (pct >= 95) return 'bg-[#16a34a]';
  if (pct >= 85) return 'bg-[#ea580c]';
  return 'bg-[#dc2626]';
};

const ProductionMonitoring = () => {
  const { activeRole } = useAuth();
  const [records, setRecords] = useState(initialMonitoringRecords);

  // Filters
  const [selectedDate, setSelectedDate] = useState('2026-11-20');
  const [selectedShift, setSelectedShift] = useState('All Shifts');
  const [selectedLine, setSelectedLine] = useState('All Lines');
  const [selectedMachine, setSelectedMachine] = useState('All Machines');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);

  const [entryForm, setEntryForm] = useState({
    planId: initialProductionPlans[0].planId,
    actualProduction: '',
    rejectedQuantity: '0',
    remarks: '',
  });

  const canEnterData =
    activeRole === 'Production Engineer' || activeRole === 'Admin';

  const selectedRecord =
    records.find((r) => r.id === selectedRecordId) || null;

  const machineFilterOptions = [
    'All Machines',
    ...Array.from(new Set(records.map((r) => r.machineId))).sort(),
  ];

  // Role-scoped records
  const roleScopedRecords = records.filter((rec) => {
    if (activeRole === 'Technician') {
      return (
        rec.productionLine === 'Line A - Automotive' ||
        rec.productionLine === 'Line B - Interior Trim'
      );
    }
    return true;
  });

  // Filtered records
  const filteredRecords = roleScopedRecords.filter((rec) => {
    const matchesDate = !selectedDate || rec.date === selectedDate;
    const matchesShift =
      selectedShift === 'All Shifts' || rec.shift === selectedShift;
    const matchesLine =
      selectedLine === 'All Lines' || rec.productionLine === selectedLine;
    const matchesMachine =
      selectedMachine === 'All Machines' || rec.machineId === selectedMachine;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      rec.machineId.toLowerCase().includes(q) ||
      rec.machineName.toLowerCase().includes(q) ||
      rec.productName.toLowerCase().includes(q) ||
      rec.productionLine.toLowerCase().includes(q);
    return (
      matchesDate &&
      matchesShift &&
      matchesLine &&
      matchesMachine &&
      matchesSearch
    );
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    paginatedItems: paginatedRecords,
    setCurrentPage,
  } = usePagination(
    filteredRecords,
    10,
    `${activeRole}|${selectedDate}|${selectedShift}|${selectedLine}|${selectedMachine}|${searchQuery}`
  );

  const handleResetFilters = () => {
    setSelectedDate('2026-11-20');
    setSelectedShift('All Shifts');
    setSelectedLine('All Lines');
    setSelectedMachine('All Machines');
    setSearchQuery('');
  };

  // Open Production Data Entry Modal (Add)
  const handleOpenAddEntry = () => {
    setEditingRecordId(null);
    setEntryForm({
      planId: initialProductionPlans[0].planId,
      actualProduction: '',
      rejectedQuantity: '0',
      remarks: '',
    });
    setIsEntryModalOpen(true);
  };

  // Open Production Data Entry Modal (Edit)
  const handleOpenEditEntry = (rec) => {
    setEditingRecordId(rec.id);
    setEntryForm({
      planId: rec.planId,
      actualProduction: String(rec.actualProduction),
      rejectedQuantity: String(rec.rejectedQuantity),
      remarks: rec.remarks || '',
    });
    setIsEntryModalOpen(true);
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    const actual = Math.max(0, Number(entryForm.actualProduction) || 0);
    const rejected = Math.min(
      actual,
      Math.max(0, Number(entryForm.rejectedQuantity) || 0)
    );

    if (editingRecordId) {
      setRecords((prev) =>
        prev.map((rec) =>
          rec.id === editingRecordId
            ? {
                ...rec,
                actualProduction: actual,
                rejectedQuantity: rejected,
                remarks: entryForm.remarks.trim(),
              }
            : rec
        )
      );
    } else {
      const plan =
        initialProductionPlans.find((p) => p.planId === entryForm.planId) ||
        initialProductionPlans[0];
      const newRecord = {
        id: `PMON-${108 + records.length}`,
        planId: plan.planId,
        date: plan.targetDate,
        machineId: plan.machineId,
        machineName: plan.machineName,
        productionLine: plan.productionLine,
        productName: plan.productName,
        shift: plan.shift,
        plannedQuantity: plan.plannedQuantity,
        actualProduction: actual,
        rejectedQuantity: rejected,
        remarks: entryForm.remarks.trim() || 'Production data logged for shift.',
        breakdown: null,
      };
      setRecords((prev) => [newRecord, ...prev]);
      setSelectedDate(plan.targetDate);
    }

    setIsEntryModalOpen(false);
  };

  // Live preview inside Data Entry Modal
  const selectedEntryPlan =
    initialProductionPlans.find((p) => p.planId === entryForm.planId) ||
    initialProductionPlans[0];
  const entryGoodPreview = calculateGoodProduction(
    entryForm.actualProduction,
    entryForm.rejectedQuantity
  );
  const entryAchievementPreview = calculateAchievementPct(
    entryGoodPreview,
    selectedEntryPlan?.plannedQuantity
  );

  return (
    <div className="space-y-5">
      {/* Role Selector Bar */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#0f172a]">
            Production Monitoring &amp; Data Entry
          </h2>
          <p className="text-xs font-medium text-[#64748b] mt-0.5">
            {activeRole === 'Production Engineer' &&
              'Production Engineer View: Enter and edit shift production data, monitor achievement and breakdown impact.'}
            {activeRole === 'Admin' &&
              'Admin View: Full access to view and manage all plant production monitoring records.'}
            {activeRole === 'Engineer' &&
              'Engineer View: Monitor machine performance, scrap levels, and breakdown-related production loss.'}
            {activeRole === 'Technician' &&
              'Technician View: Relevant machine output and breakdown status for assigned lines.'}
          </p>
        </div>
      </section>

      {/* Production Filters Bar */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Production Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#0b57d0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Shift
              </label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Shifts', ...SHIFT_OPTIONS].map((sh) => (
                  <option key={sh} value={sh}>
                    {sh}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Production Line
              </label>
              <select
                value={selectedLine}
                onChange={(e) => setSelectedLine(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Lines', ...PRODUCTION_LINE_OPTIONS].map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Machine
              </label>
              <select
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {machineFilterOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {canEnterData && (
              <button
                type="button"
                onClick={handleOpenAddEntry}
                className="h-10 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Enter Production Data</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Machine-wise Production Monitoring Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              Machine-wise Production Table
            </h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Good Production = Actual − Rejected • Achievement = (Good / Planned) × 100
            </p>
          </div>

          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search machine, product, line..."
            className="w-full sm:w-68"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-4">Machine Name / ID</th>
                <th className="py-3.5 px-4">Production Line</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Planned Qty</th>
                <th className="py-3.5 px-4">Actual</th>
                <th className="py-3.5 px-4">Rejected</th>
                <th className="py-3.5 px-4">Good Production</th>
                <th className="py-3.5 px-4">Achievement (%)</th>
                <th className="py-3.5 px-4">Shift &amp; Date</th>
                <th className="py-3.5 px-4">Breakdown</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {paginatedRecords.map((row) => {
                const goodQty = calculateGoodProduction(
                  row.actualProduction,
                  row.rejectedQuantity
                );
                const achievementPct = calculateAchievementPct(
                  goodQty,
                  row.plannedQuantity
                );
                const isHighRejection = row.rejectedQuantity >= 30;

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      row.breakdown
                        ? 'bg-[#feeceb]/30 hover:bg-[#feeceb]/50'
                        : 'hover:bg-[#f8fafc]/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#0b57d0] block">{row.machineId}</span>
                      <span className="text-xs font-semibold text-[#0f172a]">
                        {row.machineName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                      {row.productionLine}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#0f172a] whitespace-nowrap">
                      {row.productName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#334155] whitespace-nowrap">
                      {row.plannedQuantity.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0f172a] whitespace-nowrap">
                      {row.actualProduction.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isHighRejection
                            ? 'bg-[#feeceb] text-[#b91c1c]'
                            : 'bg-[#f1f5f9] text-[#475569]'
                        }`}
                      >
                        {row.rejectedQuantity} pcs
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#15803d] whitespace-nowrap">
                      {goodQty.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${achievementBadge(
                            achievementPct
                          )}`}
                        >
                          {achievementPct}%
                        </span>
                        <div className="w-14 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${achievementBar(
                              achievementPct
                            )}`}
                            style={{ width: `${Math.min(achievementPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg bg-[#f3f6fb] text-[#334155] text-[11px] font-bold block w-fit">
                        {row.shift}
                      </span>
                      <span className="text-[11px] text-[#64748b]">{row.date}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {row.breakdown ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#feeceb] text-[#b91c1c] text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          {row.breakdown.breakdownId}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-[#15803d]">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      {canEnterData && (
                        <button
                          type="button"
                          onClick={() => handleOpenEditEntry(row)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155] text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedRecordId(row.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-sm text-[#64748b]">
                    No production records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startItem={startItem}
          endItem={endItem}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* Modal 1: Production Data Entry / Edit Modal */}
      <Modal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        title={editingRecordId ? 'Edit Production Data' : 'Enter Production Data'}
        subtitle="Select a production plan and record actual production, rejected quantity, and remarks"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveEntry} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#334155] mb-1.5">
              Select Production Plan *
            </label>
            <select
              disabled={Boolean(editingRecordId)}
              value={entryForm.planId}
              onChange={(e) =>
                setEntryForm({ ...entryForm, planId: e.target.value })
              }
              className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] disabled:opacity-70 focus:outline-none focus:border-[#0b57d0]"
            >
              {initialProductionPlans.map((p) => (
                <option key={p.planId} value={p.planId}>
                  {p.planId} • {p.machineId} ({p.productName} — Target: {p.plannedQuantity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Actual Production Quantity (pcs) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={entryForm.actualProduction}
                onChange={(e) =>
                  setEntryForm({ ...entryForm, actualProduction: e.target.value })
                }
                placeholder="e.g. 2350"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Rejected Quantity (pcs) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={entryForm.rejectedQuantity}
                onChange={(e) =>
                  setEntryForm({ ...entryForm, rejectedQuantity: e.target.value })
                }
                placeholder="e.g. 25"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          {/* Live Calculated Good Production & Achievement */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#eef4ff]/60 border border-[#dce7ff]">
            <div>
              <p className="text-[#64748b] font-medium">Good Production</p>
              <p className="text-base font-extrabold text-[#15803d] mt-0.5">
                {entryGoodPreview.toLocaleString()} pcs
              </p>
            </div>
            <div>
              <p className="text-[#64748b] font-medium">Achievement %</p>
              <p className="text-base font-extrabold text-[#0b57d0] mt-0.5">
                {entryAchievementPreview}%
              </p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1.5">
              Production Remarks
            </label>
            <textarea
              rows={3}
              value={entryForm.remarks}
              onChange={(e) =>
                setEntryForm({ ...entryForm, remarks: e.target.value })
              }
              placeholder="Enter shift notes, scrap reasons, or stoppage observations..."
              className="w-full p-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
            <button
              type="button"
              onClick={() => setIsEntryModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
            >
              {editingRecordId ? 'Update Production Data' : 'Save Production Data'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Production Record Details */}
      <Modal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecordId(null)}
        maxWidth="max-w-xl"
        headerContent={
          selectedRecord && (
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                {selectedRecord.machineId}
              </span>
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a]">
                  {selectedRecord.machineName}
                </h3>
                <p className="text-xs text-[#64748b]">
                  {selectedRecord.productionLine} • {selectedRecord.shift} ({selectedRecord.date})
                </p>
              </div>
            </div>
          )
        }
      >
        {selectedRecord &&
          (() => {
            const goodQty = calculateGoodProduction(
              selectedRecord.actualProduction,
              selectedRecord.rejectedQuantity
            );
            const pct = calculateAchievementPct(
              goodQty,
              selectedRecord.plannedQuantity
            );

            return (
              <div className="p-6 space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-[#0b57d0]" />
                    <div>
                      <p className="text-[#64748b]">Product Name</p>
                      <p className="font-bold text-[#0f172a] mt-0.5">
                        {selectedRecord.productName}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] font-bold">
                    {selectedRecord.planId}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#f4f7fb]">
                    <p className="text-[#64748b] font-medium">Planned Qty</p>
                    <p className="text-base font-extrabold text-[#0f172a] mt-1">
                      {selectedRecord.plannedQuantity.toLocaleString()} pcs
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#f4f7fb]">
                    <p className="text-[#64748b] font-medium">Actual Production</p>
                    <p className="text-base font-extrabold text-[#0f172a] mt-1">
                      {selectedRecord.actualProduction.toLocaleString()} pcs
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#e8f8ef]/70">
                    <p className="text-[#15803d] font-medium">Good Production</p>
                    <p className="text-base font-extrabold text-[#15803d] mt-1">
                      {goodQty.toLocaleString()} pcs
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#feeceb]/70">
                    <p className="text-[#b91c1c] font-medium">Rejected Qty</p>
                    <p className="text-base font-extrabold text-[#b91c1c] mt-1">
                      {selectedRecord.rejectedQuantity} pcs
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#eef4ff] col-span-2">
                    <p className="text-[#0b57d0] font-medium">
                      Production Achievement
                    </p>
                    <p className="text-base font-extrabold text-[#0b57d0] mt-1">
                      {pct}%
                    </p>
                  </div>
                </div>

                {selectedRecord.breakdown && (
                  <div className="p-4 rounded-xl bg-[#feeceb]/60 border border-[#fecaca] space-y-1.5">
                    <p className="font-extrabold text-[#991b1b] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
                      <span>
                        Breakdown Connected: {selectedRecord.breakdown.breakdownId}
                      </span>
                    </p>
                    <p className="text-[#b91c1c]">
                      Start: <strong>{selectedRecord.breakdown.startTime}</strong> •
                      Downtime: <strong>{selectedRecord.breakdown.downtime}</strong> •
                      Impact:{' '}
                      <strong>{selectedRecord.breakdown.productionImpact}</strong>
                    </p>
                  </div>
                )}

                <div>
                  <p className="font-bold text-[#334155] mb-1">Production Remarks</p>
                  <p className="p-3 rounded-xl bg-[#f4f7fb] text-[#334155]">
                    {selectedRecord.remarks || 'No remarks entered.'}
                  </p>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedRecordId(null)}
                    className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold cursor-pointer"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            );
          })()}
      </Modal>
    </div>
  );
};

export default ProductionMonitoring;
