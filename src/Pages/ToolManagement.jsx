import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Search,
  RotateCcw,
  Eye,
  X,
  MapPin,
  Plus,
} from 'lucide-react';

export const initialTools = [
  {
    toolId: 'MLD-SG-204',
    toolName: 'Door Trim Clip Housing 2-Cavity Mold',
    toolType: 'Molds',
    compatibleMachine: 'IMM-01 (Toshiba 180T)',
    usageCount: 48200,
    maxRefurbShots: 50000,
    currentLocation: 'Press Line A - IMM-01',
    lastMaintenanceDate: '2026-10-25',
    nextRefurbishmentDate: '2026-11-23',
    status: 'In Press',
    remarks: 'Approaching 50,000-shot cavity polishing & guide pin lubrication threshold.',
    currentUsageInfo: 'Mounted on IMM-01 running Shift A batch #B-884 (28.4s cycle).',
    usageHistory: [
      { date: '20 Nov 2026', machine: 'IMM-01', shots: '1,166 shots', shift: 'Shift A' },
      { date: '19 Nov 2026', machine: 'IMM-01', shots: '2,350 shots', shift: 'Shift A & B' },
      { date: '18 Nov 2026', machine: 'IMM-01', shots: '2,280 shots', shift: 'Shift A & B' },
    ],
    maintenanceHistory: [
      {
        date: '25 Oct 2026',
        type: 'Preventive Polishing',
        description: 'Cavity mirror polishing, venting slot cleaning & ejector pin lubrication.',
        technician: 'Rohan Sharma',
        status: 'Completed',
      },
      {
        date: '28 Sep 2026',
        type: 'Seal Replacement',
        description: 'Replaced cooling manifold Viton O-rings and pressure tested channels.',
        technician: 'Karan Mehta',
        status: 'Completed',
      },
    ],
  },
  {
    toolId: 'MLD-SG-610',
    toolName: 'Front Bumper Lower Grille Heavy Mold',
    toolType: 'Molds',
    compatibleMachine: 'IMM-06 (JSW 450T)',
    usageCount: 34900,
    maxRefurbShots: 50000,
    currentLocation: 'Press Line C - IMM-06',
    lastMaintenanceDate: '2026-11-02',
    nextRefurbishmentDate: '2026-12-15',
    status: 'In Press',
    remarks: 'Hot runner manifold balanced across all 4 drops. Operating normally.',
    currentUsageInfo: 'Mounted on IMM-06 running Bumper Grille production.',
    usageHistory: [
      { date: '20 Nov 2026', machine: 'IMM-06', shots: '1,157 shots', shift: 'Shift A' },
      { date: '19 Nov 2026', machine: 'IMM-06', shots: '1,190 shots', shift: 'Shift A' },
    ],
    maintenanceHistory: [
      {
        date: '02 Nov 2026',
        type: 'Hot Runner Inspection',
        description: 'Verified gate pin actuation and heater thermocouple calibration.',
        technician: 'Suresh Nair',
        status: 'Completed',
      },
    ],
  },
  {
    toolId: 'DIE-SG-112',
    toolName: 'Bumper Bracket Progressive Trimming Die',
    toolType: 'Dies',
    compatibleMachine: 'IMM-07 (Engel 300T)',
    usageCount: 29400,
    maxRefurbShots: 40000,
    currentLocation: 'Tool Room Bay-2',
    lastMaintenanceDate: '2026-11-14',
    nextRefurbishmentDate: '2026-12-20',
    status: 'In Tool Room',
    remarks: 'Cleaned, anti-rust coated, and stored in Tool Room Bay-2 ready for next schedule.',
    currentUsageInfo: 'On standby in Tool Room Bay-2.',
    usageHistory: [
      { date: '13 Nov 2026', machine: 'IMM-07', shots: '1,840 cycles', shift: 'Shift B' },
    ],
    maintenanceHistory: [
      {
        date: '14 Nov 2026',
        type: 'Edge Sharpening',
        description: 'Trimming blade clearance check and post-run cleaning.',
        technician: 'Deepak Patel',
        status: 'Completed',
      },
    ],
  },
  {
    toolId: 'JIG-SG-305',
    toolName: 'Ultrasonic Welding Alignment Jig - Console',
    toolType: 'Jigs',
    compatibleMachine: 'IMM-02 (Sumitomo 220T)',
    usageCount: 49500,
    maxRefurbShots: 50000,
    currentLocation: 'Tool Maintenance Bay',
    lastMaintenanceDate: '2026-10-10',
    nextRefurbishmentDate: '2026-11-21',
    status: 'Under Maintenance',
    remarks: 'Undergoing 50k cycle clamp bushing replacement and coordinate calibration.',
    currentUsageInfo: 'Currently disassembled in Tool Maintenance Bay for refurbishment.',
    usageHistory: [
      { date: '18 Nov 2026', machine: 'IMM-02', shots: '1,420 cycles', shift: 'Shift A' },
    ],
    maintenanceHistory: [
      {
        date: '10 Oct 2026',
        type: 'CMM Calibration',
        description: 'Verified datum locator pins against 3D CAD tolerance.',
        technician: 'Vikram Singh',
        status: 'Completed',
      },
    ],
  },
  {
    toolId: 'FIX-SG-408',
    toolName: 'Interior Trim Cooling & Checking Fixture',
    toolType: 'Fixtures',
    compatibleMachine: 'IMM-05 (Nissei 350T)',
    usageCount: 21800,
    maxRefurbShots: 45000,
    currentLocation: 'Press Line B - IMM-05',
    lastMaintenanceDate: '2026-11-10',
    nextRefurbishmentDate: '2027-01-10',
    status: 'In Press',
    remarks: 'Pneumatic toggle clamps operating smoothly at 6 Bar.',
    currentUsageInfo: 'Active at Line B station adjacent to IMM-05.',
    usageHistory: [
      { date: '20 Nov 2026', machine: 'IMM-05', shots: '1,730 cycles', shift: 'Shift B' },
    ],
    maintenanceHistory: [
      {
        date: '10 Nov 2026',
        type: 'Routine Check',
        description: 'Checked pneumatic clamp cylinders and nylon resting pads.',
        technician: 'Amit Verma',
        status: 'Completed',
      },
    ],
  },
  {
    toolId: 'MLD-SG-702',
    toolName: 'Actuator Spur Gear 42T Precision Mold',
    toolType: 'Molds',
    compatibleMachine: 'IMM-08 (Sumitomo 180T)',
    usageCount: 47900,
    maxRefurbShots: 50000,
    currentLocation: 'Tool Room Bay-1',
    lastMaintenanceDate: '2026-10-18',
    nextRefurbishmentDate: '2026-11-24',
    status: 'In Tool Room',
    remarks: 'Scheduled for gear tooth profile inspection and core pin refurbishment this week.',
    currentUsageInfo: 'Stored in humidity-controlled Tool Room Bay-1.',
    usageHistory: [
      { date: '19 Nov 2026', machine: 'IMM-08', shots: '1,117 shots', shift: 'Shift B' },
    ],
    maintenanceHistory: [
      {
        date: '18 Oct 2026',
        type: 'Core Pin Inspection',
        description: 'Measured gear cavity concentricity and lubricated slides.',
        technician: 'Rohan Sharma',
        status: 'Completed',
      },
    ],
  },
];

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

