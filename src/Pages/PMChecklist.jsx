import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  Plus,
  Trash2,
  UserCheck,
  ArrowLeft,
  Wrench,
  Check,
  X,
} from 'lucide-react';

const defaultChecklistItems = [
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

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-[#e8f8ef] text-[#15803d]';
    case 'Due Today':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Overdue':
      return 'bg-[#feeceb] text-[#b91c1c]';
    default:
      return 'bg-[#eef4ff] text-[#0b57d0]';
  }
};

const PMChecklist = ({
  pmTasks = [],
  spareParts = [],
  onSubmitChecklist,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryPmId = searchParams.get('pmId') || (pmTasks[0] && pmTasks[0].pmId) || 'PM-2026-401';
  const [selectedPmId, setSelectedPmId] = useState(queryPmId);

  useEffect(() => {
    if (queryPmId && pmTasks.some((t) => t.pmId === queryPmId)) {
      setSelectedPmId(queryPmId);
    }
  }, [queryPmId, pmTasks]);

  const currentTask =
    pmTasks.find((t) => t.pmId === selectedPmId) ||
    pmTasks[0] || {
      pmId: 'PM-2026-401',
      machineId: 'IMM-02',
      machineName: 'Sumitomo 220T High-Speed',
      line: 'Line A - Automotive',
      frequency: 'Monthly',
      scheduledDate: '2026-11-20',
      engineer: 'Karan Mehta',
      status: 'Due Today',
    };

  const [checklistItems, setChecklistItems] = useState(defaultChecklistItems);
  const [usedParts, setUsedParts] = useState([
    { id: 1, partCode: 'SP-108', quantityUsed: 2 },
  ]);
  const [technicianName, setTechnicianName] = useState(currentTask.engineer || 'Karan Mehta');
  const [completionDateTime, setCompletionDateTime] = useState('2026-11-20T16:15');
  const [finalRemarks, setFinalRemarks] = useState(
    'All monthly preventive maintenance checkpoints verified. Replaced Zone-2 ceramic heater band and topped up lubrication reservoir.'
  );

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSelectTask = (newPmId) => {
    setSelectedPmId(newPmId);
    setSearchParams({ pmId: newPmId });
    setSubmissionSuccess(false);
    const found = pmTasks.find((t) => t.pmId === newPmId);
    if (found) {
      setTechnicianName(found.engineer);
    }
  };

  const handleChecklistChange = (id, field, value) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddSpareRow = () => {
    const firstPart = spareParts[0]?.partCode || 'SP-104';
    setUsedParts((prev) => [
      ...prev,
      { id: Date.now(), partCode: firstPart, quantityUsed: 1 },
    ]);
  };

  const handleRemoveSpareRow = (rowId) => {
    setUsedParts((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handlePartRowChange = (rowId, field, value) => {
    setUsedParts((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? {
              ...r,
              [field]: field === 'quantityUsed' ? Math.max(0, Number(value)) : value,
            }
          : r
      )
    );
  };

  const lowStockAlerts = spareParts.filter((part) => {
    const usedQty = usedParts
      .filter((u) => u.partCode === part.partCode)
      .reduce((sum, u) => sum + Number(u.quantityUsed || 0), 0);
    const projectedStock = part.availableStock - usedQty;
    return projectedStock < part.minThreshold;
  });

  const handleConfirmSubmit = () => {
    const enrichedSparePartsUsed = usedParts
      .filter((u) => u.quantityUsed > 0)
      .map((u) => {
        const meta = spareParts.find((p) => p.partCode === u.partCode);
        return {
          partCode: u.partCode,
          description: meta ? meta.description : 'Maintenance Consumable',
          quantityUsed: Number(u.quantityUsed),
        };
      });

    if (onSubmitChecklist) {
      onSubmitChecklist({
        pmId: currentTask.pmId,
        machineId: currentTask.machineId,
        machineName: currentTask.machineName,
        line: currentTask.line,
        pmType: currentTask.frequency,
        scheduledDate: currentTask.scheduledDate,
        completionDate: completionDateTime.replace('T', ' '),
        technician: technicianName,
        finalRemarks,
        checklistItems,
        sparePartsUsed: enrichedSparePartsUsed,
      });
    }

    setIsConfirmModalOpen(false);
    setSubmissionSuccess(true);
  };

  return (
    <div className="space-y-5">
      {/* Top Bar: Back to PM Calendar + Select Scheduled PM Task */}
      <div className="bg-white rounded-2xl border border-[#edf1f7] p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/pm/calendar')}
            className="p-2 rounded-xl bg-[#f3f6fb] hover:bg-[#eef4ff] text-[#334155] hover:text-[#0b57d0] transition-colors cursor-pointer"
            title="Back to PM Calendar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-extrabold text-[#0b57d0] bg-[#eef4ff] px-2.5 py-0.5 rounded-lg">
                {currentTask.pmId}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                {currentTask.machineId} — {currentTask.machineName}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadgeStyle(
                  currentTask.status
                )}`}
              >
                {currentTask.status}
              </span>
            </div>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Digital Preventive Maintenance Inspection &amp; Consumables Sign-off
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-[#64748b] whitespace-nowrap">
            Select PM Task:
          </label>
          <select
            value={currentTask.pmId}
            onChange={(e) => handleSelectTask(e.target.value)}
            className="h-9 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
          >
            {pmTasks.map((t) => (
              <option key={t.pmId} value={t.pmId}>
                {t.pmId} • {t.machineId} ({t.frequency} - {t.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submission Success Alert Banner */}
      {submissionSuccess && (
        <div className="bg-[#e8f8ef] border border-[#86efac] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#15803d] shrink-0" />
            <div>
              <p className="text-sm font-extrabold text-[#14532d]">
                PM Checklist {currentTask.pmId} Submitted &amp; Marked as Completed!
              </p>
              <p className="text-xs text-[#166534]">
                Spare parts inventory quantities have been automatically updated and the audit record has been added to PM History.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/pm/history')}
            className="px-4 py-2 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            View in PM History
          </button>
        </div>
      )}

      {/* 1. Machine & PM Information Summary Card */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#0f172a]">
              Machine &amp; PM Information
            </h3>
            <p className="text-xs font-medium text-[#64748b]">
              Work order details and scheduled maintenance metadata
            </p>
          </div>
          <Wrench className="w-5 h-5 text-[#0b57d0]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[11px] font-medium text-[#64748b]">PM ID</p>
            <p className="text-xs font-extrabold text-[#0b57d0] mt-1">{currentTask.pmId}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[11px] font-medium text-[#64748b]">Machine ID</p>
            <p className="text-xs font-extrabold text-[#0f172a] mt-1">{currentTask.machineId}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7] col-span-2">
            <p className="text-[11px] font-medium text-[#64748b]">Machine Name</p>
            <p className="text-xs font-extrabold text-[#0f172a] mt-1 truncate">
              {currentTask.machineName}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[11px] font-medium text-[#64748b]">Production Line</p>
            <p className="text-xs font-bold text-[#334155] mt-1 truncate">{currentTask.line}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[11px] font-medium text-[#64748b]">PM Frequency</p>
            <p className="text-xs font-extrabold text-[#0b57d0] mt-1">{currentTask.frequency}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[11px] font-medium text-[#64748b]">Scheduled Date</p>
            <p className="text-xs font-bold text-[#334155] mt-1">{currentTask.scheduledDate}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[11px] font-medium text-[#64748b]">Assigned Technician</p>
            <p className="text-xs font-bold text-[#0f172a] mt-1">{currentTask.engineer}</p>
          </div>
        </div>
      </section>

      {/* 2. Machine-Specific Inspection Checklist */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">Inspection Checklist</h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Verify each machine checkpoint, record numeric telemetry values, and mark Pass / Fail
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold self-start sm:self-auto">
            {checklistItems.filter((i) => i.result === 'Pass').length} / {checklistItems.length}{' '}
            Passed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5 w-12">#</th>
                <th className="py-3.5 px-5 min-w-[260px]">Inspection Task</th>
                <th className="py-3.5 px-5 w-44">Inspection Result</th>
                <th className="py-3.5 px-5 w-56">Numeric Parameter Input</th>
                <th className="py-3.5 px-5 min-w-[240px]">Technician Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {checklistItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-[#f8fafc]/60 transition-colors">
                  <td className="py-4 px-5 font-bold text-[#64748b]">{idx + 1}</td>
                  <td className="py-4 px-5 font-semibold text-[#0f172a] leading-snug">
                    {item.task}
                  </td>
                  <td className="py-4 px-5">
                    <div className="inline-flex items-center bg-[#f3f6fb] p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => handleChecklistChange(item.id, 'result', 'Pass')}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.result === 'Pass'
                            ? 'bg-[#16a34a] text-white shadow-xs'
                            : 'text-[#475569] hover:text-[#0f172a]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChecklistChange(item.id, 'result', 'Fail')}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.result === 'Fail'
                            ? 'bg-[#dc2626] text-white shadow-xs'
                            : 'text-[#475569] hover:text-[#0f172a]'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Fail</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <label className="block text-[10.5px] font-bold text-[#64748b] mb-1">
                      {item.paramLabel}
                    </label>
                    {item.requiresNumeric ? (
                      <input
                        type="number"
                        step="0.1"
                        value={item.paramValue}
                        onChange={(e) =>
                          handleChecklistChange(item.id, 'paramValue', e.target.value)
                        }
                        className="w-full h-9 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                      />
                    ) : (
                      <span className="inline-block px-2.5 py-1.5 rounded-lg bg-[#f3f6fb] text-[#475569] text-xs font-semibold">
                        N/A (Visual / Functional)
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <input
                      type="text"
                      value={item.remarks}
                      onChange={(e) =>
                        handleChecklistChange(item.id, 'remarks', e.target.value)
                      }
                      placeholder="Add inspection notes..."
                      className="w-full h-9 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Spare Parts / Consumables Used & 4. Technician Sign-off */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <section className="xl:col-span-7 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#0f172a]">
                  Spare Parts / Consumables Used
                </h3>
                <p className="text-xs font-medium text-[#64748b] mt-0.5">
                  Quantities used are automatically deducted from Spare Parts Inventory upon submission
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSpareRow}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Spare Part</span>
              </button>
            </div>

            {lowStockAlerts.length > 0 && (
              <div className="mb-4 p-3.5 rounded-xl bg-[#fff4e5] border border-[#fed7aa] flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-extrabold text-[#9a3412]">
                    Low Spare Parts Stock Warning (Below Minimum Reorder Threshold)
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[#c2410c] font-medium">
                    {lowStockAlerts.map((part) => {
                      const usedQty = usedParts
                        .filter((u) => u.partCode === part.partCode)
                        .reduce((sum, u) => sum + Number(u.quantityUsed || 0), 0);
                      const remaining = Math.max(0, part.availableStock - usedQty);
                      return (
                        <li key={part.partCode}>
                          • <strong>{part.partCode} ({part.description})</strong>: Projected stock{' '}
                          <strong>{remaining} {part.unit}</strong> (Min reorder threshold:{' '}
                          {part.minThreshold} {part.unit})
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3 px-4">Part Code</th>
                    <th className="py-3 px-4">Part Description</th>
                    <th className="py-3 px-4">Available Stock</th>
                    <th className="py-3 px-4 w-32">Quantity Used</th>
                    <th className="py-3 px-4 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-xs">
                  {usedParts.map((row) => {
                    const partInfo =
                      spareParts.find((p) => p.partCode === row.partCode) || spareParts[0];
                    const remainingAfterUse = partInfo
                      ? Math.max(0, partInfo.availableStock - Number(row.quantityUsed || 0))
                      : 0;
                    const isBelowThreshold =
                      partInfo && remainingAfterUse < partInfo.minThreshold;

                    return (
                      <tr key={row.id}>
                        <td className="py-3 px-4">
                          <select
                            value={row.partCode}
                            onChange={(e) =>
                              handlePartRowChange(row.id, 'partCode', e.target.value)
                            }
                            className="h-9 px-2.5 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0b57d0] focus:outline-none focus:border-[#0b57d0]"
                          >
                            {spareParts.map((sp) => (
                              <option key={sp.partCode} value={sp.partCode}>
                                {sp.partCode}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#0f172a]">
                          {partInfo?.description}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isBelowThreshold
                                ? 'bg-[#feeceb] text-[#b91c1c]'
                                : 'bg-[#e8f8ef] text-[#15803d]'
                            }`}
                          >
                            {partInfo?.availableStock} {partInfo?.unit} (Rem: {remainingAfterUse})
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            max={partInfo?.availableStock || 99}
                            value={row.quantityUsed}
                            onChange={(e) =>
                              handlePartRowChange(row.id, 'quantityUsed', e.target.value)
                            }
                            className="w-24 h-9 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveSpareRow(row.id)}
                            className="p-2 rounded-lg text-[#dc2626] hover:bg-[#feeceb] transition-colors cursor-pointer"
                            title="Remove part"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {usedParts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-xs text-[#64748b]">
                        No spare parts added. Click &ldquo;Add Spare Part&rdquo; to record consumables used.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748b]">
            <span className="font-semibold flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#0b57d0]" />
              Live Plant Store Inventory Connected
            </span>
            <span>Stock auto-decrements on checklist sign-off</span>
          </div>
        </section>

        {/* Technician Sign-off Card (5 cols) */}
        <section className="xl:col-span-5 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#0f172a]">Technician Sign-off</h3>
                <p className="text-xs font-medium text-[#64748b] mt-0.5">
                  Digital verification and maintenance completion timestamp
                </p>
              </div>
              <UserCheck className="w-5 h-5 text-[#0b57d0]" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Technician Name
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Completion Date and Time
                </label>
                <input
                  type="datetime-local"
                  value={completionDateTime}
                  onChange={(e) => setCompletionDateTime(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Final Remarks &amp; Handover Notes
                </label>
                <textarea
                  rows={3}
                  value={finalRemarks}
                  onChange={(e) => setFinalRemarks(e.target.value)}
                  placeholder="Enter overall machine condition and handover remarks..."
                  className="w-full p-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              className="w-full py-3 px-5 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.25)] inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Submit Checklist &amp; Sign-off</span>
            </button>
          </div>
        </section>
      </div>

      {/* Confirmation Modal before Final Submission */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0f172a]">
                Confirm PM Checklist Submission
              </h3>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-[#334155] leading-relaxed">
                Are you sure you want to submit the completed PM Checklist for{' '}
                <strong className="text-[#0f172a]">
                  {currentTask.pmId} ({currentTask.machineId} — {currentTask.machineName})
                </strong>
                ?
              </p>

              <div className="p-3.5 rounded-xl bg-[#f4f7fb] space-y-1.5 text-[#334155]">
                <p>
                  • Inspection Checkpoints:{' '}
                  <strong>
                    {checklistItems.filter((i) => i.result === 'Pass').length} Pass /{' '}
                    {checklistItems.filter((i) => i.result === 'Fail').length} Fail
                  </strong>
                </p>
                <p>
                  • Spare Parts Deducted:{' '}
                  <strong>{usedParts.filter((u) => u.quantityUsed > 0).length} item(s)</strong>
                </p>
                <p>
                  • Signed off by: <strong>{technicianName}</strong>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] text-xs font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PMChecklist;
