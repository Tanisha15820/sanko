import React, { useState } from 'react';
import {
  Search,
  Eye,
  RotateCcw,
  X,
  FileCheck2,
  Camera,
  UserCheck,
  Package,
} from 'lucide-react';
import sankoLogo from '../assets/images/sanko-logo.png';

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'Completed On Time':
      return 'bg-[#e8f8ef] text-[#15803d]';
    case 'Delayed':
      return 'bg-[#fff4e5] text-[#c2410c]';
    default:
      return 'bg-[#eef4ff] text-[#0b57d0]';
  }
};

const resultBadgeStyle = (result) => {
  if (result === 'All Passed') {
    return 'bg-[#e8f8ef] text-[#15803d]';
  }
  return 'bg-[#feeceb] text-[#b91c1c]';
};

const PMHistory = ({ pmHistory = [] }) => {
  const [dateFrom, setDateFrom] = useState('2026-10-01');
  const [dateTo, setDateTo] = useState('2026-11-30');
  const [lineFilter, setLineFilter] = useState('All Lines');
  const [machineFilter, setMachineFilter] = useState('All Machines');
  const [technicianFilter, setTechnicianFilter] = useState('All Technicians');
  const [pmTypeFilter, setPmTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filter PM History Records
  const filteredHistory = pmHistory.filter((rec) => {
    const recDate = rec.completionDate.slice(0, 10);
    const matchesFrom = !dateFrom || recDate >= dateFrom;
    const matchesTo = !dateTo || recDate <= dateTo;
    const matchesLine = lineFilter === 'All Lines' || rec.line === lineFilter;
    const matchesMachine =
      machineFilter === 'All Machines' || rec.machineId === machineFilter;
    const matchesTech =
      technicianFilter === 'All Technicians' || rec.technician === technicianFilter;
    const matchesType = pmTypeFilter === 'All Types' || rec.pmType === pmTypeFilter;
    const matchesStatus = statusFilter === 'All Status' || rec.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      rec.pmId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.technician.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesFrom &&
      matchesTo &&
      matchesLine &&
      matchesMachine &&
      matchesTech &&
      matchesType &&
      matchesStatus &&
      matchesSearch
    );
  });

  const handleResetFilters = () => {
    setDateFrom('2026-10-01');
    setDateTo('2026-11-30');
    setLineFilter('All Lines');
    setMachineFilter('All Machines');
    setTechnicianFilter('All Technicians');
    setPmTypeFilter('All Types');
    setStatusFilter('All Status');
    setSearchQuery('');
  };

  return (
    <div className="space-y-5">
      {/* Filters Section */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 flex-1">
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Production Line
              </label>
              <select
                value={lineFilter}
                onChange={(e) => setLineFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {[
                  'All Lines',
                  'Line A - Automotive',
                  'Line B - Interior Trim',
                  'Line C - Bumper Line',
                  'Line D - Precision Gear',
                ].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Machine
              </label>
              <select
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {[
                  'All Machines',
                  'IMM-01',
                  'IMM-02',
                  'IMM-03',
                  'IMM-04',
                  'IMM-05',
                  'IMM-06',
                  'IMM-07',
                  'IMM-08',
                  'IMM-09',
                  'IMM-10',
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Technician
              </label>
              <select
                value={technicianFilter}
                onChange={(e) => setTechnicianFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {[
                  'All Technicians',
                  'Karan Mehta',
                  'Rohan Sharma',
                  'Deepak Patel',
                  'Suresh Nair',
                  'Vikram Singh',
                ].map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                  PM Type
                </label>
                <select
                  value={pmTypeFilter}
                  onChange={(e) => setPmTypeFilter(e.target.value)}
                  className="w-full h-10 px-2 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                >
                  {['All Types', 'Daily', 'Weekly', 'Monthly', 'Cycle-based'].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-2 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                >
                  {['All Status', 'Completed On Time', 'Delayed'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </section>

      {/* PM History Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              Completed Preventive Maintenance Audit Log
            </h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Complete historical archive of signed-off PM checklists, telemetry readings, and spare parts consumed
            </p>
          </div>

          <div className="relative w-full sm:w-68">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PM ID, machine, technician..."
              className="w-full h-9 pl-9 pr-3.5 bg-[#f3f6fb] hover:bg-[#edf2f9] focus:bg-white border border-transparent focus:border-[#0b57d0]/30 rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/10 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">PM ID</th>
                <th className="py-3.5 px-5">Machine ID</th>
                <th className="py-3.5 px-5">Machine Name</th>
                <th className="py-3.5 px-5">Production Line</th>
                <th className="py-3.5 px-5">PM Type</th>
                <th className="py-3.5 px-5">Scheduled Date</th>
                <th className="py-3.5 px-5">Completion Date</th>
                <th className="py-3.5 px-5">Technician</th>
                <th className="py-3.5 px-5">Inspection Result</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredHistory.map((item) => (
                <tr key={item.pmId} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#0f172a] whitespace-nowrap">
                    {item.pmId}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-[#0b57d0] whitespace-nowrap">
                    {item.machineId}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                    {item.machineName}
                  </td>
                  <td className="py-3.5 px-5 text-[#64748b] whitespace-nowrap">
                    {item.line}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                      {item.pmType}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[#64748b] whitespace-nowrap">
                    {item.scheduledDate}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-[#334155] whitespace-nowrap">
                    {item.completionDate}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-[#334155] whitespace-nowrap">
                    {item.technician}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${resultBadgeStyle(
                        item.inspectionResult
                      )}`}
                    >
                      {item.inspectionResult}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadgeStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedRecord(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-sm text-[#64748b]">
                    No completed PM history records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* PM History Details & Audit Trail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                  {selectedRecord.pmId}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">
                    {selectedRecord.machineId} — {selectedRecord.machineName}
                  </h3>
                  <p className="text-xs text-[#64748b]">
                    {selectedRecord.line} • {selectedRecord.pmType} PM Audit Record
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                <div>
                  <p className="text-[#64748b]">Scheduled Date</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">{selectedRecord.scheduledDate}</p>
                </div>
                <div>
                  <p className="text-[#64748b]">Completion Timestamp</p>
                  <p className="font-bold text-[#0b57d0] mt-0.5">{selectedRecord.completionDate}</p>
                </div>
                <div>
                  <p className="text-[#64748b]">Inspection Result</p>
                  <span
                    className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${resultBadgeStyle(
                      selectedRecord.inspectionResult
                    )}`}
                  >
                    {selectedRecord.inspectionResult}
                  </span>
                </div>
                <div>
                  <p className="text-[#64748b]">Execution Status</p>
                  <span
                    className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${statusBadgeStyle(
                      selectedRecord.status
                    )}`}
                  >
                    {selectedRecord.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#0b57d0]" />
                  <span>Completed Checklist Items &amp; Numeric Telemetry</span>
                </h4>
                <div className="border border-[#edf1f7] rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f8fafc] border-b border-[#edf1f7] text-[10.5px] font-bold text-[#64748b] uppercase">
                        <th className="py-2.5 px-4">Checkpoint Task</th>
                        <th className="py-2.5 px-4">Result</th>
                        <th className="py-2.5 px-4">Measured Value</th>
                        <th className="py-2.5 px-4">Technician Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {selectedRecord.checklistItems.map((c, i) => (
                        <tr key={i}>
                          <td className="py-2.5 px-4 font-semibold text-[#0f172a]">{c.task}</td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                                c.result === 'Pass'
                                  ? 'bg-[#e8f8ef] text-[#15803d]'
                                  : 'bg-[#feeceb] text-[#b91c1c]'
                              }`}
                            >
                              {c.result}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-[#0b57d0]">
                            {c.paramLabel}: {c.paramValue}
                          </td>
                          <td className="py-2.5 px-4 text-[#64748b]">{c.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                  <h4 className="text-xs font-extrabold text-[#0f172a] mb-2.5 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#0b57d0]" />
                    <span>Spare Parts / Consumables Used</span>
                  </h4>
                  {selectedRecord.sparePartsUsed && selectedRecord.sparePartsUsed.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedRecord.sparePartsUsed.map((sp, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#edf1f7]"
                        >
                          <div>
                            <span className="font-bold text-[#0b57d0]">{sp.partCode}</span>
                            <p className="text-[#475569] font-medium">{sp.description}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] font-extrabold">
                            Qty: {sp.quantityUsed}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#64748b]">No spare parts consumed during this PM.</p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7] flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#0f172a] mb-2.5 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#0b57d0]" />
                      <span>Inspection Evidence &amp; Photo Attachment</span>
                    </h4>
                    <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-white p-4 flex flex-col items-center justify-center text-center">
                      <img
                        src={sankoLogo}
                        alt="Inspection Verification"
                        className="h-7 w-auto object-contain opacity-80 mb-2 mix-blend-multiply"
                      />
                      <p className="font-bold text-[#0f172a]">
                        {selectedRecord.evidencePhoto || 'IMG_PM_HYDRAULIC_GAUGE_VERIFIED.JPG'}
                      </p>
                      <p className="text-[11px] text-[#64748b] mt-0.5">
                        Captured via Maintenance 4.0 Tablet • Verified Calibration Stamp
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#eef4ff]/60 border border-[#dce7ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0b57d0] text-white flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-extrabold text-[#0f172a]">
                      Digital Sign-off: {selectedRecord.technician}
                    </p>
                    <p className="text-[#475569] mt-0.5">{selectedRecord.finalRemarks}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10.5px] font-bold text-[#0b57d0] uppercase">
                    Audit Timestamp
                  </span>
                  <p className="font-extrabold text-[#0f172a]">{selectedRecord.completionDate}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#f8fafc] border-t border-[#edf1f7] flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PMHistory;
