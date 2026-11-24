import { useState } from 'react';
import {
  Plus,
  Edit3,
  Eye,
  RotateCcw,
  ArrowUpRight,
  CornerDownLeft,
  AlertTriangle,
  UserCheck,
  History,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import SearchInput from '../../components/common/SearchInput';
import {
  TOOL_CATEGORIES,
  TOOL_CONDITIONS,
  TOOL_STATUSES,
  TOOL_STATUS_VARIANTS,
  TOOL_CONDITION_VARIANTS,
  TOOL_ASSIGNEE_OPTIONS,
  TOOL_MACHINE_OPTIONS,
  initialTools,
  initialToolHistory,
} from './toolData';

const TODAY_DATE = '2026-11-24';

const getStatusForReturnCondition = (condition) => {
  if (condition === 'Damaged') return 'Damaged';
  if (condition === 'Needs Repair') return 'Under Maintenance';
  return 'Available';
};

const ToolManagement = () => {
  const { activeRole, user, hasPermission } = useAuth();
  const [tools, setTools] = useState(initialTools);
  const [toolHistory, setToolHistory] = useState(initialToolHistory);

  // Active tab: 'tools' (Tools List) | 'history' (Issue & Return History)
  const [activeTab, setActiveTab] = useState('tools');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [onlyMyTools, setOnlyMyTools] = useState(false);

  // History filters
  const [historySearch, setHistorySearch] = useState('');
  const [historyActionFilter, setHistoryActionFilter] = useState('All Actions');

  // Modals
  const [isToolFormOpen, setIsToolFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toolFormError, setToolFormError] = useState('');
  const [selectedToolDetails, setSelectedToolDetails] = useState(null);

  const [toolToIssue, setToolToIssue] = useState(null);
  const [toolToReturn, setToolToReturn] = useState(null);
  const [returnStep, setReturnStep] = useState('form'); // 'form' | 'confirm'

  // Add / Edit Tool form
  const [toolForm, setToolForm] = useState({
    toolId: '',
    toolName: '',
    toolCategory: TOOL_CATEGORIES[0],
    toolCondition: 'Good',
    currentStatus: 'Available',
    remarks: '',
  });

  // Issue Tool form
  const [issueForm, setIssueForm] = useState({
    assignedTo: TOOL_ASSIGNEE_OPTIONS[0],
    assignedMachine: TOOL_MACHINE_OPTIONS[0],
    issueDate: TODAY_DATE,
    expectedReturnDate: '2026-11-28',
    remarks: '',
  });

  // Return Tool form
  const [returnForm, setReturnForm] = useState({
    returnDate: TODAY_DATE,
    toolCondition: 'Good',
    resultingStatus: 'Available',
    remarks: '',
  });

  const currentUserName = user?.name || 'Rajesh Kumar';
  const currentTechnicianLabel = `${currentUserName} (Technician)`;
  const isTechnician = activeRole === 'Technician';

  // Permissions driven by global roleService.js via useAuth()
  const canAddTool = hasPermission('inventory.add_tool');
  const canEditTool = hasPermission('inventory.edit_tool');
  const canIssueOrReturn = hasPermission('inventory.issue_return_tool');

  const isToolAssignedToCurrentUser = (tool) =>
    Boolean(tool?.assignedTo && tool.assignedTo.includes(currentUserName));

  const canReturnTool = (tool) => {
    if (!canIssueOrReturn || tool.currentStatus !== 'Issued') return false;
    if (isTechnician) return isToolAssignedToCurrentUser(tool);
    return true;
  };

  // Filtered tools
  const filteredTools = tools.filter((tool) => {
    if (isTechnician && onlyMyTools) {
      if (!isToolAssignedToCurrentUser(tool)) return false;
    }
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      tool.toolId.toLowerCase().includes(q) ||
      tool.toolName.toLowerCase().includes(q) ||
      tool.assignedTo.toLowerCase().includes(q) ||
      tool.assignedMachine.toLowerCase().includes(q);
    const matchesCategory =
      categoryFilter === 'All Categories' || tool.toolCategory === categoryFilter;
    const matchesStatus =
      statusFilter === 'All Status' || tool.currentStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Role-scoped & filtered tool issue/return history
  const visibleHistory = toolHistory.filter((entry) => {
    if (isTechnician && !entry.assignedTo.includes(currentUserName)) {
      return false;
    }
    const q = historySearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      entry.historyId.toLowerCase().includes(q) ||
      entry.toolId.toLowerCase().includes(q) ||
      entry.toolName.toLowerCase().includes(q) ||
      entry.assignedTo.toLowerCase().includes(q);
    const matchesAction =
      historyActionFilter === 'All Actions' || entry.action === historyActionFilter;

    return matchesSearch && matchesAction;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All Categories');
    setStatusFilter('All Status');
    setOnlyMyTools(false);
  };

  // Add Tool
  const handleOpenAddModal = () => {
    if (!canAddTool) return;
    setIsEditMode(false);
    setToolFormError('');
    setToolForm({
      toolId: `TL-${201 + tools.length}`,
      toolName: '',
      toolCategory: TOOL_CATEGORIES[0],
      toolCondition: 'Good',
      currentStatus: 'Available',
      remarks: '',
    });
    setIsToolFormOpen(true);
  };

  // Edit Tool
  const handleOpenEditModal = (tool) => {
    if (!canEditTool) return;
    setIsEditMode(true);
    setToolFormError('');
    setToolForm({
      toolId: tool.toolId,
      toolName: tool.toolName,
      toolCategory: tool.toolCategory,
      toolCondition: tool.toolCondition,
      currentStatus: tool.currentStatus,
      remarks: tool.remarks || '',
    });
    setIsToolFormOpen(true);
  };

  const handleToolFormSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && !canEditTool) return;
    if (!isEditMode && !canAddTool) return;
    const trimmedId = toolForm.toolId.trim();
    const trimmedName = toolForm.toolName.trim();
    if (!trimmedId || !trimmedName) return;

    if (!isEditMode) {
      const duplicateExists = tools.some(
        (t) => t.toolId.toLowerCase() === trimmedId.toLowerCase()
      );
      if (duplicateExists) {
        setToolFormError(
          `Tool ID "${trimmedId}" already exists. Please enter a unique Tool ID.`
        );
        return;
      }
    }

    setToolFormError('');

    if (isEditMode) {
      setTools((prev) =>
        prev.map((t) =>
          t.toolId === toolForm.toolId
            ? {
                ...t,
                toolName: toolForm.toolName.trim(),
                toolCategory: toolForm.toolCategory,
                toolCondition: toolForm.toolCondition,
                currentStatus: toolForm.currentStatus,
                remarks: toolForm.remarks.trim(),
              }
            : t
        )
      );
    } else {
      const newTool = {
        toolId: toolForm.toolId.trim(),
        toolName: toolForm.toolName.trim(),
        toolCategory: toolForm.toolCategory,
        toolCondition: toolForm.toolCondition,
        currentStatus: toolForm.currentStatus,
        assignedTo: '—',
        assignedMachine: '—',
        issueDate: '—',
        expectedReturnDate: '—',
        remarks: toolForm.remarks.trim() || 'Registered in Tool Room catalog.',
      };
      setTools((prev) => [newTool, ...prev]);
    }
    setIsToolFormOpen(false);
  };

  // Open Issue Tool Modal
  const handleOpenIssueModal = (tool) => {
    if (!canIssueOrReturn || tool.currentStatus !== 'Available') return;
    setToolToIssue(tool);
    setIssueForm({
      assignedTo: isTechnician ? currentTechnicianLabel : TOOL_ASSIGNEE_OPTIONS[0],
      assignedMachine: TOOL_MACHINE_OPTIONS[0],
      issueDate: TODAY_DATE,
      expectedReturnDate: '2026-11-28',
      remarks: '',
    });
  };

  // Submit Issue Tool
  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!canIssueOrReturn || !toolToIssue || toolToIssue.currentStatus !== 'Available') {
      return;
    }

    const assignee = isTechnician ? currentTechnicianLabel : issueForm.assignedTo;

    setTools((prev) =>
      prev.map((t) =>
        t.toolId === toolToIssue.toolId
          ? {
              ...t,
              currentStatus: 'Issued',
              assignedTo: assignee,
              assignedMachine: issueForm.assignedMachine,
              issueDate: issueForm.issueDate,
              expectedReturnDate: issueForm.expectedReturnDate,
              remarks:
                issueForm.remarks.trim() ||
                `Issued to ${assignee} for ${issueForm.assignedMachine}.`,
            }
          : t
      )
    );

    const newEntry = {
      historyId: `TH-2026-${401 + toolHistory.length}`,
      toolId: toolToIssue.toolId,
      toolName: toolToIssue.toolName,
      action: 'Issued',
      assignedTo: assignee,
      assignedMachine: issueForm.assignedMachine,
      actionDate: issueForm.issueDate,
      expectedReturnDate: issueForm.expectedReturnDate,
      conditionAfter: toolToIssue.toolCondition,
      handledBy: currentUserName,
      remarks: issueForm.remarks.trim() || 'Tool issued from Tool Room.',
    };

    setToolHistory((prev) => [newEntry, ...prev]);
    setToolToIssue(null);
  };

  // Open Return Tool Modal
  const handleOpenReturnModal = (tool) => {
    if (!canReturnTool(tool)) return;
    setToolToReturn(tool);
    setReturnStep('form');
    setReturnForm({
      returnDate: TODAY_DATE,
      toolCondition: tool.toolCondition || 'Good',
      resultingStatus: getStatusForReturnCondition(tool.toolCondition || 'Good'),
      remarks: '',
    });
  };

  // Confirm Return Tool
  const handleConfirmReturn = () => {
    if (!toolToReturn || !canReturnTool(toolToReturn)) return;

    const updatedCondition = returnForm.toolCondition;
    const updatedStatus = returnForm.resultingStatus;

    setTools((prev) =>
      prev.map((t) =>
        t.toolId === toolToReturn.toolId
          ? {
              ...t,
              toolCondition: updatedCondition,
              currentStatus: updatedStatus,
              assignedTo: '—',
              assignedMachine:
                updatedStatus === 'Under Maintenance'
                  ? 'Tool Room / Maintenance Bay'
                  : '—',
              issueDate: '—',
              expectedReturnDate: '—',
              remarks:
                returnForm.remarks.trim() ||
                `Returned on ${returnForm.returnDate} in ${updatedCondition} condition.`,
            }
          : t
      )
    );

    const newEntry = {
      historyId: `TH-2026-${401 + toolHistory.length}`,
      toolId: toolToReturn.toolId,
      toolName: toolToReturn.toolName,
      action: 'Returned',
      assignedTo: toolToReturn.assignedTo,
      assignedMachine: toolToReturn.assignedMachine,
      actionDate: returnForm.returnDate,
      expectedReturnDate: toolToReturn.expectedReturnDate,
      conditionAfter: updatedCondition,
      handledBy: currentUserName,
      remarks:
        returnForm.remarks.trim() ||
        `Returned and inspected (${updatedCondition} → ${updatedStatus}).`,
    };

    setToolHistory((prev) => [newEntry, ...prev]);
    setToolToReturn(null);
    setReturnStep('form');
  };

  const selectedToolSpecificHistory = selectedToolDetails
    ? toolHistory.filter((h) => {
        if (h.toolId !== selectedToolDetails.toolId) return false;
        if (isTechnician && !h.assignedTo.includes(currentUserName)) return false;
        return true;
      })
    : [];

  return (
    <div className="space-y-5">
      {/* Tab Switcher: Tools List | Issue & Return History */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center bg-white border border-[#edf1f7] p-1 rounded-2xl shadow-[0_2px_10px_rgba(15,23,42,0.03)] gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-[#0b57d0] text-white shadow-[0_4px_12px_rgba(11,87,208,0.22)]'
                : 'text-[#475569] hover:text-[#0b57d0] hover:bg-[#f3f6fb]'
            }`}
          >
            <span>Tools List</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                activeTab === 'tools'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#eef4ff] text-[#0b57d0]'
              }`}
            >
              {tools.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#0b57d0] text-white shadow-[0_4px_12px_rgba(11,87,208,0.22)]'
                : 'text-[#475569] hover:text-[#0b57d0] hover:bg-[#f3f6fb]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Issue &amp; Return History</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                activeTab === 'history'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#eef4ff] text-[#0b57d0]'
              }`}
            >
              {visibleHistory.length}
            </span>
          </button>
        </div>

        {canAddTool && (
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="h-10 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tool</span>
          </button>
        )}
      </div>

      {/* TAB 1: TOOLS LIST */}
      {activeTab === 'tools' ? (
        <>
          {/* Search & Filters Card */}
          <section className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                    Search Tool
                  </label>
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Tool ID, name, assignee, machine..."
                    variant="bordered"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                    Tool Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                  >
                    <option value="All Categories">All Categories</option>
                    {TOOL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                    Current Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                  >
                    <option value="All Status">All Status</option>
                    {TOOL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {isTechnician && (
                  <button
                    type="button"
                    onClick={() => setOnlyMyTools((prev) => !prev)}
                    className={`h-10 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
                      onlyMyTools
                        ? 'bg-[#0b57d0] text-white'
                        : 'bg-[#eef4ff] text-[#0b57d0] hover:bg-[#dce8ff]'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>My Issued Tools</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-10 px-4 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          </section>

          {/* Simplified 8-Column Tools List Table */}
          <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#0f172a]">
                  Tools List
                </h3>
                <p className="text-xs font-medium text-[#64748b] mt-0.5">
                  Track tool availability, condition, active assignments, and expected returns
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#eef4ff] text-[#0b57d0] text-xs font-bold self-start sm:self-auto">
                {filteredTools.length} Tools Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Tool ID</th>
                    <th className="py-3.5 px-4">Tool Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Condition</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Assigned To</th>
                    <th className="py-3.5 px-4">Expected Return</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                  {filteredTools.map((tool) => (
                    <tr
                      key={tool.toolId}
                      className="hover:bg-[#f8fafc]/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#0b57d0] whitespace-nowrap">
                        {tool.toolId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#0f172a] whitespace-nowrap">
                        {tool.toolName}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-[#f3f6fb] text-[#334155] text-xs font-bold">
                          {tool.toolCategory}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge
                          status={tool.toolCondition}
                          variant={TOOL_CONDITION_VARIANTS[tool.toolCondition] || 'blue'}
                        />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge
                          status={tool.currentStatus}
                          variant={TOOL_STATUS_VARIANTS[tool.currentStatus] || 'blue'}
                          showDot
                        />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-[#334155] block">
                          {tool.assignedTo}
                        </span>
                        {tool.currentStatus === 'Issued' &&
                          tool.assignedMachine &&
                          tool.assignedMachine !== '—' && (
                            <span className="text-[11px] text-[#64748b]">
                              {tool.assignedMachine}
                            </span>
                          )}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                        {tool.expectedReturnDate}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedToolDetails(tool)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e2e8f0] text-[#334155] text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {canEditTool && (
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(tool)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}

                        {canIssueOrReturn && tool.currentStatus === 'Available' && (
                          <button
                            type="button"
                            onClick={() => handleOpenIssueModal(tool)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#e8f8ef] hover:bg-[#15803d] text-[#15803d] hover:text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>Issue</span>
                          </button>
                        )}

                        {canReturnTool(tool) && (
                          <button
                            type="button"
                            onClick={() => handleOpenReturnModal(tool)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#fff4e5] hover:bg-[#c2410c] text-[#c2410c] hover:text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            <CornerDownLeft className="w-3.5 h-3.5" />
                            <span>Return</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredTools.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-sm text-[#64748b]">
                        No tools match your selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        /* TAB 2: TOOL ISSUE & RETURN HISTORY */
        <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#f1f5f9] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <History className="w-5 h-5 text-[#0b57d0] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-extrabold text-[#0f172a]">
                    Tool Issue &amp; Return History
                  </h3>
                  <p className="text-xs font-medium text-[#64748b] mt-0.5">
                    {isTechnician
                      ? `Showing your own tool issue & return records (${currentUserName})`
                      : 'Complete log of all tool issues, returns, and post-return condition updates'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="w-full sm:w-60">
                  <SearchInput
                    value={historySearch}
                    onChange={setHistorySearch}
                    placeholder="Search tool ID, name, person..."
                    variant="bordered"
                  />
                </div>
                <select
                  value={historyActionFilter}
                  onChange={(e) => setHistoryActionFilter(e.target.value)}
                  className="h-10 px-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  <option value="All Actions">All Actions</option>
                  <option value="Issued">Issued</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#f1f5f9] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3.5 px-4">History ID</th>
                    <th className="py-3.5 px-4">Tool</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4">Assigned To</th>
                    <th className="py-3.5 px-4">Machine</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Condition</th>
                    <th className="py-3.5 px-4">Handled By</th>
                    <th className="py-3.5 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                  {visibleHistory.map((item) => (
                    <tr
                      key={item.historyId}
                      className="hover:bg-[#f8fafc]/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#0b57d0] whitespace-nowrap">
                        {item.historyId}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-[#0f172a]">{item.toolId}</span>
                        <span className="text-[#64748b] ml-1.5">{item.toolName}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge
                          status={item.action}
                          variant={item.action === 'Issued' ? 'blue' : 'green'}
                          showDot
                        />
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                        {item.assignedTo}
                      </td>
                      <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                        {item.assignedMachine}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                        {item.actionDate}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge
                          status={item.conditionAfter}
                          variant={TOOL_CONDITION_VARIANTS[item.conditionAfter] || 'blue'}
                        />
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#334155] whitespace-nowrap">
                        {item.handledBy}
                      </td>
                      <td className="py-3.5 px-4 text-[#475569] max-w-xs truncate">
                        {item.remarks}
                      </td>
                    </tr>
                  ))}
                  {visibleHistory.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-sm text-[#64748b]">
                        No issue or return history records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
      )}

      {/* Modal 1: Add / Edit Tool */}
      <Modal
        isOpen={isToolFormOpen}
        onClose={() => {
          setIsToolFormOpen(false);
          setToolFormError('');
        }}
        title={isEditMode ? `Edit Tool (${toolForm.toolId})` : 'Add New Tool'}
        subtitle={
          isEditMode
            ? 'Update tool details, category, condition, or status'
            : 'Register a new tool into Tool Management'
        }
      >
        <form onSubmit={handleToolFormSubmit} className="p-6 space-y-4 text-xs">
          {toolFormError && (
            <div className="p-3 rounded-xl bg-[#feeceb] border border-[#fecaca] text-[#b91c1c] font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{toolFormError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Tool ID *</label>
              <input
                type="text"
                required
                disabled={isEditMode}
                value={toolForm.toolId}
                onChange={(e) => {
                  setToolForm({ ...toolForm, toolId: e.target.value });
                  setToolFormError('');
                }}
                placeholder="e.g. TL-208"
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] disabled:opacity-60 focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Tool Category *
              </label>
              <select
                value={toolForm.toolCategory}
                onChange={(e) =>
                  setToolForm({ ...toolForm, toolCategory: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {TOOL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1.5">Tool Name *</label>
            <input
              type="text"
              required
              value={toolForm.toolName}
              onChange={(e) => setToolForm({ ...toolForm, toolName: e.target.value })}
              placeholder="e.g. Digital Vernier Caliper 300mm"
              className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Tool Condition *
              </label>
              <select
                value={toolForm.toolCondition}
                onChange={(e) =>
                  setToolForm({ ...toolForm, toolCondition: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {TOOL_CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Current Status *
              </label>
              <select
                value={toolForm.currentStatus}
                onChange={(e) =>
                  setToolForm({ ...toolForm, currentStatus: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {TOOL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#334155] mb-1.5">Remarks</label>
            <input
              type="text"
              value={toolForm.remarks}
              onChange={(e) => setToolForm({ ...toolForm, remarks: e.target.value })}
              placeholder="Storage bay, calibration date, or maintenance notes..."
              className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
            <button
              type="button"
              onClick={() => setIsToolFormOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
            >
              {isEditMode ? 'Update Tool' : 'Save Tool'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Issue Tool */}
      <Modal
        isOpen={Boolean(toolToIssue)}
        onClose={() => setToolToIssue(null)}
        title="Issue Tool"
        subtitle={
          toolToIssue
            ? `Assign ${toolToIssue.toolId} (${toolToIssue.toolName}) to a technician or engineer`
            : ''
        }
      >
        {toolToIssue && (
          <form onSubmit={handleIssueSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Assign To (Technician / Engineer) *
              </label>
              {isTechnician ? (
                <input
                  type="text"
                  disabled
                  value={currentTechnicianLabel}
                  className="w-full h-10 px-3 bg-[#f1f5f9] border border-[#d6deeb] rounded-xl font-bold text-[#475569]"
                />
              ) : (
                <select
                  value={issueForm.assignedTo}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, assignedTo: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                >
                  {TOOL_ASSIGNEE_OPTIONS.map((staff) => (
                    <option key={staff} value={staff}>
                      {staff}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Assigned Machine *
              </label>
              <select
                value={issueForm.assignedMachine}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, assignedMachine: e.target.value })
                }
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
              >
                {TOOL_MACHINE_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={issueForm.issueDate}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, issueDate: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Expected Return Date *
                </label>
                <input
                  type="date"
                  required
                  value={issueForm.expectedReturnDate}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, expectedReturnDate: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">Remarks</label>
              <input
                type="text"
                value={issueForm.remarks}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, remarks: e.target.value })
                }
                placeholder="Job / shift reference or special instructions..."
                className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
              <button
                type="button"
                onClick={() => setToolToIssue(null)}
                className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
              >
                Issue Tool
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal 3: Return Tool (with Condition Update & Confirmation Step) */}
      <Modal
        isOpen={Boolean(toolToReturn)}
        onClose={() => {
          setToolToReturn(null);
          setReturnStep('form');
        }}
        title={returnStep === 'confirm' ? 'Confirm Tool Return' : 'Return Issued Tool'}
        subtitle={
          toolToReturn
            ? `${toolToReturn.toolId} — ${toolToReturn.toolName}`
            : ''
        }
      >
        {toolToReturn &&
          (returnStep === 'form' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setReturnStep('confirm');
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7] grid grid-cols-2 gap-2.5">
                <div>
                  <p className="text-[#64748b]">Currently Assigned To</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {toolToReturn.assignedTo}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Assigned Machine</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {toolToReturn.assignedMachine}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Return Date *
                </label>
                <input
                  type="date"
                  required
                  value={returnForm.returnDate}
                  onChange={(e) =>
                    setReturnForm({ ...returnForm, returnDate: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Condition After Return *
                  </label>
                  <select
                    value={returnForm.toolCondition}
                    onChange={(e) => {
                      const nextCond = e.target.value;
                      setReturnForm({
                        ...returnForm,
                        toolCondition: nextCond,
                        resultingStatus: getStatusForReturnCondition(nextCond),
                      });
                    }}
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                  >
                    {TOOL_CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1.5">
                    Updated Status *
                  </label>
                  <select
                    value={returnForm.resultingStatus}
                    onChange={(e) =>
                      setReturnForm({ ...returnForm, resultingStatus: e.target.value })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-bold text-[#0f172a] focus:outline-none focus:border-[#0b57d0] cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1.5">
                  Return Inspection Remarks
                </label>
                <input
                  type="text"
                  value={returnForm.remarks}
                  onChange={(e) =>
                    setReturnForm({ ...returnForm, remarks: e.target.value })
                  }
                  placeholder="Note wear, cleaning status, or damage observed..."
                  className="w-full h-10 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl font-medium text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setToolToReturn(null)}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
                >
                  Review &amp; Confirm
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#fff4e5] border border-[#fed7aa] text-[#9a3412] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#ea580c]" />
                <div>
                  <p className="font-extrabold">Please confirm this tool return</p>
                  <p className="mt-0.5 text-[#c2410c]">
                    The tool assignment will be cleared and status updated to{' '}
                    <strong>{returnForm.resultingStatus}</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                <div>
                  <p className="text-[#64748b]">Returned By</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {toolToReturn.assignedTo}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Return Date</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {returnForm.returnDate}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">Condition After Return</p>
                  <p className="font-bold text-[#0f172a] mt-0.5">
                    {returnForm.toolCondition}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748b]">New Status</p>
                  <p className="font-bold text-[#0b57d0] mt-0.5">
                    {returnForm.resultingStatus}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#64748b]">Remarks</p>
                  <p className="font-medium text-[#334155] mt-0.5">
                    {returnForm.remarks || '—'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setReturnStep('form')}
                  className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
                >
                  Back to Edit
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReturn}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Tool Return</span>
                </button>
              </div>
            </div>
          ))}
      </Modal>

      {/* Modal 4: View Tool Details & Specific Issue/Return History */}
      <Modal
        isOpen={Boolean(selectedToolDetails)}
        onClose={() => setSelectedToolDetails(null)}
        maxWidth="max-w-2xl"
        scrollable
        headerContent={
          selectedToolDetails && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                {selectedToolDetails.toolId}
              </span>
              <StatusBadge
                status={selectedToolDetails.currentStatus}
                variant={TOOL_STATUS_VARIANTS[selectedToolDetails.currentStatus] || 'blue'}
                showDot
              />
              <StatusBadge
                status={selectedToolDetails.toolCondition}
                variant={
                  TOOL_CONDITION_VARIANTS[selectedToolDetails.toolCondition] || 'blue'
                }
              />
            </div>
          )
        }
      >
        {selectedToolDetails && (
          <div className="p-6 overflow-y-auto space-y-5 text-xs">
            <div>
              <p className="text-[#64748b] font-medium">Tool Name</p>
              <h4 className="text-base font-extrabold text-[#0f172a] mt-0.5">
                {selectedToolDetails.toolName}
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
              <div>
                <p className="text-[#64748b]">Category</p>
                <p className="font-bold text-[#0f172a] mt-0.5">
                  {selectedToolDetails.toolCategory}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Assigned To</p>
                <p className="font-bold text-[#0f172a] mt-0.5">
                  {selectedToolDetails.assignedTo}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Assigned Machine</p>
                <p className="font-bold text-[#0f172a] mt-0.5">
                  {selectedToolDetails.assignedMachine}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Issue Date</p>
                <p className="font-semibold text-[#334155] mt-0.5">
                  {selectedToolDetails.issueDate}
                </p>
              </div>
              <div>
                <p className="text-[#64748b]">Expected Return</p>
                <p className="font-semibold text-[#334155] mt-0.5">
                  {selectedToolDetails.expectedReturnDate}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <p className="text-[#64748b]">Remarks</p>
                <p className="font-medium text-[#334155] mt-0.5">
                  {selectedToolDetails.remarks || '—'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-extrabold text-[#0f172a] text-xs">
                Issue &amp; Return History for {selectedToolDetails.toolId}
              </p>
              {selectedToolSpecificHistory.length > 0 ? (
                <div className="space-y-2">
                  {selectedToolSpecificHistory.map((h) => (
                    <div
                      key={h.historyId}
                      className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <StatusBadge
                            status={h.action}
                            variant={h.action === 'Issued' ? 'blue' : 'green'}
                            className="px-2 py-0.5 text-[11px]"
                          />
                          <span className="font-bold text-[#0f172a]">
                            {h.assignedTo}
                          </span>
                          <span className="text-[#64748b]">• {h.assignedMachine}</span>
                        </div>
                        <p className="text-[#64748b] mt-1">{h.remarks}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <p className="font-bold text-[#334155]">{h.actionDate}</p>
                        <p className="text-[11px] text-[#64748b]">
                          Condition: {h.conditionAfter}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#64748b] p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                  No issue or return history recorded yet for this tool.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
              <button
                type="button"
                onClick={() => setSelectedToolDetails(null)}
                className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ToolManagement;
