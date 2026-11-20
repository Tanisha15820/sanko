import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  Building2,
  CheckCircle2,
  Search,
  RotateCcw,
  Eye,
  X,
  Clock,
  ArrowUpCircle,
  Check,
  Wrench,
  History,
  SlidersHorizontal,
} from 'lucide-react';

const priorityBadgeStyle = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'bg-[#feeceb] text-[#b91c1c]';
    case 'High':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Medium':
    default:
      return 'bg-[#eef4ff] text-[#0b57d0]';
  }
};

const levelBadgeStyle = (level) => {
  if (level === 'Top-Level Management') {
    return 'bg-[#feeceb] text-[#b91c1c] border border-[#fecaca]';
  }
  return 'bg-[#eef4ff] text-[#0b57d0] border border-[#dce7ff]';
};

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'Escalated to Top Management':
      return 'bg-[#feeceb] text-[#b91c1c]';
    case 'In Progress':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Under Review':
      return 'bg-[#eef4ff] text-[#0b57d0]';
    case 'Resolved':
      return 'bg-[#e8f8ef] text-[#15803d]';
    case 'Pending':
    default:
      return 'bg-[#f1f5f9] text-[#475569]';
  }
};

const formatDuration = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
};

const EscalationManagement = ({
  escalations = [],
  criticalDurationMins = 90,
  onChangeCriticalDuration,
  onEscalateToTop,
  onUpdateEscalation,
  onResolveEscalation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [machineFilter, setMachineFilter] = useState('All Machines');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('');

  const [selectedEscalationId, setSelectedEscalationId] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    recoveryEta: '',
    rootCause: '',
    resourceBottlenecks: '',
    repairProgress: '',
    remarks: '',
  });
  const [saveBanner, setSaveBanner] = useState(false);

  const selectedEscalation =
    escalations.find((e) => e.escalationId === selectedEscalationId) || null;

  // Summary Counts
  const totalCount = escalations.length;
  const activeCount = escalations.filter((e) => e.status !== 'Resolved').length;
  const midLevelCount = escalations.filter(
    (e) => e.escalationLevel === 'Mid-Level Management' && e.status !== 'Resolved'
  ).length;
  const topLevelCount = escalations.filter(
    (e) => e.escalationLevel === 'Top-Level Management' && e.status !== 'Resolved'
  ).length;
  const resolvedCount = escalations.filter((e) => e.status === 'Resolved').length;

  const summaryCards = [
    {
      id: 1,
      title: 'Total Escalations',
      value: String(totalCount),
      support: 'All tracked breakdown cases',
      icon: ShieldAlert,
      iconBg: 'bg-[#eef4ff] text-[#0b57d0]',
    },
    {
      id: 2,
      title: 'Active Escalations',
      value: String(activeCount),
      support: 'Ongoing recovery monitoring',
      icon: AlertTriangle,
      iconBg: 'bg-[#fff4e5] text-[#ea580c]',
    },
    {
      id: 3,
      title: 'Mid-Level Escalations',
      value: String(midLevelCount),
      support: 'Shift & Maintenance Manager',
      icon: Users,
      iconBg: 'bg-[#f3eefe] text-[#7c3aed]',
    },
    {
      id: 4,
      title: 'Top-Level Escalations',
      value: String(topLevelCount),
      support: 'Plant Head & Operations',
      icon: Building2,
      iconBg: 'bg-[#feeceb] text-[#dc2626]',
    },
    {
      id: 5,
      title: 'Resolved Escalations',
      value: String(resolvedCount),
      support: 'Restored & closed incidents',
      icon: CheckCircle2,
      iconBg: 'bg-[#e8f8ef] text-[#16a34a]',
    },
  ];

  // Filtered Escalations
  const filteredEscalations = escalations.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.escalationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.breakdownId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.machineName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMachine =
      machineFilter === 'All Machines' || item.machineId === machineFilter;
    const matchesPriority =
      priorityFilter === 'All Priorities' || item.priority === priorityFilter;
    const matchesLevel =
      levelFilter === 'All Levels' || item.escalationLevel === levelFilter;
    const matchesRole =
      roleFilter === 'All Roles' || item.assignedRole === roleFilter;
    const matchesStatus =
      statusFilter === 'All Status' || item.status === statusFilter;
    const matchesDate = !dateFilter || item.startDate === dateFilter;

    return (
      matchesSearch &&
      matchesMachine &&
      matchesPriority &&
      matchesLevel &&
      matchesRole &&
      matchesStatus &&
      matchesDate
    );
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setMachineFilter('All Machines');
    setPriorityFilter('All Priorities');
    setLevelFilter('All Levels');
    setRoleFilter('All Roles');
    setStatusFilter('All Status');
    setDateFilter('');
  };

  const handleOpenDetails = (item) => {
    setSelectedEscalationId(item.escalationId);
    setEditForm({
      status: item.status,
      recoveryEta: item.recoveryEta,
      rootCause: item.rootCause,
      resourceBottlenecks: item.resourceBottlenecks,
      repairProgress: item.repairProgress,
      remarks: item.remarks || '',
    });
    setSaveBanner(false);
  };

  const handleSaveUpdates = (e) => {
    e.preventDefault();
    if (!selectedEscalation) return;
    if (onUpdateEscalation) {
      onUpdateEscalation(selectedEscalation.escalationId, editForm);
    }
    setSaveBanner(true);
  };

  const handleMarkResolved = () => {
    if (!selectedEscalation) return;
    if (onResolveEscalation) {
      onResolveEscalation(selectedEscalation.escalationId);
    }
    setEditForm((prev) => ({ ...prev, status: 'Resolved', repairProgress: '100% Completed' }));
    setSaveBanner(true);
  };

  return (
    <div className="space-y-5">
      {/* 5 Summary KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-all flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold text-[#475569] truncate">
                  {card.title}
                </p>
                <h3 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] leading-tight mt-0.5 tracking-tight">
                  {card.value}
                </h3>
                <p className="text-[11px] font-medium text-[#94a3b8] truncate mt-0.5">
                  {card.support}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Escalation Hierarchy & Configurable Critical Duration Rule Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Mid-Level Management Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0b57d0] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#0b57d0]">
              Level 1 • Initial Assignment
            </span>
            <h4 className="text-sm font-extrabold text-[#0f172a] mt-0.5">
              Mid-Level Management
            </h4>
            <p className="text-xs text-[#64748b] mt-1">
              Roles: <strong className="text-[#334155]">Shift Manager • Maintenance Manager</strong>
            </p>
            <p className="text-[11px] text-[#94a3b8] mt-1">
              Notified immediately when a machine breakdown is logged.
            </p>
          </div>
        </div>

        {/* Top-Level Management Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#feeceb] text-[#dc2626] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#dc2626]">
              Level 2 • Critical Duration Exceeded
            </span>
            <h4 className="text-sm font-extrabold text-[#0f172a] mt-0.5">
              Top-Level Management
            </h4>
            <p className="text-xs text-[#64748b] mt-1">
              Roles: <strong className="text-[#334155]">Plant Head • Operations Leadership</strong>
            </p>
            <p className="text-[11px] text-[#94a3b8] mt-1">
              Auto-escalated when downtime exceeds the critical threshold.
            </p>
          </div>
        </div>

        {/* Configurable Critical Duration Threshold Control */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#ea580c]">
                Auto-Escalation Threshold
              </span>
              <h4 className="text-sm font-extrabold text-[#0f172a] mt-0.5">
                Configurable Critical Duration
              </h4>
            </div>
            <SlidersHorizontal className="w-4 h-4 text-[#0b57d0]" />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#64748b]">
              Escalate unresolved after:
            </span>
            <select
              value={criticalDurationMins}
              onChange={(e) =>
                onChangeCriticalDuration &&
                onChangeCriticalDuration(Number(e.target.value))
              }
              className="h-9 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-extrabold text-[#0b57d0] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
            >
              <option value={30}>30 Mins (0h 30m)</option>
              <option value={45}>45 Mins (0h 45m)</option>
              <option value={60}>60 Mins (1h 00m)</option>
              <option value={90}>90 Mins (1h 30m)</option>
              <option value={120}>120 Mins (2h 00m)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 flex-1">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Search Escalations
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Escalation ID, Breakdown ID, Machine..."
                  className="w-full h-10 pl-9 pr-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:bg-white focus:border-[#0b57d0]"
                />
              </div>
            </div>

            {/* Machine */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Machine
              </label>
              <select
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
                className="w-full h-10 px-2.5 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {[
                  'All Machines',
                  'IMM-01',
                  'IMM-02',
                  'IMM-04',
                  'IMM-06',
                  'IMM-08',
                  'IMM-10',
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full h-10 px-2.5 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {['All Priorities', 'Critical', 'High', 'Medium'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Escalation Level */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Escalation Level
              </label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full h-10 px-2.5 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {['All Levels', 'Mid-Level Management', 'Top-Level Management'].map(
                  (lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Assigned Management Role */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Management Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full h-10 px-2.5 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {[
                  'All Roles',
                  'Shift Manager & Maintenance Manager',
                  'Plant Head & Operations Leadership',
                ].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Escalation Status */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Escalation Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-2.5 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {[
                  'All Status',
                  'Pending',
                  'Under Review',
                  'In Progress',
                  'Escalated to Top Management',
                  'Resolved',
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
            />

            <button
              type="button"
              onClick={handleResetFilters}
              className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      {/* Escalation List Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              Breakdown Escalation &amp; Recovery Monitor
            </h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Unresolved breakdowns exceeding {formatDuration(criticalDurationMins)} are automatically escalated from Mid-Level Management to Top-Level Management
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#feeceb] text-[#b91c1c] text-xs font-bold self-start sm:self-auto">
            Critical Threshold: {formatDuration(criticalDurationMins)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-4">Escalation ID</th>
                <th className="py-3.5 px-4">Breakdown ID</th>
                <th className="py-3.5 px-4">Machine</th>
                <th className="py-3.5 px-4 min-w-[200px]">Breakdown Description</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Current Escalation Level</th>
                <th className="py-3.5 px-4">Assigned Management Role</th>
                <th className="py-3.5 px-4">Start Time</th>
                <th className="py-3.5 px-4">Downtime</th>
                <th className="py-3.5 px-4">Recovery ETA</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredEscalations.map((item) => (
                <tr key={item.escalationId} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0f172a] whitespace-nowrap">
                    {item.escalationId}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0b57d0] whitespace-nowrap">
                    {item.breakdownId}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#0f172a] block">{item.machineId}</span>
                    <span className="text-xs text-[#64748b]">{item.machineName}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#475569] max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${priorityBadgeStyle(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${levelBadgeStyle(
                        item.escalationLevel
                      )}`}
                    >
                      {item.escalationLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-[#334155] whitespace-nowrap">
                    {item.assignedRole}
                  </td>
                  <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                    {item.startTime}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#0f172a] whitespace-nowrap">
                    {formatDuration(item.downtimeMinutes)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#0b57d0] whitespace-nowrap">
                    {item.recoveryEta}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                    {item.status !== 'Resolved' &&
                      item.escalationLevel === 'Mid-Level Management' && (
                        <button
                          type="button"
                          onClick={() =>
                            onEscalateToTop && onEscalateToTop(item.escalationId)
                          }
                          title="Simulate critical duration exceeded & escalate to Top-Level Management"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#feeceb] hover:bg-[#dc2626] text-[#b91c1c] hover:text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                          <span>Escalate</span>
                        </button>
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
              ))}
              {filteredEscalations.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-10 text-center text-sm text-[#64748b]">
                    No escalation records match your selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Escalation Details & Recovery Management Modal */}
      {selectedEscalation && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                  {selectedEscalation.escalationId}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">
                    {selectedEscalation.machineId} — {selectedEscalation.machineName} (
                    {selectedEscalation.breakdownId})
                  </h3>
                  <p className="text-xs text-[#64748b]">
                    Assigned to: <strong>{selectedEscalation.assignedRole}</strong>
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadgeStyle(
                    selectedEscalation.status
                  )}`}
                >
                  {selectedEscalation.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEscalationId(null)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* 1. Breakdown Information & 2. Escalation Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Breakdown Information */}
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7] space-y-2.5">
                  <h4 className="font-extrabold text-[#0f172a] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
                    <span>Breakdown Information</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <p className="text-[#64748b]">Escalation / Breakdown ID</p>
                      <p className="font-bold text-[#0f172a] mt-0.5">
                        {selectedEscalation.escalationId} / {selectedEscalation.breakdownId}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748b]">Machine</p>
                      <p className="font-bold text-[#0b57d0] mt-0.5">
                        {selectedEscalation.machineId} — {selectedEscalation.machineName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748b]">Breakdown Priority</p>
                      <span
                        className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold ${priorityBadgeStyle(
                          selectedEscalation.priority
                        )}`}
                      >
                        {selectedEscalation.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#64748b]">Start Date &amp; Time</p>
                      <p className="font-semibold text-[#0f172a] mt-0.5">
                        {selectedEscalation.startTime}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[#64748b]">Breakdown Description</p>
                      <p className="font-semibold text-[#0f172a] mt-0.5">
                        {selectedEscalation.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Escalation Information */}
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7] space-y-2.5">
                  <h4 className="font-extrabold text-[#0f172a] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#0b57d0]" />
                    <span>Escalation Information</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <p className="text-[#64748b]">Current Escalation Level</p>
                      <span
                        className={`inline-block mt-0.5 px-2 py-0.5 rounded-lg text-[10.5px] font-bold ${levelBadgeStyle(
                          selectedEscalation.escalationLevel
                        )}`}
                      >
                        {selectedEscalation.escalationLevel}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#64748b]">Assigned Management Role</p>
                      <p className="font-bold text-[#0f172a] mt-0.5">
                        {selectedEscalation.assignedRole}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748b]">Escalation Date &amp; Time</p>
                      <p className="font-semibold text-[#0f172a] mt-0.5">
                        {selectedEscalation.escalationDateTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748b]">Critical Duration Threshold</p>
                      <p className="font-bold text-[#dc2626] mt-0.5">
                        {formatDuration(criticalDurationMins)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748b]">Total Downtime Duration</p>
                      <p className="font-extrabold text-[#0f172a] mt-0.5">
                        {formatDuration(selectedEscalation.downtimeMinutes)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#64748b]">Resolution Date &amp; Time</p>
                      <p className="font-semibold text-[#15803d] mt-0.5">
                        {selectedEscalation.resolutionDateTime || 'Pending Resolution'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Recovery Information & Update Escalation Form + 4. Escalation History */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Editable Recovery & Escalation Information Form (7 cols) */}
                <form
                  onSubmit={handleSaveUpdates}
                  className="lg:col-span-7 p-4 rounded-xl bg-[#eef4ff]/45 border border-[#dce7ff] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-[#0f172a] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-[#0b57d0]" />
                      <span>Recovery Information &amp; Management Update</span>
                    </h4>
                    {saveBanner && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803d]">
                        <Check className="w-3.5 h-3.5" /> Updated
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">
                        Escalation Status
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                        className="w-full h-9 px-2.5 bg-white border border-[#cbd5e1] rounded-xl font-bold text-[#0f172a]"
                      >
                        {[
                          'Pending',
                          'Under Review',
                          'In Progress',
                          'Escalated to Top Management',
                          'Resolved',
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">
                        Recovery ETA
                      </label>
                      <input
                        type="text"
                        value={editForm.recoveryEta}
                        onChange={(e) =>
                          setEditForm({ ...editForm, recoveryEta: e.target.value })
                        }
                        className="w-full h-9 px-2.5 bg-white border border-[#cbd5e1] rounded-xl font-bold text-[#0b57d0]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">
                        Technician Assigned
                      </label>
                      <input
                        type="text"
                        value={selectedEscalation.technician}
                        disabled
                        className="w-full h-9 px-2.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-xl font-semibold text-[#475569]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">
                        Root Cause Analysis
                      </label>
                      <input
                        type="text"
                        value={editForm.rootCause}
                        onChange={(e) =>
                          setEditForm({ ...editForm, rootCause: e.target.value })
                        }
                        className="w-full h-9 px-2.5 bg-white border border-[#cbd5e1] rounded-xl font-medium text-[#0f172a]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">
                        Resource Bottlenecks
                      </label>
                      <input
                        type="text"
                        value={editForm.resourceBottlenecks}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            resourceBottlenecks: e.target.value,
                          })
                        }
                        className="w-full h-9 px-2.5 bg-white border border-[#cbd5e1] rounded-xl font-medium text-[#0f172a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">
                        Repair Progress
                      </label>
                      <input
                        type="text"
                        value={editForm.repairProgress}
                        onChange={(e) =>
                          setEditForm({ ...editForm, repairProgress: e.target.value })
                        }
                        className="w-full h-9 px-2.5 bg-white border border-[#cbd5e1] rounded-xl font-bold text-[#0f172a]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">
                        Management / Maintenance Remarks
                      </label>
                      <input
                        type="text"
                        value={editForm.remarks}
                        onChange={(e) =>
                          setEditForm({ ...editForm, remarks: e.target.value })
                        }
                        placeholder="Add leadership directive or repair notes..."
                        className="w-full h-9 px-2.5 bg-white border border-[#cbd5e1] rounded-xl font-medium text-[#0f172a]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-xs transition-all cursor-pointer"
                      >
                        Save Recovery Updates
                      </button>

                      {selectedEscalation.status !== 'Resolved' &&
                        selectedEscalation.escalationLevel === 'Mid-Level Management' && (
                          <button
                            type="button"
                            onClick={() =>
                              onEscalateToTop &&
                              onEscalateToTop(selectedEscalation.escalationId)
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#feeceb] hover:bg-[#dc2626] text-[#b91c1c] hover:text-white font-bold transition-all cursor-pointer"
                          >
                            <ArrowUpCircle className="w-3.5 h-3.5" />
                            <span>Escalate to Top Management</span>
                          </button>
                        )}
                    </div>

                    {selectedEscalation.status !== 'Resolved' && (
                      <button
                        type="button"
                        onClick={handleMarkResolved}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Escalation as Resolved</span>
                      </button>
                    )}
                  </div>
                </form>

                {/* Chronological Escalation History Timeline (5 cols) */}
                <div className="lg:col-span-5 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7] flex flex-col">
                  <h4 className="font-extrabold text-[#0f172a] uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-[#0b57d0]" />
                    <span>Chronological Escalation History</span>
                  </h4>

                  <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
                    {selectedEscalation.history.map((h, i) => (
                      <div
                        key={i}
                        className="relative pl-4 border-l-2 border-[#0b57d0]/30 py-0.5"
                      >
                        <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#0b57d0]" />
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-[#0f172a]">{h.event}</span>
                          <span className="text-[10.5px] font-semibold text-[#64748b]">
                            {h.dateTime}
                          </span>
                        </div>
                        <p className="text-[#475569] mt-0.5 leading-snug">{h.description}</p>
                        <span className="text-[10.5px] font-bold text-[#0b57d0] mt-0.5 block">
                          Role / Person: {h.responsible}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#f8fafc] border-t border-[#edf1f7] flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedEscalationId(null)}
                className="px-5 py-2 rounded-xl border border-[#d6deeb] text-xs font-bold text-[#475569] hover:bg-white cursor-pointer"
              >
                Close Escalation Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscalationManagement;
