import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Wrench,
  RefreshCw,
  Edit3,
  Check,
  AlertTriangle,
  MapPin,
} from 'lucide-react';
import { initialTools, TOOLS_STORAGE_KEY } from './ToolManagement';

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'In Press':
      return 'bg-[#e8f8ef] text-[#15803d]';
    case 'In Tool Room':
      return 'bg-[#eef4ff] text-[#0b57d0]';
    case 'Under Maintenance':
      return 'bg-[#fff4e5] text-[#c2410c]';
    default:
      return 'bg-[#f1f5f9] text-[#475569]';
  }
};

const statusDotStyle = (status) => {
  switch (status) {
    case 'In Press':
      return 'bg-[#16a34a]';
    case 'In Tool Room':
      return 'bg-[#0b57d0]';
    case 'Under Maintenance':
      return 'bg-[#ea580c]';
    default:
      return 'bg-[#94a3b8]';
  }
};

const loadSavedTools = () => {
  try {
    const saved = localStorage.getItem(TOOLS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTools;
  } catch {
    return initialTools;
  }
};

const ToolDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toolIdParam = searchParams.get('toolId');

  const [tools, setTools] = useState(loadSavedTools);
  const selectedTool =
    tools.find((t) => t.toolId === toolIdParam) || tools[0] || null;

  const [editForm, setEditForm] = useState({
    currentLocation: selectedTool?.currentLocation || '',
    status: selectedTool?.status || 'In Tool Room',
    nextRefurbishmentDate: selectedTool?.nextRefurbishmentDate || '',
    remarks: selectedTool?.remarks || '',
  });
  const [updateSaved, setUpdateSaved] = useState(false);

  useEffect(() => {
    if (selectedTool) {
      setEditForm({
        currentLocation: selectedTool.currentLocation,
        status: selectedTool.status,
        nextRefurbishmentDate: selectedTool.nextRefurbishmentDate,
        remarks: selectedTool.remarks,
      });
      setUpdateSaved(false);
    }
  }, [selectedTool?.toolId]);

  const handleSaveToolUpdate = (e) => {
    e.preventDefault();
    if (!selectedTool) return;

    const updatedTools = tools.map((t) =>
      t.toolId === selectedTool.toolId
        ? {
            ...t,
            currentLocation: editForm.currentLocation,
            status: editForm.status,
            nextRefurbishmentDate: editForm.nextRefurbishmentDate,
            remarks: editForm.remarks,
          }
        : t
    );

    setTools(updatedTools);
    try {
      localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(updatedTools));
    } catch {
      // Ignore storage errors
    }
    setUpdateSaved(true);
  };

  if (!selectedTool) {
    return (
      <div className="bg-white rounded-2xl border border-[#edf1f7] p-8 text-center space-y-4">
        <p className="text-sm font-semibold text-[#64748b]">Tool record not found.</p>
        <button
          type="button"
          onClick={() => navigate('/inventory/tools')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b57d0] text-white text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tool Management</span>
        </button>
      </div>
    );
  }

  const usagePct = Math.min(
    100,
    Math.round((selectedTool.usageCount / selectedTool.maxRefurbShots) * 100)
  );
  const refurbDueSoon =
    selectedTool.usageCount / selectedTool.maxRefurbShots >= 0.9 ||
    selectedTool.nextRefurbishmentDate <= '2026-11-26';

  return (
    <div className="space-y-5">
      {/* Top Back Action & Header Card */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#f1f5f9]">
          <div className="flex items-start sm:items-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate('/inventory/tools')}
              className="h-9 px-3.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                  {selectedTool.toolId}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                  {selectedTool.toolType}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeStyle(
                    selectedTool.status
                  )}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusDotStyle(
                      selectedTool.status
                    )}`}
                  />
                  {selectedTool.status}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mt-1.5">
                {selectedTool.toolName}
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Compatible with {selectedTool.compatibleMachine}
              </p>
            </div>
          </div>
        </div>

        {/* 1. Tool Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b] font-medium">Tool ID &amp; Type</p>
            <p className="text-sm font-extrabold text-[#0f172a] mt-1">
              {selectedTool.toolId} ({selectedTool.toolType})
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b] font-medium">Compatible Machine</p>
            <p className="text-sm font-bold text-[#0b57d0] mt-1">
              {selectedTool.compatibleMachine}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b] font-medium">Current Location</p>
            <p className="text-sm font-bold text-[#0f172a] mt-1 inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0b57d0]" />
              {selectedTool.currentLocation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b] font-medium">Total Usage Count</p>
            <p className="text-sm font-extrabold text-[#0f172a] mt-1">
              {selectedTool.usageCount.toLocaleString()} /{' '}
              {selectedTool.maxRefurbShots.toLocaleString()} shots ({usagePct}%)
            </p>
            <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${
                  refurbDueSoon ? 'bg-[#dc2626]' : 'bg-[#0b57d0]'
                }`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b] font-medium">Last Maintenance Date</p>
            <p className="text-sm font-bold text-[#0f172a] mt-1">
              {selectedTool.lastMaintenanceDate}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b] font-medium">Next Refurbishment Date</p>
            <p
              className={`text-sm font-extrabold mt-1 inline-flex items-center gap-1.5 ${
                refurbDueSoon ? 'text-[#dc2626]' : 'text-[#0f172a]'
              }`}
            >
              {refurbDueSoon && <AlertTriangle className="w-4 h-4" />}
              {selectedTool.nextRefurbishmentDate}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Tool Usage & Update Schedule Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
        {/* Tool Usage & Recent Shot Logs */}
        <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6">
          <h3 className="text-sm font-extrabold text-[#0f172a] mb-2 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#0b57d0]" />
            <span>Tool Usage &amp; Current Run Info</span>
          </h3>
          <p className="text-[#475569] leading-relaxed mb-4">
            {selectedTool.currentUsageInfo}
          </p>

          <div className="space-y-2">
            <p className="font-bold text-[#334155] text-[11px] uppercase tracking-wider">
              Recent Shot / Cycle Logs
            </p>
            {selectedTool.usageHistory && selectedTool.usageHistory.length > 0 ? (
              selectedTool.usageHistory.map((u, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7]"
                >
                  <span className="font-semibold text-[#0f172a]">
                    {u.date} ({u.shift}) • {u.machine}
                  </span>
                  <span className="font-bold text-[#0b57d0]">{u.shots}</span>
                </div>
              ))
            ) : (
              <p className="text-[#64748b] p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                No shot logs recorded yet for this tool.
              </p>
            )}
          </div>
        </section>

        {/* Editable Location & Refurbishment Schedule Form */}
        <form
          onSubmit={handleSaveToolUpdate}
          className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0f172a] flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#0b57d0]" />
              <span>Update Location &amp; Refurbishment Schedule</span>
            </h3>
            {updateSaved && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e8f8ef] text-[#15803d] text-[11px] font-bold">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Current Location
              </label>
              <input
                type="text"
                value={editForm.currentLocation}
                onChange={(e) =>
                  setEditForm({ ...editForm, currentLocation: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Tool Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                <option value="In Press">In Press</option>
                <option value="In Tool Room">In Tool Room</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Last Refurbishment
              </label>
              <input
                type="text"
                value={selectedTool.lastMaintenanceDate}
                disabled
                className="w-full h-10 px-3 bg-[#f1f5f9] border border-[#d6deeb] rounded-xl font-semibold text-[#64748b]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Next Scheduled Refurbishment
              </label>
              <input
                type="date"
                value={editForm.nextRefurbishmentDate}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    nextRefurbishmentDate: e.target.value,
                  })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1.5">
              Maintenance Remarks
            </label>
            <input
              type="text"
              value={editForm.remarks}
              onChange={(e) =>
                setEditForm({ ...editForm, remarks: e.target.value })
              }
              className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
          >
            Save Tool Updates
          </button>
        </form>
      </div>

      {/* 3. Tool Maintenance History Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex items-center gap-2">
          <Wrench className="w-4 h-4 text-[#0b57d0]" />
          <h3 className="text-base font-extrabold text-[#0f172a]">
            Tool Maintenance History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Maintenance Date</th>
                <th className="py-3.5 px-5">Maintenance Type</th>
                <th className="py-3.5 px-5">Description</th>
                <th className="py-3.5 px-5">Technician</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {selectedTool.maintenanceHistory &&
              selectedTool.maintenanceHistory.length > 0 ? (
                selectedTool.maintenanceHistory.map((mh, i) => (
                  <tr key={i} className="hover:bg-[#f8fafc]/80 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                      {mh.date}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-[#0b57d0] whitespace-nowrap">
                      {mh.type}
                    </td>
                    <td className="py-3.5 px-5 text-[#475569]">{mh.description}</td>
                    <td className="py-3.5 px-5 font-medium text-[#334155] whitespace-nowrap">
                      {mh.technician}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e8f8ef] text-[#15803d]">
                        {mh.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-[#64748b]">
                    No maintenance history recorded yet for this tool.
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

export default ToolDetails;
