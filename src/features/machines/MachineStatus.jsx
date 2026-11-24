import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Clock, CalendarCheck, ArrowUpRight, Plus } from 'lucide-react';
import { useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput from '../../components/common/SearchInput';
import TablePagination from '../../components/common/TablePagination';
import { usePagination } from '../../hooks/usePagination';

const MachineStatus = () => {
  const navigate = useNavigate();
  const { machines, addMachine } = useMachines();
  const { hasPermission } = useAuth();
  const canAddMachine = hasPermission('machines.add');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Add Machine Popup Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    line: 'Line A - Automotive',
    status: 'Running',
    runningHours: '',
    lastMaintenance: '2026-11-20',
  });

  const filteredMachines = machines.filter((machine) => {
    const matchesStatus = statusFilter === 'All' || machine.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      machine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.line.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    paginatedItems: paginatedMachines,
    setCurrentPage,
  } = usePagination(filteredMachines, 10, `${searchQuery}|${statusFilter}`);

  const handleOpenMachineDetails = (machine) => {
    navigate(`/machines/details?id=${machine.id}`, { state: { machine } });
  };

  const handleOpenAddModal = () => {
    const nextNum = String(machines.length + 1).padStart(2, '0');
    setFormData({
      id: `IMM-${nextNum}`,
      name: '',
      line: 'Line A - Automotive',
      status: 'Running',
      runningHours: '0',
      lastMaintenance: '2026-11-20',
    });
    setIsAddModalOpen(true);
  };

  const handleAddMachineSubmit = (e) => {
    e.preventDefault();

    const formattedDate = formData.lastMaintenance
      ? new Date(formData.lastMaintenance).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '20 Nov 2026';

    const rawHrs = String(formData.runningHours).trim();
    const formattedHours = rawHrs.toLowerCase().includes('hr')
      ? rawHrs
      : `${Number(rawHrs || 0).toLocaleString()} hrs`;

    const newMachine = {
      id: formData.id.trim() || `IMM-${machines.length + 1}`,
      name: formData.name.trim(),
      line: formData.line,
      status: formData.status,
      runningHours: formattedHours,
      lastMaintenance: formattedDate,
    };

    addMachine(newMachine);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Machine Status Table Section */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        {/* Table Header with Search, Status Filters, and Add Machine Button at the Right End */}
        <div className="p-6 border-b border-[#f1f5f9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-[#0f172a]">Machine Fleet Status</h3>
              <p className="text-xs font-medium text-[#64748b] mt-0.5">
                Click on any machine row or action button to inspect full machine profile &amp; telemetry
              </p>
            </div>

            {/* Add Machine Button at the far right end */}
            {canAddMachine && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Machine</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search ID, machine, or line..."
              className="w-full sm:w-64"
            />

            {/* Segmented Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', 'Running', 'Under Breakdown', 'Under Scheduled PM', 'Idle'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#0b57d0] text-white shadow-xs'
                      : 'bg-[#f3f6fb] text-[#475569] hover:text-[#0f172a]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-6">Machine ID</th>
                <th className="py-3.5 px-6">Machine Name</th>
                <th className="py-3.5 px-6">Production Line</th>
                <th className="py-3.5 px-6">Current Status</th>
                <th className="py-3.5 px-6">Running Hours</th>
                <th className="py-3.5 px-6">Last Maintenance</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13.5px]">
              {paginatedMachines.map((machine) => (
                <tr
                  key={machine.id}
                  onClick={() => handleOpenMachineDetails(machine)}
                  className="hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-6 font-bold text-[#0b57d0] whitespace-nowrap">
                    {machine.id}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-[#0f172a] whitespace-nowrap group-hover:text-[#0b57d0] transition-colors">
                    {machine.name}
                  </td>
                  <td className="py-3.5 px-6 text-[#64748b] whitespace-nowrap">
                    {machine.line}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <StatusBadge status={machine.status} showDot />
                  </td>
                  <td className="py-3.5 px-6 text-[#334155] font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#94a3b8]" />
                      {machine.runningHours}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-[#64748b] whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-[#94a3b8]" />
                      {machine.lastMaintenance}
                    </span>
                  </td>
                  <td
                    className="py-3.5 px-6 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenMachineDetails(machine)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMachines.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-[#64748b]">
                    No machines match your current search or status filter.
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

      {/* Add Machine Popup Form Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Machine"
        subtitle="Register a new molding machine into the plant fleet status table"
      >
        <form onSubmit={handleAddMachineSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Machine ID */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Machine ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g. IMM-13"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                required
              />
            </div>

            {/* Machine Name */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Machine Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Toshiba 220T Servo"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Production Line */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Production Line
              </label>
              <select
                value={formData.line}
                onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {[
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

            {/* Current Status */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Current Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              >
                {['Running', 'Under Breakdown', 'Under Scheduled PM', 'Idle'].map(
                  (status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Running Hours */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Running Hours
              </label>
              <input
                type="number"
                min="0"
                value={formData.runningHours}
                onChange={(e) =>
                  setFormData({ ...formData, runningHours: e.target.value })
                }
                placeholder="e.g. 850"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                required
              />
            </div>

            {/* Last Maintenance Date */}
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Last Maintenance Date
              </label>
              <input
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) =>
                  setFormData({ ...formData, lastMaintenance: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
            >
              Save Machine
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MachineStatus;