const isUpcomingRefurb = (tool) => {
  return (
    tool.usageCount / tool.maxRefurbShots >= 0.9 ||
    tool.nextRefurbishmentDate <= '2026-11-26'
  );
};

export const TOOLS_STORAGE_KEY = 'sanko_gosei_tools_v1';

const loadSavedTools = () => {
  try {
    const saved = localStorage.getItem(TOOLS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTools;
  } catch {
    return initialTools;
  }
};

const ToolManagement = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState(loadSavedTools);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [machineFilter, setMachineFilter] = useState('All Machines');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    toolId: '',
    toolName: '',
    toolType: 'Molds',
    compatibleMachine: 'IMM-01 (Toshiba 180T)',
    usageCount: 0,
    maxRefurbShots: 50000,
    currentLocation: 'Tool Room Bay-1',
    lastMaintenanceDate: '2026-11-21',
    nextRefurbishmentDate: '2027-01-20',
    status: 'In Tool Room',
    remarks: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools));
    } catch {
      // Ignore storage errors
    }
  }, [tools]);

  // Upcoming Refurbishment Count (used in table header badge)
  const upcomingRefurbCount = tools.filter((t) => isUpcomingRefurb(t)).length;

  const machineOptions = [
    'All Machines',
    ...Array.from(new Set(tools.map((t) => t.compatibleMachine))),
  ];
  const locationOptions = [
    'All Locations',
    ...Array.from(new Set(tools.map((t) => t.currentLocation))),
  ];

  // Filtered Tools
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      !searchQuery.trim() ||
      tool.toolId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.toolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All Types' || tool.toolType === typeFilter;
    const matchesMachine =
      machineFilter === 'All Machines' || tool.compatibleMachine === machineFilter;
    const matchesLocation =
      locationFilter === 'All Locations' || tool.currentLocation === locationFilter;
    const matchesStatus =
      statusFilter === 'All Status' || tool.status === statusFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesMachine &&
      matchesLocation &&
      matchesStatus
    );
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('All Types');
    setMachineFilter('All Machines');
    setLocationFilter('All Locations');
    setStatusFilter('All Status');
  };

  const handleOpenAddModal = () => {
    setAddForm({
      toolId: `MLD-SG-${801 + tools.length}`,
      toolName: '',
      toolType: 'Molds',
      compatibleMachine: 'IMM-01 (Toshiba 180T)',
      usageCount: 0,
      maxRefurbShots: 50000,
      currentLocation: 'Tool Room Bay-1',
      lastMaintenanceDate: '2026-11-21',
      nextRefurbishmentDate: '2027-01-20',
      status: 'In Tool Room',
      remarks: '',
    });
    setIsAddModalOpen(true);
  };

  const handleAddToolSubmit = (e) => {
    e.preventDefault();
    if (!addForm.toolId.trim() || !addForm.toolName.trim()) return;

    const newTool = {
      toolId: addForm.toolId.trim(),
      toolName: addForm.toolName.trim(),
      toolType: addForm.toolType,
      compatibleMachine: addForm.compatibleMachine.trim(),
      usageCount: Math.max(0, Number(addForm.usageCount) || 0),
      maxRefurbShots: Math.max(1, Number(addForm.maxRefurbShots) || 50000),
      currentLocation: addForm.currentLocation.trim(),
      lastMaintenanceDate: addForm.lastMaintenanceDate,
      nextRefurbishmentDate: addForm.nextRefurbishmentDate,
      status: addForm.status,
      remarks: addForm.remarks.trim() || 'Newly registered tool in plant tooling catalog.',
      currentUsageInfo: `Located at ${addForm.currentLocation.trim()} (${addForm.status}).`,
      usageHistory: [],
      maintenanceHistory: [],
    };

    setTools((prev) => [newTool, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleOpenDetails = (tool) => {
    navigate(`/inventory/tools/details?toolId=${encodeURIComponent(tool.toolId)}`);
  };

  return (
    <div className="space-y-5">
      {/* Search & Filters Section */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 flex-1">
            {/* Search by Tool ID or Tool Name */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Search Tooling
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tool ID or tool name..."
                  className="w-full h-10 pl-9 pr-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:bg-white focus:border-[#0b57d0]"
                />
              </div>
            </div>

            {/* Tool Type */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Tool Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Types', 'Molds', 'Dies', 'Jigs', 'Fixtures'].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Compatible Machine */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Compatible Machine
              </label>
              <select
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {machineOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Location */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Current Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Maintenance Status */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                Tool Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {['All Status', 'In Press', 'In Tool Room', 'Under Maintenance'].map(
                  (st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  )
                )}
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
              onClick={handleOpenAddModal}
              className="h-10 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tool</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tool List Table */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              Production Tooling Fleet (Molds, Dies, Jigs &amp; Fixtures)
            </h3>
            <p className="text-xs font-medium text-[#64748b] mt-0.5">
              Monitor cumulative shot counts, press locations, and upcoming refurbishment schedules
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#feeceb] text-[#b91c1c] text-xs font-bold self-start sm:self-auto">
            {upcomingRefurbCount} Upcoming Refurbishment
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Tool ID</th>
                <th className="py-3.5 px-5">Tool Name</th>
                <th className="py-3.5 px-5">Tool Type</th>
                <th className="py-3.5 px-5">Compatible Machine</th>
                <th className="py-3.5 px-5">Usage Count (Shots/Cycles)</th>
                <th className="py-3.5 px-5">Current Location</th>
                <th className="py-3.5 px-5">Last Maintenance</th>
                <th className="py-3.5 px-5">Next Refurbishment</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredTools.map((tool) => {
                const refurbDueSoon = isUpcomingRefurb(tool);
                const usagePct = Math.min(
                  100,
                  Math.round((tool.usageCount / tool.maxRefurbShots) * 100)
                );

                return (
                  <tr key={tool.toolId} className="hover:bg-[#f8fafc]/80 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#0b57d0] whitespace-nowrap">
                      {tool.toolId}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#0f172a] whitespace-nowrap">
                      {tool.toolName}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                        {tool.toolType}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-[#475569] whitespace-nowrap">
                      {tool.compatibleMachine}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[#0f172a]">
                          {tool.usageCount.toLocaleString()} /{' '}
                          {tool.maxRefurbShots.toLocaleString()}
                        </span>
                        <div className="w-28 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              refurbDueSoon ? 'bg-[#dc2626]' : 'bg-[#0b57d0]'
                            }`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#334155]">
                        <MapPin className="w-3.5 h-3.5 text-[#0b57d0]" />
                        {tool.currentLocation}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-[#64748b] whitespace-nowrap">
                      {tool.lastMaintenanceDate}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          refurbDueSoon
                            ? 'bg-[#feeceb] text-[#b91c1c]'
                            : 'bg-[#f8fafc] text-[#334155]'
                        }`}
                      >
                        {refurbDueSoon && <AlertTriangle className="w-3.5 h-3.5" />}
                        {tool.nextRefurbishmentDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeStyle(
                          tool.status
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusDotStyle(
                            tool.status
                          )}`}
                        />
                        {tool.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(tool)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredTools.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-sm text-[#64748b]">
                    No tools match your selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Tool Popup Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a]">
                  Add New Tool
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Register a new mold, die, jig, or fixture into the tooling fleet
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

            <form
              onSubmit={handleAddToolSubmit}
              className="p-6 overflow-y-auto space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Tool ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.toolId}
                    onChange={(e) =>
                      setAddForm({ ...addForm, toolId: e.target.value })
                    }
                    placeholder="e.g. MLD-SG-801"
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Tool Type *
                  </label>
                  <select
                    value={addForm.toolType}
                    onChange={(e) =>
                      setAddForm({ ...addForm, toolType: e.target.value })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                  >
                    {['Molds', 'Dies', 'Jigs', 'Fixtures'].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Tool Name *
                </label>
                <input
                  type="text"
                  required
                  value={addForm.toolName}
                  onChange={(e) =>
                    setAddForm({ ...addForm, toolName: e.target.value })
                  }
                  placeholder="e.g. Dashboard Air Vent 4-Cavity Mold"
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Compatible Machine *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.compatibleMachine}
                    onChange={(e) =>
                      setAddForm({ ...addForm, compatibleMachine: e.target.value })
                    }
                    placeholder="e.g. IMM-01 (Toshiba 180T)"
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Current Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.currentLocation}
                    onChange={(e) =>
                      setAddForm({ ...addForm, currentLocation: e.target.value })
                    }
                    placeholder="e.g. Tool Room Bay-1"
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Usage Count (Shots/Cycles)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={addForm.usageCount}
                    onChange={(e) =>
                      setAddForm({ ...addForm, usageCount: e.target.value })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Max Refurbishment Shots
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={addForm.maxRefurbShots}
                    onChange={(e) =>
                      setAddForm({ ...addForm, maxRefurbShots: e.target.value })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Last Maintenance Date
                  </label>
                  <input
                    type="date"
                    value={addForm.lastMaintenanceDate}
                    onChange={(e) =>
                      setAddForm({ ...addForm, lastMaintenanceDate: e.target.value })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Next Refurbishment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={addForm.nextRefurbishmentDate}
                    onChange={(e) =>
                      setAddForm({ ...addForm, nextRefurbishmentDate: e.target.value })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Tool Status
                </label>
                <select
                  value={addForm.status}
                  onChange={(e) =>
                    setAddForm({ ...addForm, status: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  <option value="In Tool Room">In Tool Room</option>
                  <option value="In Press">In Press</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={addForm.remarks}
                  onChange={(e) =>
                    setAddForm({ ...addForm, remarks: e.target.value })
                  }
                  placeholder="Enter maintenance notes or mold specifications..."
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
                >
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ToolManagement;
