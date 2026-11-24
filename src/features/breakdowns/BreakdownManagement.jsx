import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  Check,
  Calendar,
  RotateCcw,
  Wrench,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBreakdowns } from '../../context/BreakdownContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput from '../../components/common/SearchInput';
import TablePagination from '../../components/common/TablePagination';
import { usePagination } from '../../hooks/usePagination';
import {
  BREAKDOWN_STATUSES,
  BREAKDOWN_STATUS_VARIANTS,
  PRIORITY_VARIANTS,
  MACHINE_CATALOG,
  ENGINEER_OPTIONS,
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  calculateDowntimeMinutes,
  formatDowntime,
  formatDateTimeDisplay,
} from './breakdownData';

const formatNowTimestamp = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const BreakdownManagement = () => {
  const navigate = useNavigate();
  const { breakdowns, addBreakdown, updateBreakdown, getRcaByBreakdownId } =
    useBreakdowns();
  const { activeRole } = useAuth();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [selectedDate, setSelectedDate] = useState('');

  // Modals State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedBreakdownId, setSelectedBreakdownId] = useState(null);
  const [managingBreakdownId, setManagingBreakdownId] = useState(null);

  // Report Breakdown Form State (Technician / Production Engineer)
  const [reportForm, setReportForm] = useState({
    machineId: MACHINE_CATALOG[0].id,
    plantLine: MACHINE_CATALOG[0].line,
    breakdownDate: '2026-11-21',
    startTimeOnly: '10:00',
    category: 'Mechanical',
    priority: 'High',
    problemDescription: '',
    reportedBy: 'Suresh Nair',
    imageName: '',
    imageUrl: null,
  });

  // Engineer Manage Form State
  const [manageForm, setManageForm] = useState({
    assignedEngineer: ENGINEER_OPTIONS[0],
    status: 'Under Inspection',
    repairStartTime: '',
    actualRepairCompletionTime: '',
    engineerRemarks: '',
  });

  // Admin Closure Form State (inside View Details modal)
  const [adminRemarksInput, setAdminRemarksInput] = useState('');

  const selectedBreakdown =
    breakdowns.find((b) => b.breakdownId === selectedBreakdownId) || null;
  const managingBreakdown =
    breakdowns.find((b) => b.breakdownId === managingBreakdownId) || null;

  const canReportBreakdown =
    activeRole === 'Technician' || activeRole === 'Production Engineer';

  // Role-based record visibility
  const roleScopedBreakdowns = breakdowns.filter((item) => {
    if (activeRole === 'Technician') {
      return item.reportedByRole === 'Technician';
    }
    if (activeRole === 'Production Engineer') {
      return item.reportedByRole === 'Production Engineer';
    }
    // Engineer and Admin can view all breakdown records
    return true;
  });

  // Filtered breakdowns
  const filteredBreakdowns = roleScopedBreakdowns.filter((item) => {
    const matchesStatus =
      statusFilter === 'All Status' || item.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'All Priorities' || item.priority === priorityFilter;
    const matchesDate = !selectedDate || item.breakdownDate === selectedDate;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.breakdownId.toLowerCase().includes(q) ||
      item.machineId.toLowerCase().includes(q) ||
      item.machineName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.reportedBy.toLowerCase().includes(q) ||
      item.assignedEngineer.toLowerCase().includes(q);
    return matchesStatus && matchesPriority && matchesDate && matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    paginatedItems: paginatedBreakdowns,
    setCurrentPage,
  } = usePagination(
    filteredBreakdowns,
    10,
    `${activeRole}|${searchQuery}|${statusFilter}|${priorityFilter}|${selectedDate}`
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setPriorityFilter('All Priorities');
    setSelectedDate('');
  };

  // Open Report Breakdown Modal
  const handleOpenReportModal = () => {
    const defaultReporter =
      activeRole === 'Production Engineer' ? 'Priya Deshmukh' : 'Suresh Nair';
    setReportForm({
      machineId: MACHINE_CATALOG[0].id,
      plantLine: MACHINE_CATALOG[0].line,
      breakdownDate: '2026-11-21',
      startTimeOnly: '10:00',
      category: 'Mechanical',
      priority: 'High',
      problemDescription: '',
      reportedBy: defaultReporter,
      imageName: '',
      imageUrl: null,
    });
    setIsReportModalOpen(true);
  };

  const handleReportMachineChange = (machineId) => {
    const found = MACHINE_CATALOG.find((m) => m.id === machineId);
    setReportForm((prev) => ({
      ...prev,
      machineId,
      plantLine: found ? found.line : prev.plantLine,
    }));
  };

  const handleReportImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReportForm((prev) => ({
      ...prev,
      imageName: file.name,
      imageUrl: URL.createObjectURL(file),
    }));
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const machineObj =
      MACHINE_CATALOG.find((m) => m.id === reportForm.machineId) ||
      MACHINE_CATALOG[0];
    const nextNum = String(44 + breakdowns.length).padStart(3, '0');

    const newRecord = {
      breakdownId: `BD-2026-${nextNum}`,
      machineId: machineObj.id,
      machineName: machineObj.name,
      plantLine: reportForm.plantLine.trim() || machineObj.line,
      breakdownDate: reportForm.breakdownDate,
      breakdownStartTime: `${reportForm.breakdownDate}T${reportForm.startTimeOnly}`,
      repairStartTime: '',
      actualRepairCompletionTime: '',
      category: reportForm.category,
      priority: reportForm.priority,
      problemDescription: reportForm.problemDescription.trim(),
      reportedBy: reportForm.reportedBy.trim(),
      reportedByRole: activeRole,
      assignedEngineer: 'Unassigned',
      status: 'Reported',
      engineerRemarks: '',
      imageName: reportForm.imageName,
      imageUrl: reportForm.imageUrl,
      rca: null,
      adminRemarks: '',
      closedBy: '',
      closedAt: '',
    };

    addBreakdown(newRecord);
    setIsReportModalOpen(false);
  };

  // Open Engineer Manage Modal
  const handleOpenManageModal = (item) => {
    setManagingBreakdownId(item.breakdownId);
    setManageForm({
      assignedEngineer:
        item.assignedEngineer === 'Unassigned'
          ? ENGINEER_OPTIONS[0]
          : item.assignedEngineer,
      status: item.status === 'Reported' ? 'Assigned' : item.status,
      repairStartTime: item.repairStartTime || item.breakdownStartTime,
      actualRepairCompletionTime: item.actualRepairCompletionTime || '',
      engineerRemarks: item.engineerRemarks || '',
    });
  };

  const handleManageSubmit = (e) => {
    e.preventDefault();
    if (!managingBreakdown) return;

    const computedDowntime = calculateDowntimeMinutes(
      managingBreakdown.breakdownStartTime,
      manageForm.actualRepairCompletionTime
    );

    let nextStatus = manageForm.status;
    // Automatically flag RCA Required when repair finishes with downtime > 30 mins and no RCA yet
    if (
      computedDowntime !== null &&
      computedDowntime > 30 &&
      !managingBreakdown.rca &&
      (nextStatus === 'Resolved' || nextStatus === 'Under Repair')
    ) {
      nextStatus = 'RCA Required';
    }

    updateBreakdown(managingBreakdown.breakdownId, {
      assignedEngineer: manageForm.assignedEngineer,
      status: nextStatus,
      repairStartTime: manageForm.repairStartTime,
      actualRepairCompletionTime: manageForm.actualRepairCompletionTime,
      engineerRemarks: manageForm.engineerRemarks.trim(),
    });

    setManagingBreakdownId(null);
  };

  // Open Details Modal
  const handleOpenDetails = (item) => {
    setSelectedBreakdownId(item.breakdownId);
    setAdminRemarksInput(item.adminRemarks || '');
  };

  // Admin: Approve RCA & Close Breakdown (separate from Actual Repair Completion Time)
  const handleAdminCloseBreakdown = () => {
    if (!selectedBreakdown) return;
    const now = formatNowTimestamp();

    updateBreakdown(selectedBreakdown.breakdownId, {
      status: 'Closed',
      adminRemarks:
        adminRemarksInput.trim() ||
        'RCA and corrective actions verified. Breakdown formally closed by Admin.',
      closedBy: 'Rajesh Kumar (Admin)',
      closedAt: now,
    });
  };

  // Live downtime preview inside Engineer Manage Modal
  const managePreviewDowntime = managingBreakdown
    ? calculateDowntimeMinutes(
      managingBreakdown.breakdownStartTime,
      manageForm.actualRepairCompletionTime
    )
    : null;

  return (
    <div className="space-y-5">
      {/* Role Selector Bar */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#0f172a]">
            Breakdown Management Workflow
          </h2>
          <p className="text-xs font-medium text-[#64748b] mt-0.5">
            {activeRole === 'Technician' &&
              'Technician View (Suresh Nair): Report machine breakdowns and track your reported records.'}
            {activeRole === 'Production Engineer' &&
              'Production Engineer View (Priya Deshmukh): Report line breakdowns and monitor recovery status.'}
            {activeRole === 'Engineer' &&
              'Engineer View (Karan Mehta): Inspect, manage repairs, record completion time, and submit RCA (>30 mins downtime).'}
            {activeRole === 'Admin' &&
              'Admin View (Rajesh Kumar): Review all breakdowns, verify RCA submissions, and formally close records.'}
          </p>
        </div>
      </section>

      {/* Breakdown Records Table Card */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">
                Machine Breakdown Records
              </h3>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">
                Downtime is calculated from Breakdown Start Time to Actual Repair Completion Time (highlighted if &gt; 30 mins)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 ml-auto shrink-0">
              {(activeRole === 'Engineer' || activeRole === 'Admin') && (
                <button
                  type="button"
                  onClick={() => navigate('/breakdowns/rca')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>RCA Management</span>
                </button>
              )}

              {/* Report Breakdown Button — visible for Technician & Production Engineer */}
              {canReportBreakdown && (
                <button
                  type="button"
                  onClick={handleOpenReportModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Report Breakdown</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search ID, machine, category, engineer..."
                className="w-full sm:w-64"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {BREAKDOWN_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-9 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Priorities', ...PRIORITY_OPTIONS].map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-[#0b57d0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  title="Filter by Breakdown Date"
                  className="h-9 pl-8 pr-3 bg-[#f3f6fb] hover:bg-[#edf2f9] focus:bg-white border border-[#d6deeb] focus:border-[#0b57d0] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none cursor-pointer"
                />
              </div>

              {(searchQuery ||
                statusFilter !== 'All Status' ||
                priorityFilter !== 'All Priorities' ||
                selectedDate) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="h-9 px-3 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
            </div>

            <span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold">
              {filteredBreakdowns.length} Records
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-4">Breakdown ID</th>
                <th className="py-3.5 px-4">Machine</th>
                <th className="py-3.5 px-4">Category &amp; Priority</th>
                <th className="py-3.5 px-4">Reported By</th>
                <th className="py-3.5 px-4">Assigned Engineer</th>
                <th className="py-3.5 px-4">Breakdown Start</th>
                <th className="py-3.5 px-4">Downtime</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {paginatedBreakdowns.map((item) => {
                const downtimeMins = calculateDowntimeMinutes(
                  item.breakdownStartTime,
                  item.actualRepairCompletionTime
                );
                const exceeds30 = downtimeMins !== null && downtimeMins > 30;

                return (
                  <tr
                    key={item.breakdownId}
                    className={`transition-colors ${exceeds30
                      ? 'bg-[#feeceb]/35 hover:bg-[#feeceb]/55'
                      : 'hover:bg-[#f8fafc]/80'
                      }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-[#0f172a] whitespace-nowrap">
                      {item.breakdownId}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#0b57d0] block">
                        {item.machineId}
                      </span>
                      <span className="text-xs font-semibold text-[#0f172a]">
                        {item.machineName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-semibold">
                          {item.category}
                        </span>
                        <StatusBadge
                          status={item.priority}
                          variant={PRIORITY_VARIANTS[item.priority] || 'blue'}
                          className="px-2 py-0.5 text-[11px]"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-[#0f172a] block">
                        {item.reportedBy}
                      </span>
                      <span className="text-[11px] text-[#64748b]">
                        {item.reportedByRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                      {item.assignedEngineer}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                      {formatDateTimeDisplay(item.breakdownStartTime)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`font-bold ${exceeds30 ? 'text-[#b91c1c]' : 'text-[#0f172a]'
                            }`}
                        >
                          {formatDowntime(downtimeMins)}
                        </span>
                        {exceeds30 && (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-[#dc2626]">
                            <AlertTriangle className="w-3 h-3" />
                            &gt; 30 mins (RCA)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge
                        status={item.status}
                        variant={BREAKDOWN_STATUS_VARIANTS[item.status] || 'blue'}
                        showDot
                        className="px-2.5 py-0.5 text-xs"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      {activeRole === 'Engineer' && item.status !== 'Closed' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenManageModal(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155] text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Manage</span>
                          </button>

                          {exceeds30 && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/breakdowns/rca/form?breakdownId=${encodeURIComponent(
                                    item.breakdownId
                                  )}`
                                )
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#feeceb] hover:bg-[#dc2626] text-[#b91c1c] hover:text-white text-xs font-bold transition-all cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>
                                {getRcaByBreakdownId(item.breakdownId)
                                  ? 'Open RCA'
                                  : 'Fill RCA'}
                              </span>
                            </button>
                          )}
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenDetails(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredBreakdowns.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-sm text-[#64748b]">
                    No breakdown records match the current role and filter criteria.
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

      {/* Modal 1: Report Breakdown Form (Technician & Production Engineer) */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Machine Breakdown"
        subtitle="Log a machine fault with start time, category, priority, and optional image"
        scrollable
      >
        <form onSubmit={handleReportSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Machine Name / Machine ID *
              </label>
              <select
                value={reportForm.machineId}
                onChange={(e) => handleReportMachineChange(e.target.value)}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {MACHINE_CATALOG.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} — {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Plant / Department / Production Line *
              </label>
              <input
                type="text"
                required
                value={reportForm.plantLine}
                onChange={(e) =>
                  setReportForm({ ...reportForm, plantLine: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Breakdown Date *
              </label>
              <input
                type="date"
                required
                value={reportForm.breakdownDate}
                onChange={(e) =>
                  setReportForm({ ...reportForm, breakdownDate: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Breakdown Start Time *
              </label>
              <input
                type="time"
                required
                value={reportForm.startTimeOnly}
                onChange={(e) =>
                  setReportForm({ ...reportForm, startTimeOnly: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Breakdown Category *
              </label>
              <select
                value={reportForm.category}
                onChange={(e) =>
                  setReportForm({ ...reportForm, category: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Priority *
              </label>
              <select
                value={reportForm.priority}
                onChange={(e) =>
                  setReportForm({ ...reportForm, priority: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {PRIORITY_OPTIONS.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Reported By *
              </label>
              <input
                type="text"
                required
                value={reportForm.reportedBy}
                onChange={(e) =>
                  setReportForm({ ...reportForm, reportedBy: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1.5">
              Problem Description *
            </label>
            <textarea
              rows={3}
              required
              value={reportForm.problemDescription}
              onChange={(e) =>
                setReportForm({ ...reportForm, problemDescription: e.target.value })
              }
              placeholder="Describe alarm codes, observed symptoms, or machine stoppage details..."
              className="w-full p-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1.5">
              Image Upload (Optional)
            </label>
            <label className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-dashed border-[#cbd5e1] hover:border-[#0b57d0] cursor-pointer">
              <span className="inline-flex items-center gap-2 text-[#475569] font-semibold">
                <Upload className="w-4 h-4 text-[#0b57d0]" />
                <span>{reportForm.imageName || 'Attach fault photo (JPG / PNG)'}</span>
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleReportImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
            >
              Submit Breakdown Report
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Engineer Review & Manage Breakdown */}
      <Modal
        isOpen={Boolean(managingBreakdown)}
        onClose={() => setManagingBreakdownId(null)}
        title={
          managingBreakdown
            ? `Manage Breakdown — ${managingBreakdown.breakdownId}`
            : 'Manage Breakdown'
        }
        subtitle={
          managingBreakdown
            ? `${managingBreakdown.machineId} • ${managingBreakdown.machineName}`
            : ''
        }
        scrollable
      >
        {managingBreakdown && (
          <form onSubmit={handleManageSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7] space-y-1">
              <p className="text-[#64748b]">
                Breakdown Start Time:{' '}
                <strong className="text-[#0f172a]">
                  {formatDateTimeDisplay(managingBreakdown.breakdownStartTime)}
                </strong>
              </p>
              <p className="text-[#475569]">{managingBreakdown.problemDescription}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Assigned Engineer
                </label>
                <select
                  value={manageForm.assignedEngineer}
                  onChange={(e) =>
                    setManageForm({ ...manageForm, assignedEngineer: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                >
                  {ENGINEER_OPTIONS.map((eng) => (
                    <option key={eng} value={eng}>
                      {eng}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Breakdown Status
                </label>
                <select
                  value={manageForm.status}
                  onChange={(e) =>
                    setManageForm({ ...manageForm, status: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                >
                  {[
                    'Assigned',
                    'Under Inspection',
                    'Under Repair',
                    'RCA Required',
                    'RCA Submitted',
                    'Resolved',
                  ].map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Repair Start Time
                </label>
                <input
                  type="datetime-local"
                  value={manageForm.repairStartTime}
                  onChange={(e) =>
                    setManageForm({ ...manageForm, repairStartTime: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Actual Repair Completion Time
                </label>
                <input
                  type="datetime-local"
                  value={manageForm.actualRepairCompletionTime}
                  onChange={(e) =>
                    setManageForm({
                      ...manageForm,
                      actualRepairCompletionTime: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>
            </div>

            {/* Live Downtime Calculation Preview */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${managePreviewDowntime !== null && managePreviewDowntime > 30
                ? 'bg-[#feeceb] border-[#fecaca] text-[#991b1b]'
                : 'bg-[#eef4ff]/60 border-[#dce7ff] text-[#1e3a8a]'
                }`}
            >
              {managePreviewDowntime !== null && managePreviewDowntime > 30 ? (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#dc2626]" />
              ) : (
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-[#0b57d0]" />
              )}
              <div>
                <p className="font-extrabold">
                  Calculated Downtime: {formatDowntime(managePreviewDowntime)}
                </p>
                {managePreviewDowntime !== null && managePreviewDowntime > 30 ? (
                  <p className="mt-0.5 font-semibold">
                    Warning: Downtime crossed 30 minutes. Root Cause Analysis (RCA) is required and must be submitted to Admin.
                  </p>
                ) : (
                  <p className="mt-0.5 opacity-85">
                    Downtime = Actual Repair Completion Time − Breakdown Start Time.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Engineer Inspection &amp; Repair Remarks
              </label>
              <textarea
                rows={3}
                value={manageForm.engineerRemarks}
                onChange={(e) =>
                  setManageForm({ ...manageForm, engineerRemarks: e.target.value })
                }
                placeholder="Enter diagnostic findings, parts replaced, and repair verification notes..."
                className="w-full p-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
              <button
                type="button"
                onClick={() => setManagingBreakdownId(null)}
                className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
              >
                Save Updates
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal 4: Breakdown Details & Admin Review / Closure */}
      <Modal
        isOpen={Boolean(selectedBreakdown)}
        onClose={() => setSelectedBreakdownId(null)}
        maxWidth="max-w-3xl"
        scrollable
        headerContent={
          selectedBreakdown && (
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                {selectedBreakdown.breakdownId}
              </span>
              <span className="text-base font-extrabold text-[#0f172a]">
                {selectedBreakdown.machineId} — {selectedBreakdown.machineName}
              </span>
              <StatusBadge
                status={selectedBreakdown.status}
                variant={BREAKDOWN_STATUS_VARIANTS[selectedBreakdown.status] || 'blue'}
                showDot
                className="px-2.5 py-0.5 text-xs"
              />
            </div>
          )
        }
        footer={
          <button
            type="button"
            onClick={() => setSelectedBreakdownId(null)}
            className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold cursor-pointer"
          >
            Close Details
          </button>
        }
      >
        {selectedBreakdown &&
          (() => {
            const downtimeMins = calculateDowntimeMinutes(
              selectedBreakdown.breakdownStartTime,
              selectedBreakdown.actualRepairCompletionTime
            );
            const exceeds30 = downtimeMins !== null && downtimeMins > 30;

            return (
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Downtime > 30m Warning */}
                {exceeds30 && (
                  <div className="p-3.5 rounded-xl bg-[#feeceb] border border-[#fecaca] text-[#991b1b] flex items-center gap-2.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-[#dc2626] shrink-0" />
                    <span>
                      Machine downtime ({formatDowntime(downtimeMins)}) exceeded 30 minutes — RCA review and Admin closure apply.
                    </span>
                  </div>
                )}

                {/* Machine & Timeline Information */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                  <div>
                    <p className="text-[#64748b]">Machine &amp; Plant Line</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {selectedBreakdown.machineId} • {selectedBreakdown.plantLine}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b]">Reported By</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {selectedBreakdown.reportedBy} ({selectedBreakdown.reportedByRole})
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b]">Assigned Engineer</p>
                    <p className="font-bold text-[#0b57d0] mt-0.5">
                      {selectedBreakdown.assignedEngineer}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b]">Breakdown Start Time</p>
                    <p className="font-semibold text-[#0f172a] mt-0.5">
                      {formatDateTimeDisplay(selectedBreakdown.breakdownStartTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b]">Repair Start Time</p>
                    <p className="font-semibold text-[#0f172a] mt-0.5">
                      {formatDateTimeDisplay(selectedBreakdown.repairStartTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748b]">Actual Repair Completion</p>
                    <p className="font-semibold text-[#0f172a] mt-0.5">
                      {formatDateTimeDisplay(
                        selectedBreakdown.actualRepairCompletionTime
                      )}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-3 pt-2 border-t border-[#edf1f7] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[#64748b] font-semibold">
                      Total Machine Downtime (Repair Completion − Breakdown Start):
                    </span>
                    <span
                      className={`text-sm font-extrabold ${exceeds30 ? 'text-[#dc2626]' : 'text-[#0b57d0]'
                        }`}
                    >
                      {formatDowntime(downtimeMins)}
                    </span>
                  </div>
                </div>

                {/* Problem Description & Engineer Remarks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                    <p className="font-extrabold text-[#0f172a] mb-1.5">
                      Problem Description
                    </p>
                    <p className="text-[#334155] leading-relaxed">
                      {selectedBreakdown.problemDescription}
                    </p>
                    {selectedBreakdown.imageName && (
                      <p className="mt-2 text-[11px] font-bold text-[#0b57d0]">
                        Attachment: {selectedBreakdown.imageName}
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                    <p className="font-extrabold text-[#0f172a] mb-1.5">
                      Engineer Remarks
                    </p>
                    <p className="text-[#334155] leading-relaxed">
                      {selectedBreakdown.engineerRemarks ||
                        'No engineer inspection remarks recorded yet.'}
                    </p>
                  </div>
                </div>

                {/* RCA Details */}
                <div className="p-4 rounded-xl bg-[#eef4ff]/50 border border-[#dce7ff] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-[#0f172a] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#0b57d0]" />
                      <span>Root Cause Analysis (RCA) Details</span>
                    </h4>
                    {activeRole === 'Engineer' &&
                      exceeds30 &&
                      selectedBreakdown.status !== 'Closed' && (
                        <button
                          type="button"
                          onClick={() => {
                            const targetId = selectedBreakdown.breakdownId;
                            setSelectedBreakdownId(null);
                            navigate(
                              `/breakdowns/rca/form?breakdownId=${encodeURIComponent(
                                targetId
                              )}`
                            );
                          }}
                          className="px-3 py-1 rounded-lg bg-[#0b57d0] text-white text-[11px] font-bold cursor-pointer"
                        >
                          {selectedBreakdown.rca ? 'Open RCA Form' : 'Fill RCA'}
                        </button>
                      )}
                  </div>

                  {selectedBreakdown.rca ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <p className="text-[#64748b]">Root Cause</p>
                        <p className="font-bold text-[#0f172a] mt-0.5">
                          {selectedBreakdown.rca.rootCause}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#64748b]">Why It Happened</p>
                        <p className="font-medium text-[#334155] mt-0.5">
                          {selectedBreakdown.rca.whyHappened}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#64748b]">Corrective Action</p>
                        <p className="font-medium text-[#334155] mt-0.5">
                          {selectedBreakdown.rca.correctiveAction}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#64748b]">Preventive Action</p>
                        <p className="font-medium text-[#334155] mt-0.5">
                          {selectedBreakdown.rca.preventiveAction}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#64748b]">Responsible Person</p>
                        <p className="font-bold text-[#0b57d0] mt-0.5">
                          {selectedBreakdown.rca.responsiblePerson}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#64748b]">RCA Date</p>
                        <p className="font-bold text-[#0f172a] mt-0.5">
                          {selectedBreakdown.rca.rcaDate}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#64748b]">
                      {exceeds30
                        ? 'RCA is required for this breakdown (>30 mins downtime) and has not been submitted yet.'
                        : 'RCA not required unless machine downtime exceeds 30 minutes.'}
                    </p>
                  )}
                </div>

                {/* Admin Review & Closure Details */}
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7] space-y-3">
                  <h4 className="font-extrabold text-[#0f172a] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0b57d0]" />
                    <span>Admin Review &amp; Closure Details</span>
                  </h4>

                  {activeRole === 'Admin' && selectedBreakdown.status !== 'Closed' ? (
                    <div className="space-y-3">
                      <textarea
                        rows={2}
                        value={adminRemarksInput}
                        onChange={(e) => setAdminRemarksInput(e.target.value)}
                        placeholder="Add Admin review remarks before approving and closing..."
                        className="w-full p-3 bg-white border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                      />
                      <button
                        type="button"
                        onClick={handleAdminCloseBreakdown}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve &amp; Close Breakdown</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-[#334155]">
                      <p>
                        {selectedBreakdown.adminRemarks ||
                          'Pending Admin review and formal closure.'}
                      </p>
                      {selectedBreakdown.closedBy && (
                        <p className="text-[11px] text-[#64748b]">
                          Closed by{' '}
                          <strong className="text-[#0f172a]">
                            {selectedBreakdown.closedBy}
                          </strong>{' '}
                          at <strong>{selectedBreakdown.closedAt}</strong> (Admin closure time does not affect machine downtime).
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
      </Modal>
    </div>
  );
};

export default BreakdownManagement;
