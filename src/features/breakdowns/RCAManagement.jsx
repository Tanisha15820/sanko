import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Eye,
  RefreshCw,
  Calendar,
  AlertTriangle,
  ClipboardCheck,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBreakdowns } from '../../context/BreakdownContext';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput from '../../components/common/SearchInput';
import {
  calculateDowntimeMinutes,
  formatDowntime,
  formatDateTimeDisplay,
} from './breakdownData';
import { RCA_STATUS_VARIANTS } from './rcaData';

const RCAManagement = () => {
  const navigate = useNavigate();
  const { activeRole, user } = useAuth();
  const {
    breakdowns,
    rcaReports,
    rcaEligibleBreakdowns,
    getRcaByBreakdownId,
  } = useBreakdowns();

  // Admin Register Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Engineer Action Plan Filters
  const [engSearch, setEngSearch] = useState('');
  const [engStatusFilter, setEngStatusFilter] = useState('All Status');

  const isAdminView = activeRole === 'Admin';
  const currentEngineerName = user?.name || 'Karan Mehta';

  // Engineer View: only breakdowns with downtime > 30 mins assigned to this engineer
  const engineerActionPlans = rcaEligibleBreakdowns
    .filter((b) => b.assignedEngineer === currentEngineerName)
    .map((b) => {
      const linkedRca = getRcaByBreakdownId(b.breakdownId);
      const rcaStatus = linkedRca ? linkedRca.status : 'RCA Required';
      const downtimeMins = calculateDowntimeMinutes(
        b.breakdownStartTime,
        b.actualRepairCompletionTime
      );
      return {
        ...b,
        linkedRca,
        rcaStatus,
        downtimeMins,
      };
    })
    .filter((row) => {
      const q = engSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        row.breakdownId.toLowerCase().includes(q) ||
        row.machineName.toLowerCase().includes(q) ||
        row.machineId.toLowerCase().includes(q) ||
        row.plantLine.toLowerCase().includes(q);
      const matchesStatus =
        engStatusFilter === 'All Status' || row.rcaStatus === engStatusFilter;
      return matchesSearch && matchesStatus;
    });

  // Admin View: Submitted & Closed RCA Reports Register
  const adminRegisterRows = rcaReports
    .filter((r) => r.status !== 'Draft')
    .map((report) => {
      const bd = breakdowns.find((b) => b.breakdownId === report.breakdownId);
      return {
        ...report,
        machineId: bd?.machineId || '—',
        machineName: bd?.machineName || report.productName || '—',
        plantLine: bd?.plantLine || '—',
      };
    })
    .filter((row) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        row.rcaId.toLowerCase().includes(q) ||
        row.breakdownId.toLowerCase().includes(q) ||
        row.machineName.toLowerCase().includes(q) ||
        row.productName.toLowerCase().includes(q) ||
        row.submittedBy.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'All Status' || row.status === statusFilter;
      const matchesFrom =
        !fromDate || (row.submissionDate && row.submissionDate >= fromDate);
      const matchesTo =
        !toDate || (row.submissionDate && row.submissionDate <= toDate);
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });

  const handleResetAdminFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setFromDate('');
    setToDate('');
  };

  const handleResetEngineerFilters = () => {
    setEngSearch('');
    setEngStatusFilter('All Status');
  };

  return (
    <div className="space-y-5">
      {/* Role Context Switcher Bar (synced with global AuthContext) */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0b57d0] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#0f172a]">
              RCA Management — {isAdminView ? 'Admin Register View' : 'Engineer Action Plans'}{' '}
              ({user?.name})
            </p>
            <p className="text-[11px] font-medium text-[#64748b] mt-0.5">
              {isAdminView
                ? 'Review submitted Root Cause Analysis reports, verify CAPA actions, and formally approve & close.'
                : 'Showing breakdowns assigned to you that exceeded 30 minutes of downtime and require RCA.'}
            </p>
          </div>
        </div>
      </section>

      {/* ==================== ADMIN VIEW: RCA REPORTS REGISTER ==================== */}
      {isAdminView ? (
        <>
          {/* Top Header & CAPA Filters Card */}
          <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                  RCA Reports
                </h2>
                <p className="text-xs font-medium text-[#64748b] mt-0.5">
                  Root Cause Analysis reports submitted for machine breakdowns.
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold self-start sm:self-auto">
                Total Records: {adminRegisterRows.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end pt-1">
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                  Search Reports
                </label>
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="RCA ID, Breakdown ID, machine, engineer..."
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
                  onClick={handleResetAdminFilters}
                  title="Refresh & Reset Filters"
                  className="h-10 px-3.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Refresh</span>
                </button>
              </div>
            </div>
          </section>

          {/* Admin RCA Reports Register Table */}
          <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3.5 px-5">RCA ID</th>
                    <th className="py-3.5 px-5">Breakdown ID</th>
                    <th className="py-3.5 px-5">Machine / Product</th>
                    <th className="py-3.5 px-5">Submitted By</th>
                    <th className="py-3.5 px-5">Submission Date</th>
                    <th className="py-3.5 px-5">Target Date</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                  {adminRegisterRows.map((row) => (
                    <tr
                      key={row.rcaId}
                      className="hover:bg-[#f8fafc]/80 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-extrabold text-[#0b57d0] whitespace-nowrap">
                        {row.rcaId}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-[#0f172a] whitespace-nowrap">
                        {row.breakdownId}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="font-semibold text-[#0f172a] block">
                          {row.machineId} — {row.machineName}
                        </span>
                        <span className="text-xs text-[#64748b]">{row.productName}</span>
                      </td>
                      <td className="py-3.5 px-5 font-medium text-[#334155] whitespace-nowrap">
                        {row.submittedBy}
                      </td>
                      <td className="py-3.5 px-5 text-[#475569] whitespace-nowrap">
                        {row.submissionDate || '—'}
                      </td>
                      <td className="py-3.5 px-5 text-[#475569] whitespace-nowrap">
                        {row.targetDate || row.targetCompletionDate || '—'}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <StatusBadge
                          status={row.status}
                          variant={RCA_STATUS_VARIANTS[row.status] || 'blue'}
                          showDot
                        />
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/breakdowns/rca/report?rcaId=${encodeURIComponent(row.rcaId)}`
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
                  {adminRegisterRows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-sm text-[#64748b]">
                        No submitted RCA reports match your current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        /* ==================== ENGINEER VIEW: RCA ACTION PLANS ==================== */
        <>
          <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <ClipboardCheck className="w-5 h-5 text-[#0b57d0] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-extrabold text-[#0f172a]">
                    RCA Action Plans
                  </h2>
                  <p className="text-xs font-medium text-[#64748b] mt-0.5">
                    Assigned breakdowns with downtime exceeding 30 minutes requiring Root Cause Analysis
                  </p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#feeceb] text-[#b91c1c] text-xs font-extrabold self-start sm:self-auto">
                {engineerActionPlans.length} Eligible Breakdown
                {engineerActionPlans.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                <div className="w-full sm:w-72">
                  <SearchInput
                    value={engSearch}
                    onChange={setEngSearch}
                    placeholder="Search breakdown ID, machine, line..."
                    variant="bordered"
                  />
                </div>
                <select
                  value={engStatusFilter}
                  onChange={(e) => setEngStatusFilter(e.target.value)}
                  className="h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  {[
                    'All Status',
                    'RCA Required',
                    'Draft',
                    'Pending Admin Review',
                    'Closed',
                  ].map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleResetEngineerFilters}
                className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Breakdown ID</th>
                    <th className="py-3.5 px-4">Machine Name</th>
                    <th className="py-3.5 px-4">Machine ID</th>
                    <th className="py-3.5 px-4">Production Line</th>
                    <th className="py-3.5 px-4">Breakdown Date</th>
                    <th className="py-3.5 px-4">Start Time</th>
                    <th className="py-3.5 px-4">Total Downtime</th>
                    <th className="py-3.5 px-4">Assigned Engineer</th>
                    <th className="py-3.5 px-4">RCA Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                  {engineerActionPlans.map((row) => {
                    const isReadOnly =
                      row.rcaStatus === 'Pending Admin Review' ||
                      row.rcaStatus === 'Closed';
                    return (
                      <tr
                        key={row.breakdownId}
                        className="hover:bg-[#f8fafc]/80 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-extrabold text-[#0b57d0] whitespace-nowrap">
                          {row.breakdownId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#0f172a] whitespace-nowrap">
                          {row.machineName}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#334155] whitespace-nowrap">
                          {row.machineId}
                        </td>
                        <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                          {row.plantLine}
                        </td>
                        <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                          {row.breakdownDate}
                        </td>
                        <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                          {formatDateTimeDisplay(row.breakdownStartTime)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-extrabold text-[#b91c1c]">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#dc2626]" />
                            {formatDowntime(row.downtimeMins)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                          {row.assignedEngineer}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge
                            status={row.rcaStatus}
                            variant={RCA_STATUS_VARIANTS[row.rcaStatus] || 'blue'}
                            showDot
                          />
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/breakdowns/rca/form?breakdownId=${encodeURIComponent(
                                  row.breakdownId
                                )}`
                              )
                            }
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isReadOnly
                                ? 'bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155]'
                                : 'bg-[#0b57d0] hover:bg-[#0947ab] text-white shadow-[0_4px_12px_rgba(11,87,208,0.2)]'
                            }`}
                          >
                            {isReadOnly ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>View RCA</span>
                              </>
                            ) : (
                              <>
                                <FileText className="w-3.5 h-3.5" />
                                <span>
                                  {row.rcaStatus === 'Draft' ? 'Continue Draft' : 'Fill RCA'}
                                </span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {engineerActionPlans.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-sm text-[#64748b]">
                        No assigned breakdowns exceeding 30 minutes of downtime found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default RCAManagement;
