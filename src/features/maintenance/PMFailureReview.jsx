import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Calendar, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useMaintenance } from '../../context/MaintenanceContext';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput from '../../components/common/SearchInput';
import TablePagination from '../../components/common/TablePagination';
import { usePagination } from '../../hooks/usePagination';

const getReviewDisplayStatus = (status) =>
  status === 'Closed' ? 'Closed' : 'Pending Admin Review';

const REVIEW_STATUS_VARIANTS = {
  'Pending Admin Review': 'red',
  Closed: 'green',
};

const PMFailureReview = () => {
  const navigate = useNavigate();
  const { adminFailureQueue } = useMaintenance();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Only submitted PM checklists with at least one failed item
  const failureRecords = adminFailureQueue
    .filter((rec) => rec.failedItems && rec.failedItems.length > 0)
    .map((rec) => ({
      ...rec,
      displayStatus: getReviewDisplayStatus(rec.status),
    }));

  const filteredRecords = failureRecords.filter((rec) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      rec.pmId.toLowerCase().includes(q) ||
      rec.machineName.toLowerCase().includes(q) ||
      rec.machineId.toLowerCase().includes(q) ||
      rec.line.toLowerCase().includes(q) ||
      rec.technicianName.toLowerCase().includes(q) ||
      rec.engineerName.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'All Status' || rec.displayStatus === statusFilter;
    const matchesFrom = !fromDate || rec.scheduledDate >= fromDate;
    const matchesTo = !toDate || rec.scheduledDate <= toDate;

    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
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
    `${searchQuery}|${statusFilter}|${fromDate}|${toDate}`
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="space-y-5">
      {/* Header & Filters Card */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#dc2626] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                PM Failure Review
              </h2>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">
                Submitted preventive maintenance checklists with one or more failed inspection items requiring Admin review.
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-[#feeceb] text-[#b91c1c] text-xs font-extrabold self-start sm:self-auto">
            Total Records: {filteredRecords.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end pt-1">
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
              Search Failure Records
            </label>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="PM ID, machine, technician, engineer..."
              variant="bordered"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
            >
              {['All Status', 'Pending Admin Review', 'Closed'].map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
              From Date
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-[#0b57d0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-10 pl-8 pr-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                To Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-[#0b57d0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-10 pl-8 pr-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="h-10 px-3.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Reset</span>
            </button>
          </div>
        </div>
      </section>

      {/* Admin Failure Register Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-4">PM ID</th>
                <th className="py-3.5 px-4">Machine Name</th>
                <th className="py-3.5 px-4">Machine ID</th>
                <th className="py-3.5 px-4">Production Line</th>
                <th className="py-3.5 px-4">PM Date</th>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4">Engineer</th>
                <th className="py-3.5 px-4">Failed Items</th>
                <th className="py-3.5 px-4">Submission Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {paginatedRecords.map((rec) => (
                <tr
                  key={rec.pmId}
                  className="hover:bg-[#f8fafc]/80 transition-colors"
                >
                  <td className="py-3.5 px-4 font-extrabold text-[#0b57d0] whitespace-nowrap">
                    {rec.pmId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#0f172a] whitespace-nowrap">
                    {rec.machineName}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#334155] whitespace-nowrap">
                    {rec.machineId}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                    {rec.line}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                    {rec.scheduledDate}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                    {rec.technicianName}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                    {rec.engineerName}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#feeceb] text-[#b91c1c] text-xs font-extrabold">
                      <AlertTriangle className="w-3 h-3" />
                      {rec.failedItems.length} Failed
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                    {rec.submissionDate}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge
                      status={rec.displayStatus}
                      variant={REVIEW_STATUS_VARIANTS[rec.displayStatus] || 'red'}
                      showDot
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/pm/failure-review/report?pmId=${encodeURIComponent(rec.pmId)}`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Report</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-sm text-[#64748b]">
                    No failed PM records match your current search or filters.
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
    </div>
  );
};

export default PMFailureReview;
