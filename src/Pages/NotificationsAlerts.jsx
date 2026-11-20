import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Search,
  RotateCcw,
  Eye,
  X,
  Check,
  MailOpen,
  Mail,
  ShieldAlert,
} from 'lucide-react';

const notificationTypes = [
  'All Types',
  'Machine Breakdown Alert',
  'PM Due Reminder',
  'Overdue Maintenance',
  'Low Stock Alert',
  'Tool Maintenance Reminder',
  'Spare Part Reorder Alert',
];

const priorityBadgeStyle = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'bg-[#feeceb] text-[#b91c1c]';
    case 'High':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Medium':
      return 'bg-[#eef4ff] text-[#0b57d0]';
    case 'Low':
    default:
      return 'bg-[#f1f5f9] text-[#475569]';
  }
};

const priorityDotStyle = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'bg-[#dc2626]';
    case 'High':
      return 'bg-[#ea580c]';
    case 'Medium':
      return 'bg-[#0b57d0]';
    case 'Low':
    default:
      return 'bg-[#94a3b8]';
  }
};

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'Unread':
      return 'bg-[#eef4ff] text-[#0b57d0]';
    case 'Read':
      return 'bg-[#f1f5f9] text-[#475569]';
    case 'Resolved':
      return 'bg-[#e8f8ef] text-[#15803d]';
    default:
      return 'bg-[#f1f5f9] text-[#475569]';
  }
};

