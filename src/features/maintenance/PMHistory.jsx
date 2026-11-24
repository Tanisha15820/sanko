import { useState } from 'react';
import {
  Eye,
  RotateCcw,
  Camera,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useMaintenance } from '../../context/MaintenanceContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput from '../../components/common/SearchInput';
import sankoLogo from '../../assets/images/sanko-logo.png';

const HISTORY_ROLES = ['Admin', 'Engineer', 'Technician'];

const HISTORY_STATUS_OPTIONS = [
  'All Status',
  'Completed',
  'Failed / Pending Admin Review',
  'Closed',
];

const HISTORY_STATUS_VARIANTS = {
  Completed: 'green',
  'Failed / Pending Admin Review': 'red',
  Closed: 'green',
};

const PMHistory = () => {
  const { pmHistory: records } = useMaintenance();
  const { activeRole: globalRole, user } = useAuth();

  const activeRole = HISTORY_ROLES.includes(globalRole) ? globalRole : 'Admin';

  // Filters & Search
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [machineFilter, setMachineFilter] = useState('All Machines');
  const [technicianFilter, setTechnicianFilter] = useState('All Technicians');
  const [engineerFilter, setEngineerFilter] = useState('All Engineers');
  const [resultFilter, setResultFilter] = useState('All Results');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  // Details & Image Preview Modal
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const selectedRecord =
    records.find((r) => r.pmId === selectedRecordId) || null;

  // Dynamic filter options
  const machineOptions = [
    'All Machines',
    ...Array.from(new Set(records.map((r) => r.machineId))).sort(),
  ];
  const technicianOptions = [
    'All Technicians',
    ...Array.from(new Set(records.map((r) => r.assignedTechnician))).sort(),
  ];
  const engineerOptions = [
    'All Engineers',
    ...Array.from(new Set(records.map((r) => r.assignedEngineer))).sort(),
  ];

  // Role-based access scoping
  const roleScopedRecords = records.filter((rec) => {
    if (activeRole === 'Technician') {
      return rec.assignedTechnician === (user?.name || 'Suresh Nair');
    }
    if (activeRole === 'Engineer') {
      return rec.assignedEngineer === (user?.name || 'Karan Mehta');
    }
    // Admin views all PM records
    return true;
  });

  // Search & Filter
  const filteredHistory = roleScopedRecords.filter((rec) => {
    const compareDate = rec.scheduledDate;
    const matchesFrom = !dateFrom || compareDate >= dateFrom;
    const matchesTo = !dateTo || compareDate <= dateTo;
    const matchesMachine =
      machineFilter === 'All Machines' || rec.machineId === machineFilter;
    const matchesTech =
      technicianFilter === 'All Technicians' ||
      rec.assignedTechnician === technicianFilter;
    const matchesEng =
      engineerFilter === 'All Engineers' ||
      rec.assignedEngineer === engineerFilter;
    const matchesResult =
      resultFilter === 'All Results' || rec.checklistResult === resultFilter;
    const matchesStatus =
      statusFilter === 'All Status' || rec.pmStatus === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      rec.pmId.toLowerCase().includes(query) ||
      rec.machineName.toLowerCase().includes(query) ||
      rec.machineId.toLowerCase().includes(query);

    return (
      matchesFrom &&
      matchesTo &&
      matchesMachine &&
      matchesTech &&
      matchesEng &&
      matchesResult &&
      matchesStatus &&
      matchesSearch
    );
  });

  const handleResetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setMachineFilter('All Machines');
    setTechnicianFilter('All Technicians');
    setEngineerFilter('All Engineers');
    setResultFilter('All Results');
    setStatusFilter('All Status');
    setSearchQuery('');
  };

  return (
    <div className="space-y-5">
      {/* Role Scope Bar */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0b57d0] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0f172a]">
              Preventive Maintenance History
            </h2>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              {activeRole === 'Admin' &&
                'Admin View: Full access to all Completed, Pending Admin Review, and Closed PM records.'}
              {activeRole === 'Engineer' &&
                `Engineer View (${user?.name || 'Karan Mehta'}): PM records assigned to you with checklist results and status.`}
              {activeRole === 'Technician' &&
                `Technician View (${user?.name || 'Suresh Nair'}): Your submitted PM records, checklist responses, and final status.`}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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
              Machine
            </label>
            <select
              value={machineFilter}
              onChange={(e) => setMachineFilter(e.target.value)}
              className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
            >
              {machineOptions.map((m) => (
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
              className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
            >
              {technicianOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
              Engineer
            </label>
            <select
              value={engineerFilter}
              onChange={(e) => setEngineerFilter(e.target.value)}
              className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
            >
              {engineerOptions.map((eng) => (
                <option key={eng} value={eng}>
                  {eng}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
              Checklist Result
            </label>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
            >
              {['All Results', 'Pass', 'Fail'].map((res) => (
                <option key={res} value={res}>
                  {res}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
              PM Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
            >
              {HISTORY_STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#f1f5f9]">
          <div className="w-full sm:w-80">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by PM ID or Machine Name..."
              variant="bordered"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1.5 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold">
              {filteredHistory.length} Record{filteredHistory.length === 1 ? '' : 's'}
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      {/* PM History Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-4">PM ID</th>
                <th className="py-3.5 px-4">Machine Name &amp; ID</th>
                <th className="py-3.5 px-4">PM Frequency</th>
                <th className="py-3.5 px-4">Assigned Engineer</th>
                <th className="py-3.5 px-4">Assigned Technician</th>
                <th className="py-3.5 px-4">Scheduled Date</th>
                <th className="py-3.5 px-4">Inspection Date</th>
                <th className="py-3.5 px-4">Submission Date</th>
                <th className="py-3.5 px-4">Checklist Result</th>
                <th className="py-3.5 px-4">PM Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredHistory.map((rec) => (
                <tr
                  key={rec.pmId}
                  className="hover:bg-[#f8fafc]/80 transition-colors"
                >
                  <td className="py-3.5 px-4 font-extrabold text-[#0b57d0] whitespace-nowrap">
                    {rec.pmId}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-[#0f172a] block">
                      {rec.machineName}
                    </span>
                    <span className="text-xs font-bold text-[#64748b]">
                      {rec.machineId} • {rec.line}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                      {rec.pmType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                    {rec.assignedEngineer}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                    {rec.assignedTechnician}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                    {rec.scheduledDate}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                    {rec.inspectionDate || rec.scheduledDate}
                  </td>
                  <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                    {rec.submissionDate}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge
                      status={rec.checklistResult}
                      variant={rec.checklistResult === 'Pass' ? 'green' : 'red'}
                      showDot
                    />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge
                      status={rec.pmStatus}
                      variant={HISTORY_STATUS_VARIANTS[rec.pmStatus] || 'blue'}
                      showDot
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedRecordId(rec.pmId)}
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
                    No PM history records match your current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* View PM Report Modal */}
      <Modal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecordId(null)}
        maxWidth="max-w-3xl"
        scrollable
        headerContent={
          selectedRecord && (
            <div className="flex flex-wrap items-center gap-2.5">
              <img
                src={sankoLogo}
                alt="Sanko Gosei"
                className="h-7 object-contain mix-blend-multiply"
              />
              <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                {selectedRecord.pmId}
              </span>
              <StatusBadge
                status={selectedRecord.checklistResult}
                variant={selectedRecord.checklistResult === 'Pass' ? 'green' : 'red'}
                showDot
              />
              <StatusBadge
                status={selectedRecord.pmStatus}
                variant={HISTORY_STATUS_VARIANTS[selectedRecord.pmStatus] || 'blue'}
                showDot
              />
            </div>
          )
        }
      >
        {selectedRecord &&
          (() => {
            const failedItems = selectedRecord.checklistItems.filter(
              (item) => item.result === 'Fail'
            );
            const isFailedRecord = selectedRecord.checklistResult === 'Fail';

            return (
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Machine & PM Schedule Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                  <div>
                    <p className="text-[#64748b]">Machine Name &amp; ID</p>
                    <p className="font-extrabold text-[#0f172a] mt-0.5">
                      {selectedRecord.machineId} — {selectedRecord.machineName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b]">Production Line</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {selectedRecord.line}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b]">PM Frequency</p>
                    <p className="font-bold text-[#0b57d0] mt-0.5">
                      {selectedRecord.pmType}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b]">Assigned Engineer</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {selectedRecord.assignedEngineer}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b]">Assigned Technician</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {selectedRecord.assignedTechnician}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b]">Scheduled Date</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {selectedRecord.scheduledDate}
                    </p>
                  </div>
                </div>

                {/* Submission Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                    <p className="text-[#64748b]">Inspection Date</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {selectedRecord.inspectionDate || selectedRecord.scheduledDate}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                    <p className="text-[#64748b]">Submission Date</p>
                    <p className="font-bold text-[#0b57d0] mt-0.5">
                      {selectedRecord.submissionDate}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                    <p className="text-[#64748b]">Submitted By</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {selectedRecord.assignedTechnician}
                    </p>
                  </div>
                </div>

                {/* Failed Items Highlight (for Failed PM Records) */}
                {isFailedRecord && failedItems.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#feeceb] border border-[#fecaca] space-y-2">
                    <p className="font-extrabold text-[#991b1b] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
                      <span>
                        Failed Checklist Items ({failedItems.length})
                      </span>
                    </p>
                    <ul className="space-y-1.5 text-[#b91c1c]">
                      {failedItems.map((fi, idx) => (
                        <li key={idx} className="font-semibold">
                          • {fi.task} — <strong>{fi.paramValue}</strong> ({fi.remarks})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Complete Checklist */}
                <div className="space-y-2">
                  <p className="font-extrabold text-[#0f172a]">
                    Complete Inspection Checklist
                  </p>
                  <div className="space-y-2">
                    {selectedRecord.checklistItems.map((item, idx) => {
                      const isFail = item.result === 'Fail';
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            isFail
                              ? 'bg-[#feeceb]/50 border-[#fca5a5]'
                              : 'bg-[#f8fafc] border-[#edf1f7]'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <p className="font-bold text-[#0f172a]">
                              {idx + 1}. {item.task}
                            </p>
                            <p className="text-[#64748b]">
                              {item.paramLabel}:{' '}
                              <strong className="text-[#0f172a]">
                                {item.paramValue}
                              </strong>{' '}
                              • {item.remarks}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold shrink-0 self-start sm:self-center ${
                              isFail
                                ? 'bg-[#dc2626] text-white'
                                : 'bg-[#e8f8ef] text-[#15803d]'
                            }`}
                          >
                            {isFail ? (
                              <XCircle className="w-3 h-3" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            <span>{item.result}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Technician Remarks */}
                <div>
                  <p className="font-bold text-[#334155] mb-1">Technician Remarks</p>
                  <p className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7] text-[#334155]">
                    {selectedRecord.technicianRemarks || 'No remarks provided.'}
                  </p>
                </div>

                {/* Uploaded Images */}
                <div className="space-y-2">
                  <p className="font-bold text-[#334155] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#0b57d0]" />
                    <span>
                      Uploaded Images ({selectedRecord.uploadedImages?.length || 0})
                    </span>
                  </p>
                  {selectedRecord.uploadedImages &&
                  selectedRecord.uploadedImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedRecord.uploadedImages.map((img, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7] flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-[#0f172a] truncate">{img.name}</p>
                            <p className="text-[10.5px] text-[#64748b]">{img.uploadedAt}</p>
                          </div>
                          {img.url && (
                            <button
                              type="button"
                              onClick={() => setPreviewImage(img)}
                              className="p-1.5 rounded-lg bg-[#eef4ff] text-[#0b57d0] hover:bg-[#0b57d0] hover:text-white cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#64748b] p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                      No images uploaded for this PM record.
                    </p>
                  )}
                </div>

                {/* Admin Review & Closure Details (for Failed PM records) */}
                {isFailedRecord && (
                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] space-y-2.5">
                    <p className="font-extrabold text-[#0f172a] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0b57d0]" />
                      <span>Admin Failure Review &amp; Closure Details</span>
                    </p>
                    {selectedRecord.pmStatus === 'Closed' ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-lg bg-[#e8f8ef] border border-[#bbf7d0]">
                          <div>
                            <p className="text-[#15803d]">Closed By (Admin)</p>
                            <p className="font-extrabold text-[#0f172a] mt-0.5">
                              {selectedRecord.closedBy || 'Rajesh Kumar (Admin)'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#15803d]">Closure Date</p>
                            <p className="font-extrabold text-[#0f172a] mt-0.5">
                              {selectedRecord.closedAt || '—'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[#64748b] font-semibold mb-1">
                            Admin Review Remarks
                          </p>
                          <p className="p-3 rounded-lg bg-white border border-[#edf1f7] text-[#334155]">
                            {selectedRecord.adminRemarks || '—'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[#b91c1c] font-semibold">
                        Status is currently <strong>Failed / Pending Admin Review</strong>.
                        Closure details will appear once Admin reviews and closes this
                        record in PM Failure Review.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-[#f1f5f9]">
                  <button
                    type="button"
                    onClick={() => setSelectedRecordId(null)}
                    className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold cursor-pointer"
                  >
                    Close Report
                  </button>
                </div>
              </div>
            );
          })()}
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.name || 'Inspection Image'}
      >
        {previewImage && (
          <div className="p-6 text-center">
            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="max-h-[60vh] mx-auto rounded-xl border border-[#edf1f7]"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PMHistory;
