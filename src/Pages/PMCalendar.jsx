import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  ClipboardCheck,
  ArrowUpRight,
} from 'lucide-react';

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-[#e8f8ef] text-[#15803d]';
    case 'Due Today':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Overdue':
      return 'bg-[#feeceb] text-[#b91c1c]';
    case 'Upcoming':
    default:
      return 'bg-[#eef4ff] text-[#0b57d0]';
  }
};

const statusDotStyle = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-[#16a34a]';
    case 'Due Today':
      return 'bg-[#ea580c]';
    case 'Overdue':
      return 'bg-[#dc2626]';
    case 'Upcoming':
    default:
      return 'bg-[#0b57d0]';
  }
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PMCalendar = ({ pmTasks = [] }) => {
  const navigate = useNavigate();

  // Default to November 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 10 = November

  // Filters
  const [lineFilter, setLineFilter] = useState('All Lines');
  const [machineFilter, setMachineFilter] = useState('All Machines');
  const [engineerFilter, setEngineerFilter] = useState('All Engineers');
  const [frequencyFilter, setFrequencyFilter] = useState('All Frequencies');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter PM Tasks
  const filteredTasks = pmTasks.filter((task) => {
    const matchesLine = lineFilter === 'All Lines' || task.line === lineFilter;
    const matchesMachine =
      machineFilter === 'All Machines' || task.machineId === machineFilter;
    const matchesEngineer =
      engineerFilter === 'All Engineers' || task.engineer === engineerFilter;
    const matchesFreq =
      frequencyFilter === 'All Frequencies' || task.frequency === frequencyFilter;
    const matchesStatus =
      statusFilter === 'All Status' || task.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      task.pmId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.engineer.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesLine &&
      matchesMachine &&
      matchesEngineer &&
      matchesFreq &&
      matchesStatus &&
      matchesSearch
    );
  });

  // Summary Counts
  const totalScheduled = pmTasks.length;
  const upcomingCount = pmTasks.filter((t) => t.status === 'Upcoming').length;
  const dueTodayCount = pmTasks.filter((t) => t.status === 'Due Today').length;
  const overdueCount = pmTasks.filter((t) => t.status === 'Overdue').length;
  const completedCount = pmTasks.filter((t) => t.status === 'Completed').length;

  const summaryCards = [
    {
      id: 1,
      title: 'Total Scheduled PM',
      value: String(totalScheduled),
      support: 'Monthly master plan',
      icon: CalendarIcon,
      iconBg: 'bg-[#eef4ff] text-[#0b57d0]',
    },
    {
      id: 2,
      title: 'Upcoming PM',
      value: String(upcomingCount),
      support: 'Planned future tasks',
      icon: CalendarClock,
      iconBg: 'bg-[#f3eefe] text-[#7c3aed]',
    },
    {
      id: 3,
      title: 'Due Today',
      value: String(dueTodayCount),
      support: 'Requires shift action',
      icon: Clock,
      iconBg: 'bg-[#fff4e5] text-[#ea580c]',
    },
    {
      id: 4,
      title: 'Overdue PM',
      value: String(overdueCount),
      support: 'High priority backlog',
      icon: AlertTriangle,
      iconBg: 'bg-[#feeceb] text-[#dc2626]',
    },
    {
      id: 5,
      title: 'Completed PM',
      value: String(completedCount),
      support: 'Signed off & verified',
      icon: CheckCircle2,
      iconBg: 'bg-[#e8f8ef] text-[#16a34a]',
    },
  ];

  // Calendar Navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(10);
  };

  const handleResetFilters = () => {
    setLineFilter('All Lines');
    setMachineFilter('All Machines');
    setEngineerFilter('All Engineers');
    setFrequencyFilter('All Frequencies');
    setStatusFilter('All Status');
    setSearchQuery('');
  };

  // Build Calendar Grid Cells
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const getTasksForDay = (day) => {
    if (!day) return [];
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${mm}-${dd}`;
    return filteredTasks.filter((t) => t.scheduledDate === dateStr);
  };

  const handleOpenChecklist = (task) => {
    navigate(`/pm/checklist?pmId=${task.pmId}`);
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

      {/* Filters Section */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 flex-1">
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Production Line
              </label>
              <select
                value={lineFilter}
                onChange={(e) => setLineFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {[
                  'All Lines',
                  'Line A - Automotive',
                  'Line B - Interior Trim',
                  'Line C - Bumper Line',
                  'Line D - Precision Gear',
                ].map((line) => (
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
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
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
                Assigned Engineer
              </label>
              <select
                value={engineerFilter}
                onChange={(e) => setEngineerFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {[
                  'All Engineers',
                  'Karan Mehta',
                  'Rohan Sharma',
                  'Deepak Patel',
                  'Suresh Nair',
                  'Vikram Singh',
                ].map((eng) => (
                  <option key={eng} value={eng}>
                    {eng}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                PM Frequency
              </label>
              <select
                value={frequencyFilter}
                onChange={(e) => setFrequencyFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Frequencies', 'Daily', 'Weekly', 'Monthly', 'Cycle-based'].map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
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
                {['All Status', 'Upcoming', 'Due Today', 'Overdue', 'Completed'].map((st) => (
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
            <span>Reset</span>
          </button>
        </div>
      </section>

      {/* Monthly Calendar View */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Click any scheduled PM chip on the calendar to open its digital inspection checklist
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden md:flex items-center gap-3 mr-2 text-xs font-semibold text-[#475569]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0b57d0]" /> Upcoming
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" /> Due Today
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#dc2626]" /> Overdue
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16a34a]" /> Completed
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] transition-colors cursor-pointer"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="px-3.5 py-1.5 rounded-xl bg-[#0b57d0] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] transition-colors cursor-pointer"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-bold text-[#64748b] uppercase tracking-wider py-1.5"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              const dayTasks = getTasksForDay(day);
              const isToday = currentYear === 2026 && currentMonth === 10 && day === 20;

              if (!day) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-24 sm:min-h-28 rounded-xl bg-[#f8fafc]/50 border border-transparent"
                  />
                );
              }

              return (
                <div
                  key={day}
                  className={`min-h-24 sm:min-h-28 rounded-xl p-2 border transition-all flex flex-col justify-between ${
                    isToday
                      ? 'bg-[#f4f8ff] border-[#0b57d0] shadow-[0_2px_10px_rgba(11,87,208,0.08)]'
                      : 'bg-white border-[#edf1f7] hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isToday ? 'bg-[#0b57d0] text-white' : 'text-[#334155]'
                      }`}
                    >
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-extrabold text-[#0b57d0] uppercase hidden sm:inline">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1.5">
                    {dayTasks.map((task) => (
                      <button
                        key={task.pmId}
                        type="button"
                        onClick={() => handleOpenChecklist(task)}
                        title={`${task.pmId}: ${task.machineName} (${task.frequency} - ${task.status})`}
                        className={`w-full text-left px-2 py-1 rounded-lg text-[10.5px] font-bold truncate flex items-center gap-1.5 transition-transform hover:scale-[1.02] cursor-pointer ${statusBadgeStyle(
                          task.status
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDotStyle(
                            task.status
                          )}`}
                        />
                        <span className="truncate">
                          {task.machineId} • {task.frequency}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PM Task List Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">Scheduled PM Task List</h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Click any PM task row or action button to open its digital PM Checklist
            </p>
          </div>

          <div className="relative w-full sm:w-68">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PM ID, machine, engineer..."
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
                <th className="py-3.5 px-5">PM Type / Frequency</th>
                <th className="py-3.5 px-5">Scheduled Date</th>
                <th className="py-3.5 px-5">Assigned Engineer</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13.5px]">
              {filteredTasks.map((task) => (
                <tr
                  key={task.pmId}
                  onClick={() => handleOpenChecklist(task)}
                  className="hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-5 font-bold text-[#0f172a] whitespace-nowrap">
                    {task.pmId}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-[#0b57d0] whitespace-nowrap">
                    {task.machineId}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap group-hover:text-[#0b57d0] transition-colors">
                    {task.machineName}
                  </td>
                  <td className="py-3.5 px-5 text-[#64748b] whitespace-nowrap">
                    {task.line}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                      {task.frequency}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[#475569] font-medium whitespace-nowrap">
                    {task.scheduledDate}
                  </td>
                  <td className="py-3.5 px-5 text-[#334155] font-medium whitespace-nowrap">
                    {task.engineer}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeStyle(
                        task.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDotStyle(task.status)}`}
                      />
                      {task.status}
                    </span>
                  </td>
                  <td
                    className="py-3.5 px-5 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenChecklist(task)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>Open Checklist</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-sm text-[#64748b]">
                    No scheduled PM tasks match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PMCalendar;