const NotificationsAlerts = ({
  notifications = [],
  onUpdateNotificationStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('');

  const [selectedNotification, setSelectedNotification] = useState(null);

  // Summary Counts
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => n.status === 'Unread').length;
  const criticalCount = notifications.filter(
    (n) => n.priority === 'Critical' && n.status !== 'Resolved'
  ).length;
  const resolvedCount = notifications.filter((n) => n.status === 'Resolved').length;

  const summaryCards = [
    {
      id: 1,
      title: 'Total Notifications',
      value: String(totalCount),
      support: 'Auto-generated plant alerts',
      icon: Bell,
      iconBg: 'bg-[#eef4ff] text-[#0b57d0]',
    },
    {
      id: 2,
      title: 'Unread Notifications',
      value: String(unreadCount),
      support: 'Awaiting review',
      icon: BellRing,
      iconBg: 'bg-[#fff4e5] text-[#ea580c]',
    },
    {
      id: 3,
      title: 'Critical Alerts',
      value: String(criticalCount),
      support: 'Active breakdown / stockout',
      icon: AlertTriangle,
      iconBg: 'bg-[#feeceb] text-[#dc2626]',
    },
    {
      id: 4,
      title: 'Resolved Notifications',
      value: String(resolvedCount),
      support: 'Acknowledged & closed',
      icon: CheckCircle2,
      iconBg: 'bg-[#e8f8ef] text-[#16a34a]',
    },
  ];

  // Filtered Notifications
  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      !searchQuery.trim() ||
      n.notificationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.relatedEntity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All Types' || n.type === typeFilter;
    const matchesPriority =
      priorityFilter === 'All Priorities' || n.priority === priorityFilter;
    const matchesStatus =
      statusFilter === 'All Status' || n.status === statusFilter;
    const matchesDate = !dateFilter || n.dateTime.slice(0, 10) === dateFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesPriority &&
      matchesStatus &&
      matchesDate
    );
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('All Types');
    setPriorityFilter('All Priorities');
    setStatusFilter('All Status');
    setDateFilter('');
  };

  const handleStatusChange = (notifId, newStatus) => {
    if (onUpdateNotificationStatus) {
      onUpdateNotificationStatus(notifId, newStatus);
    }
    if (selectedNotification && selectedNotification.notificationId === notifId) {
      setSelectedNotification((prev) => ({
        ...prev,
        status: newStatus,
      }));
    }
  };

  return (
    <div className="space-y-5">
      {/* 4 Summary KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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

      {/* Search & Filters Section */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 flex-1">
            {/* Search by Notification ID or Title */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Search Notifications
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Notification ID or title..."
                  className="w-full h-10 pl-9 pr-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:bg-white focus:border-[#0b57d0]"
                />
              </div>
            </div>

            {/* Filter by Notification Type */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Notification Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {notificationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Priority */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Priorities', 'Critical', 'High', 'Medium', 'Low'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Notification Status */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Notification Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Status', 'Unread', 'Read', 'Resolved'].map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Date */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              />
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

      {/* Notifications Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              Notifications &amp; System Alerts
            </h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Centralized feed auto-generated from machine breakdowns, PM schedules, tooling cycles, and spare parts stock thresholds
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold self-start sm:self-auto">
            {filteredNotifications.length} Alerts Displayed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Notification ID</th>
                <th className="py-3.5 px-5">Notification Title</th>
                <th className="py-3.5 px-5">Notification Type</th>
                <th className="py-3.5 px-5 min-w-[230px]">Description</th>
                <th className="py-3.5 px-5">Related Machine / Tool / Part</th>
                <th className="py-3.5 px-5">Priority</th>
                <th className="py-3.5 px-5">Date &amp; Time</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredNotifications.map((item) => (
                <tr
                  key={item.notificationId}
                  className={`hover:bg-[#f8fafc]/80 transition-colors ${
                    item.status === 'Unread' ? 'bg-[#f8fbff]' : ''
                  }`}
                >
                  <td className="py-3.5 px-5 font-bold text-[#0f172a] whitespace-nowrap">
                    {item.notificationId}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-[#0f172a] whitespace-nowrap">
                    {item.title}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[#475569] max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-[#0b57d0] whitespace-nowrap">
                    {item.relatedEntity}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${priorityBadgeStyle(
                        item.priority
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${priorityDotStyle(
                          item.priority
                        )}`}
                      />
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[#64748b] whitespace-nowrap">
                    {item.dateTime}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedNotification(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredNotifications.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-sm text-[#64748b]">
                    No notifications match your current search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Notification Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                  {selectedNotification.notificationId}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${priorityBadgeStyle(
                    selectedNotification.priority
                  )}`}
                >
                  {selectedNotification.priority} Priority
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadgeStyle(
                    selectedNotification.status
                  )}`}
                >
                  {selectedNotification.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <p className="text-[#64748b] font-semibold">
                  {selectedNotification.type}
                </p>
                <h3 className="text-base font-extrabold text-[#0f172a] mt-0.5">
                  {selectedNotification.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                <div>
                  <p className="text-[#64748b]">Related Machine / Tool / Spare Part</p>
                  <p className="text-sm font-extrabold text-[#0b57d0] mt-0.5">
                    {selectedNotification.relatedEntity}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Generated Date &amp; Time</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {selectedNotification.dateTime}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#334155] mb-1.5">Full Description</p>
                <div className="p-3.5 rounded-xl bg-[#f4f7fb] text-[#334155] leading-relaxed">
                  {selectedNotification.description}
                </div>
              </div>

              <div>
                <p className="font-bold text-[#334155] mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#0b57d0]" />
                  <span>Recommended Action</span>
                </p>
                <div className="p-3.5 rounded-xl bg-[#eef4ff]/60 border border-[#dce7ff] text-[#0f172a] font-semibold leading-relaxed">
                  {selectedNotification.recommendedAction}
                </div>
              </div>

              {/* Status Action Buttons: Mark as Read, Mark as Unread, Resolve Notification */}
              <div className="pt-3 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(selectedNotification.notificationId, 'Read')
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedNotification.status === 'Read'
                        ? 'bg-[#0b57d0] text-white'
                        : 'bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155]'
                    }`}
                  >
                    <MailOpen className="w-3.5 h-3.5" />
                    <span>Mark as Read</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(selectedNotification.notificationId, 'Unread')
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedNotification.status === 'Unread'
                        ? 'bg-[#0b57d0] text-white'
                        : 'bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Mark as Unread</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(selectedNotification.notificationId, 'Resolved')
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolve Notification</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] text-xs font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsAlerts;
