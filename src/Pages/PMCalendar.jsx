import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Plus,
  X,
} from 'lucide-react';

const machineCatalog = [
  { id: 'IMM-01', name: 'Toshiba 180T Injection', line: 'Line A - Automotive' },
  { id: 'IMM-02', name: 'Sumitomo 220T High-Speed', line: 'Line A - Automotive' },
  { id: 'IMM-03', name: 'Fanuc Roboshot 150T', line: 'Line A - Automotive' },
  { id: 'IMM-04', name: 'Toshiba 250T Servo', line: 'Line B - Interior Trim' },
  { id: 'IMM-05', name: 'Nissei 350T Precision', line: 'Line B - Interior Trim' },
  { id: 'IMM-06', name: 'JSW 450T Heavy Mold', line: 'Line C - Bumper Line' },
  { id: 'IMM-07', name: 'Engel 300T Duo', line: 'Line C - Bumper Line' },
  { id: 'IMM-08', name: 'Sumitomo 180T Electric', line: 'Line D - Precision Gear' },
  { id: 'IMM-09', name: 'Fanuc Roboshot 100T', line: 'Line D - Precision Gear' },
  { id: 'IMM-10', name: 'Toshiba 350T Hydraulic', line: 'Line D - Precision Gear' },
];

const engineerOptions = [
  'Karan Mehta',
  'Rohan Sharma',
  'Deepak Patel',
  'Suresh Nair',
  'Vikram Singh',
];

const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Cycle-based'];

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

const initialFormState = {
  scheduledDate: '2026-11-21',
  scheduledTime: '10:00',
  machineId: 'IMM-01',
  frequency: 'Weekly',
  engineer: 'Karan Mehta',
  status: 'Upcoming',
  notes: '',
};

const PMCalendar = ({ pmTasks = [], onAddPmTask }) => {
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

  // Add PM Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

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

    return (
      matchesLine &&
      matchesMachine &&
      matchesEngineer &&
      matchesFreq &&
      matchesStatus
    );
  });

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

  const handleAddPmSubmit = (e) => {
    e.preventDefault();
    if (!formData.scheduledDate || !formData.machineId) return;

    const selectedMachine =
      machineCatalog.find((m) => m.id === formData.machineId) || machineCatalog[0];
    const nextNumber = 401 + pmTasks.length + Math.floor(Math.random() * 50);

    const newTask = {
      pmId: `PM-2026-${nextNumber}`,
      machineId: selectedMachine.id,
      machineName: selectedMachine.name,
      line: selectedMachine.line,
      frequency: formData.frequency,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      engineer: formData.engineer,
      status: formData.status,
      notes: formData.notes.trim(),
    };

    if (onAddPmTask) {
      onAddPmTask(newTask);
    }

    // Jump calendar view to the newly added PM date's month/year
    const [yr, mo] = formData.scheduledDate.split('-').map(Number);
    if (yr && mo) {
      setCurrentYear(yr);
      setCurrentMonth(mo - 1);
    }

    setFormData(initialFormState);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Filters & Add PM Action Bar */}
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
                {['All Machines', ...machineCatalog.map((m) => m.id)].map((m) => (
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
                {['All Engineers', ...engineerOptions].map((eng) => (
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
                {['All Frequencies', ...frequencyOptions].map((freq) => (
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

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add PM</span>
            </button>
          </div>
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
                        title={`${task.pmId}: ${task.machineName}${
                          task.scheduledTime ? ` at ${task.scheduledTime}` : ''
                        } (${task.frequency} - ${task.status})`}
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
                          {task.machineId}
                          {task.scheduledTime ? ` (${task.scheduledTime})` : ''} • {task.frequency}
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

      {/* Add PM Popup Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a]">
                  Schedule New Preventive Maintenance
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Enter date, time, machine, and PM schedule details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddPmSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))
                    }
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                    Scheduled Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, scheduledTime: e.target.value }))
                    }
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  />
                </div>
              </div>

              {/* Machine ID */}
              <div>
                <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                  Machine ID *
                </label>
                <select
                  required
                  value={formData.machineId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, machineId: e.target.value }))
                  }
                  className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  {machineCatalog.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} — {m.name} ({m.line})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PM Frequency */}
                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                    PM Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, frequency: e.target.value }))
                    }
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                  >
                    {frequencyOptions.map((freq) => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned Engineer */}
                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                    Assigned Engineer
                  </label>
                  <select
                    value={formData.engineer}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, engineer: e.target.value }))
                    }
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                  >
                    {engineerOptions.map((eng) => (
                      <option key={eng} value={eng}>
                        {eng}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  {['Upcoming', 'Due Today', 'Overdue', 'Completed'].map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                  Maintenance Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Enter inspection scope, mold prep, or special instructions..."
                  className="w-full p-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0] resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#475569] text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-bold shadow-[0_4px_12px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
                >
                  Save PM Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PMCalendar;
