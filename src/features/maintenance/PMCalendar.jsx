import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Plus,
  Lock,
  UserCheck,
  Edit3,
  ClipboardCheck,
} from 'lucide-react';
import { useMaintenance } from '../../context/MaintenanceContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import {
  TECHNICIAN_OPTIONS,
  ENGINEER_OPTIONS,
  PM_STATUSES,
  CHECKLIST_STATUS_VARIANTS,
} from './pmChecklistData';

const CALENDAR_TECH_STORAGE_KEY = 'pm_calendar_test_technician';

const readSessionValue = (key, fallback) => {
  try {
    return window.sessionStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const writeSessionValue = (key, value) => {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore storage access errors
  }
};

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

const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Cycle-based'];

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'Completed':
    case 'Closed':
      return 'bg-[#e8f8ef] text-[#15803d]';
    case 'Draft':
      return 'bg-[#f1f5f9] text-[#475569]';
    case 'Failed / Pending Admin Review':
      return 'bg-[#feeceb] text-[#b91c1c]';
    case 'In Progress':
      return 'bg-[#fff4e5] text-[#c2410c]';
    case 'Scheduled':
    default:
      return 'bg-[#eef4ff] text-[#0b57d0]';
  }
};

const statusDotStyle = (status) => {
  switch (status) {
    case 'Completed':
    case 'Closed':
      return 'bg-[#16a34a]';
    case 'Draft':
      return 'bg-[#64748b]';
    case 'Failed / Pending Admin Review':
      return 'bg-[#dc2626]';
    case 'In Progress':
      return 'bg-[#ea580c]';
    case 'Scheduled':
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
  scheduledDate: '2026-11-24',
  scheduledTime: '10:00',
  machineId: 'IMM-01',
  frequency: 'Weekly',
  engineer: 'Karan Mehta',
  assignedTechnician: 'Suresh Nair',
  notes: '',
};

const PMCalendar = () => {
  const navigate = useNavigate();
  const { pmTasks, addPmTask, updatePmTask } = useMaintenance();
  const { activeRole } = useAuth();

  const [selectedTechnician, setSelectedTechnician] = useState(() =>
    readSessionValue(CALENDAR_TECH_STORAGE_KEY, 'Suresh Nair')
  );

  const isAdmin = activeRole === 'Admin';
  const isEngineer = activeRole === 'Engineer';
  const isTechnician = activeRole === 'Technician';

  // Default to November 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 10 = November

  // Filters
  const [lineFilter, setLineFilter] = useState('All Lines');
  const [machineFilter, setMachineFilter] = useState('All Machines');
  const [engineerFilter, setEngineerFilter] = useState('All Engineers');
  const [frequencyFilter, setFrequencyFilter] = useState('All Frequencies');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Add PM Modal State (Engineer only)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  // PM Details / Manage Modal (Admin read-only, Engineer can edit schedule)
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editScheduleForm, setEditScheduleForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    frequency: 'Weekly',
    assignedTechnician: 'Suresh Nair',
    notes: '',
  });

  const handleTechnicianChange = (techName) => {
    setSelectedTechnician(techName);
    writeSessionValue(CALENDAR_TECH_STORAGE_KEY, techName);
  };

  // Role-based task scoping: Technician sees ONLY PMs assigned to them
  const roleScopedTasks = isTechnician
    ? pmTasks.filter((task) => task.assignedTechnician === selectedTechnician)
    : pmTasks;

  // Machine filter options scoped to visible tasks for Technician
  const availableMachineIds = isTechnician
    ? Array.from(new Set(roleScopedTasks.map((t) => t.machineId))).sort()
    : machineCatalog.map((m) => m.id);

  // Filter PM Tasks
  const filteredTasks = roleScopedTasks.filter((task) => {
    const matchesLine = lineFilter === 'All Lines' || task.line === lineFilter;
    const matchesMachine =
      machineFilter === 'All Machines' || task.machineId === machineFilter;
    const matchesEngineer =
      isTechnician ||
      engineerFilter === 'All Engineers' ||
      task.engineer === engineerFilter;
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

  const selectedTask =
    roleScopedTasks.find((t) => t.pmId === selectedTaskId) || null;

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

  // Clicking a PM chip:
  // - Technician -> directly opens digital PM Checklist
  // - Admin / Engineer -> opens PM Details modal (Admin read-only, Engineer can manage)
  const handleChipClick = (task) => {
    if (isTechnician) {
      navigate(`/pm/checklist?pmId=${encodeURIComponent(task.pmId)}`);
      return;
    }

    setSelectedTaskId(task.pmId);
    setIsEditingSchedule(false);
    setEditScheduleForm({
      scheduledDate: task.scheduledDate,
      scheduledTime: task.scheduledTime || '10:00',
      frequency: task.frequency,
      assignedTechnician: task.assignedTechnician || 'Suresh Nair',
      notes: task.notes || '',
    });
  };

  const handleAddPmSubmit = (e) => {
    e.preventDefault();
    if (!isEngineer || !formData.scheduledDate || !formData.machineId) return;

    const selectedMachine =
      machineCatalog.find((m) => m.id === formData.machineId) || machineCatalog[0];
    const maxNum = pmTasks.reduce((max, t) => {
      const n = Number(String(t.pmId).split('-').pop());
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 410);
    const nextNumber = maxNum + 1;

    const newTask = {
      pmId: `PM-2026-${nextNumber}`,
      machineId: selectedMachine.id,
      machineName: selectedMachine.name,
      line: selectedMachine.line,
      frequency: formData.frequency,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      engineer: formData.engineer,
      assignedTechnician: formData.assignedTechnician,
      status: 'Scheduled',
      notes: formData.notes.trim(),
    };

    addPmTask(newTask);

    // Jump calendar view to the newly added PM date's month/year
    const [yr, mo] = formData.scheduledDate.split('-').map(Number);
    if (yr && mo) {
      setCurrentYear(yr);
      setCurrentMonth(mo - 1);
    }

    setFormData(initialFormState);
    setIsAddModalOpen(false);
  };

  const handleSaveScheduleEdit = (e) => {
    e.preventDefault();
    if (!isEngineer || !selectedTask) return;

    updatePmTask(selectedTask.pmId, {
      scheduledDate: editScheduleForm.scheduledDate,
      scheduledTime: editScheduleForm.scheduledTime,
      frequency: editScheduleForm.frequency,
      assignedTechnician: editScheduleForm.assignedTechnician,
      notes: editScheduleForm.notes.trim(),
    });
    setIsEditingSchedule(false);
  };

  return (
    <div className="space-y-5">
      {/* Temporary Role Switcher Tabs (Admin / Engineer / Technician) */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0b57d0] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs sm:text-sm font-extrabold text-[#0f172a]">
                PM Calendar — {activeRole} View
              </p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] text-[11px] font-bold">
                  <Lock className="w-3 h-3" />
                  Read-only view
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">
              {isAdmin &&
                'Read-only view: Viewing all scheduled PMs across all machines and Technicians. Schedule creation and editing are disabled.'}
              {isEngineer &&
                'Engineer view: View all scheduled PMs, create new PM schedules, assign Technicians, and manage existing schedules.'}
              {isTechnician &&
                `Technician view: Showing only PMs assigned to ${selectedTechnician}. Click an assigned PM chip to open its digital PM Checklist.`}
            </p>
          </div>
        </div>

        {isTechnician && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold text-[#64748b] uppercase">
                Technician:
              </label>
              <select
                value={selectedTechnician}
                onChange={(e) => handleTechnicianChange(e.target.value)}
                className="h-9 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {TECHNICIAN_OPTIONS.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      {/* Filters & Add PM Action Bar */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${isTechnician ? 'lg:grid-cols-4' : 'lg:grid-cols-5'
              } gap-3.5 flex-1`}
          >
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
                {['All Machines', ...availableMachineIds].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {!isTechnician && (
              <div>
                <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                  Assigned Engineer
                </label>
                <select
                  value={engineerFilter}
                  onChange={(e) => setEngineerFilter(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  {['All Engineers', ...ENGINEER_OPTIONS].map((eng) => (
                    <option key={eng} value={eng}>
                      {eng}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                {['All Status', ...PM_STATUSES].map((st) => (
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

            {isEngineer && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="h-10 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add PM</span>
              </button>
            )}
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
              {isTechnician
                ? `Showing ${filteredTasks.length} PM task${filteredTasks.length === 1 ? '' : 's'} assigned to ${selectedTechnician} — click a chip to open its digital PM Checklist`
                : isAdmin
                  ? `Read-only view of all ${filteredTasks.length} scheduled PM tasks — click any chip to view details`
                  : `Showing all ${filteredTasks.length} scheduled PM tasks — click any chip to view or manage schedule`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden md:flex items-center gap-3 mr-2 text-xs font-semibold text-[#475569]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0b57d0]" /> Scheduled
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" /> In Progress
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#dc2626]" /> Failed / Admin Review
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16a34a]" /> Completed / Closed
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
              const isToday = currentYear === 2026 && currentMonth === 10 && day === 24;

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
                  className={`min-h-24 sm:min-h-28 rounded-xl p-2 border transition-all flex flex-col justify-between ${isToday
                    ? 'bg-[#f4f8ff] border-[#0b57d0] shadow-[0_2px_10px_rgba(11,87,208,0.08)]'
                    : 'bg-white border-[#edf1f7] hover:border-[#cbd5e1]'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${isToday ? 'bg-[#0b57d0] text-white' : 'text-[#334155]'
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
                        onClick={() => handleChipClick(task)}
                        title={`${task.pmId}: ${task.machineName} • Tech: ${task.assignedTechnician} (${task.frequency} - ${task.status})`}
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
                          {task.scheduledTime ? ` (${task.scheduledTime})` : ''} •{' '}
                          {task.frequency}
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

      {/* Modal 1: Add PM Schedule (Engineer only) */}
      <Modal
        isOpen={isEngineer && isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Preventive Maintenance"
        subtitle="Select machine, PM date, frequency, and assign a Technician"
      >
        <form onSubmit={handleAddPmSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
              Machine *
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
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                PM Frequency *
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

            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Assign Technician *
              </label>
              <select
                required
                value={formData.assignedTechnician}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    assignedTechnician: e.target.value,
                  }))
                }
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {TECHNICIAN_OPTIONS.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
      </Modal>

      {/* Modal 2: PM Schedule Details (Admin read-only / Engineer manage) */}
      <Modal
        isOpen={Boolean(selectedTask) && !isTechnician}
        onClose={() => {
          setSelectedTaskId(null);
          setIsEditingSchedule(false);
        }}
        headerContent={
          selectedTask && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                {selectedTask.pmId}
              </span>
              <StatusBadge
                status={selectedTask.status}
                variant={CHECKLIST_STATUS_VARIANTS[selectedTask.status] || 'blue'}
                showDot
              />
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f1f5f9] text-[#475569] text-[10.5px] font-bold">
                  <Lock className="w-3 h-3" /> Read-only
                </span>
              )}
            </div>
          )
        }
      >
        {selectedTask &&
          (!isEditingSchedule ? (
            <div className="p-6 space-y-4 text-xs">
              <div>
                <p className="text-[#64748b] font-medium">Machine</p>
                <h4 className="text-base font-extrabold text-[#0f172a] mt-0.5">
                  {selectedTask.machineId} — {selectedTask.machineName}
                </h4>
                <p className="text-[#64748b] mt-0.5">{selectedTask.line}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                <div>
                  <p className="text-[#64748b]">Scheduled Date &amp; Time</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {selectedTask.scheduledDate} • {selectedTask.scheduledTime || '10:00'}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">PM Frequency</p>
                  <p className="font-bold text-[#0b57d0] mt-0.5">
                    {selectedTask.frequency}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Assigned Engineer</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {selectedTask.engineer}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Assigned Technician</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {selectedTask.assignedTechnician}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#64748b]">Notes</p>
                  <p className="font-medium text-[#334155] mt-0.5">
                    {selectedTask.notes || 'No notes recorded.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
                {isEngineer &&
                  (selectedTask.status === 'Scheduled' ||
                    selectedTask.status === 'In Progress' ||
                    selectedTask.status === 'Draft') && (
                    <button
                      type="button"
                      onClick={() => setIsEditingSchedule(true)}
                      className="px-4 py-2 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Manage Schedule</span>
                    </button>
                  )}

                <button
                  type="button"
                  onClick={() => {
                    const id = selectedTask.pmId;
                    setSelectedTaskId(null);
                    navigate(`/pm/checklist?pmId=${encodeURIComponent(id)}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>View Checklist</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTaskId(null)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveScheduleEdit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editScheduleForm.scheduledDate}
                    onChange={(e) =>
                      setEditScheduleForm((prev) => ({
                        ...prev,
                        scheduledDate: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Scheduled Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={editScheduleForm.scheduledTime}
                    onChange={(e) =>
                      setEditScheduleForm((prev) => ({
                        ...prev,
                        scheduledTime: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    PM Frequency *
                  </label>
                  <select
                    value={editScheduleForm.frequency}
                    onChange={(e) =>
                      setEditScheduleForm((prev) => ({
                        ...prev,
                        frequency: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a]"
                  >
                    {frequencyOptions.map((freq) => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Assigned Technician *
                  </label>
                  <select
                    value={editScheduleForm.assignedTechnician}
                    onChange={(e) =>
                      setEditScheduleForm((prev) => ({
                        ...prev,
                        assignedTechnician: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a]"
                  >
                    {TECHNICIAN_OPTIONS.map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">Notes</label>
                <textarea
                  rows={2}
                  value={editScheduleForm.notes}
                  onChange={(e) =>
                    setEditScheduleForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full p-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setIsEditingSchedule(false)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold cursor-pointer"
                >
                  Save Schedule Changes
                </button>
              </div>
            </form>
          ))}
      </Modal>
    </div>
  );
};

export default PMCalendar;
