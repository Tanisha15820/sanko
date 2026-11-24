import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  Plus,
  Trash2,
  UserCheck,
  ArrowLeft,
  Save,
  Send,
  Upload,
  Camera,
  Lock,
  ShieldAlert,
  Eye,
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useMaintenance } from '../../context/MaintenanceContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import sankoLogo from '../../assets/images/sanko-logo.png';
import { PM_ROLES, CHECKLIST_STATUS_VARIANTS } from './pmChecklistData';

const TECHNICIAN_EDITABLE_STATUSES = ['Scheduled', 'In Progress', 'Draft'];

const formatNowTimestamp = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const PMChecklist = () => {
  const { spareParts } = useInventory();
  const {
    pmChecklists,
    adminFailureQueue,
    updatePmChecklist,
    submitPmChecklist,
  } = useMaintenance();
  const { activeRole: globalRole, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Default to Technician view if global role isn't in PM_ROLES
  const activeRole = PM_ROLES.includes(globalRole) ? globalRole : 'Technician';
  const currentTechName = activeRole === 'Technician' ? user?.name || 'Suresh Nair' : 'Suresh Nair';

  const [actionBanner, setActionBanner] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Filter accessible checklists based on role
  const accessibleChecklists = pmChecklists.filter((c) => {
    if (activeRole === 'Technician') {
      return c.assignedTechnician === currentTechName;
    }
    if (activeRole === 'Admin') {
      return (
        c.status === 'Failed / Pending Admin Review' ||
        (c.status === 'Closed' && c.checklistItems.some((i) => i.result === 'Fail'))
      );
    }
    // Engineer views all scheduled and submitted checklists
    return true;
  });

  const queryPmId = searchParams.get('pmId');
  const currentChecklist =
    accessibleChecklists.find((c) => c.pmId === queryPmId) ||
    accessibleChecklists[0] ||
    null;

  const failedItems = currentChecklist
    ? currentChecklist.checklistItems.filter((i) => i.result === 'Fail')
    : [];
  const hasFailures = failedItems.length > 0;

  // Only the assigned Technician can edit an unsubmitted checklist
  const isTechnicianEditable =
    activeRole === 'Technician' &&
    Boolean(currentChecklist) &&
    currentChecklist.assignedTechnician === currentTechName &&
    TECHNICIAN_EDITABLE_STATUSES.includes(currentChecklist.status);

  const handleSelectChecklist = (pmId) => {
    setSearchParams({ pmId });
    setActionBanner(null);
    setValidationError('');
  };

  // Technician editing handlers
  const handleChecklistItemChange = (itemId, field, value) => {
    if (!isTechnicianEditable) return;
    setValidationError('');
    updatePmChecklist(currentChecklist.pmId, (c) => ({
      ...c,
      status: c.status === 'Scheduled' ? 'In Progress' : c.status,
      checklistItems: c.checklistItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleImageUpload = (e) => {
    if (!isTechnicianEditable) return;
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const uploaded = files.map((file, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      name: file.name,
      uploadedAt: formatNowTimestamp(),
      url: URL.createObjectURL(file),
    }));

    updatePmChecklist(currentChecklist.pmId, (c) => ({
      ...c,
      status: c.status === 'Scheduled' ? 'In Progress' : c.status,
      supportingImages: [...c.supportingImages, ...uploaded],
    }));
    e.target.value = '';
  };

  const handleRemoveImage = (imageId) => {
    if (!isTechnicianEditable) return;
    updatePmChecklist(currentChecklist.pmId, (c) => ({
      ...c,
      supportingImages: c.supportingImages.filter((img) => img.id !== imageId),
    }));
  };

  const handleAddSpareRow = () => {
    if (!isTechnicianEditable) return;
    const firstPart = spareParts[0]?.partCode || 'SP-101';
    updatePmChecklist(currentChecklist.pmId, (c) => ({
      ...c,
      usedParts: [...c.usedParts, { id: Date.now(), partCode: firstPart, quantityUsed: 1 }],
    }));
  };

  const handleRemoveSpareRow = (rowId) => {
    if (!isTechnicianEditable) return;
    updatePmChecklist(currentChecklist.pmId, (c) => ({
      ...c,
      usedParts: c.usedParts.filter((r) => r.id !== rowId),
    }));
  };

  const handlePartRowChange = (rowId, field, value) => {
    if (!isTechnicianEditable) return;
    updatePmChecklist(currentChecklist.pmId, (c) => ({
      ...c,
      usedParts: c.usedParts.map((r) =>
        r.id === rowId
          ? {
              ...r,
              [field]: field === 'quantityUsed' ? Math.max(0, Number(value)) : value,
            }
          : r
      ),
    }));
  };

  // Technician: Save as Draft
  const handleSaveDraft = () => {
    if (!isTechnicianEditable) return;
    updatePmChecklist(currentChecklist.pmId, (c) => ({
      ...c,
      status: 'Draft',
    }));
    setValidationError('');
    setActionBanner({
      tone: 'blue',
      title: `Draft Saved (${currentChecklist.pmId})`,
      message: 'Your inspection readings, remarks, and images have been saved as a Draft.',
    });
  };

  // Validate before opening Submit confirmation
  const handleRequestSubmit = () => {
    if (!isTechnicianEditable || !currentChecklist) return;
    const missingFailRemarks = failedItems.filter((item) => !item.remarks.trim());
    if (missingFailRemarks.length > 0) {
      setValidationError(
        `Please add remarks for all failed checklist items (${missingFailRemarks.length} failed item${
          missingFailRemarks.length > 1 ? 's' : ''
        } missing remarks).`
      );
      return;
    }
    setValidationError('');
    setIsSubmitConfirmOpen(true);
  };

  // Automatic Pass / Fail Workflow Execution
  const handleConfirmSubmit = () => {
    if (!currentChecklist) return;
    const result = submitPmChecklist(currentChecklist.pmId);
    setIsSubmitConfirmOpen(false);

    if (!result) return;
    if (result.hasFailures) {
      setActionBanner({
        tone: 'red',
        title: `${currentChecklist.pmId} Marked as Failed / Pending Admin Review`,
        message: `${result.failedCount} failed inspection item${
          result.failedCount > 1 ? 's' : ''
        } detected. The complete checklist (remarks & images) has been automatically forwarded to Admin's PM Failure Review list and is now read-only.`,
      });
    } else {
      setActionBanner({
        tone: 'green',
        title: `${currentChecklist.pmId} Marked as Completed`,
        message:
          'All checklist items passed! The completed PM checklist has been saved to PM History and locked in read-only mode (no Admin failure review required).',
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Role Switcher Banner */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0b57d0] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#0f172a]">
              PM Checklist — {activeRole} View ({user?.name})
            </p>
            <p className="text-[11px] font-medium text-[#64748b] mt-0.5">
              {activeRole === 'Technician' &&
                'Fill assigned PM checklists, mark Pass/Fail, upload photos, save Draft, or submit for automatic Pass/Fail routing.'}
              {activeRole === 'Engineer' &&
                'View scheduled and completed PM checklists. Schedule new PM tasks and assign Technicians from PM Calendar.'}
              {activeRole === 'Admin' &&
                `Viewing failed checklists queued for Admin PM Failure Review (${adminFailureQueue.filter((f) => f.status === 'Failed / Pending Admin Review').length} pending).`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/pm/calendar')}
            className="h-9 px-3.5 rounded-xl bg-[#f3f6fb] hover:bg-[#e8effa] text-[#334155] hover:text-[#0b57d0] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PM Calendar</span>
          </button>
        </div>
      </section>

      {/* Action Feedback Banner */}
      {actionBanner && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
            actionBanner.tone === 'green'
              ? 'bg-[#e8f8ef] border-[#bbf7d0] text-[#15803d]'
              : actionBanner.tone === 'red'
                ? 'bg-[#feeceb] border-[#fecaca] text-[#b91c1c]'
                : 'bg-[#eef4ff] border-[#bfdbfe] text-[#0b57d0]'
          }`}
        >
          {actionBanner.tone === 'red' ? (
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-extrabold">{actionBanner.title}</p>
            <p className="mt-0.5 font-medium">{actionBanner.message}</p>
          </div>
        </div>
      )}

      {validationError && (
        <div className="p-4 rounded-2xl bg-[#feeceb] border border-[#fecaca] text-[#b91c1c] text-xs font-bold flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Panel: Assigned PM Tasks List */}
        <aside className="xl:col-span-4 bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#0f172a]">
                {activeRole === 'Technician'
                  ? 'My Assigned PM Tasks'
                  : activeRole === 'Admin'
                    ? 'Admin PM Failure Queue'
                    : 'Scheduled & Submitted PMs'}
              </h3>
              <p className="text-[11px] text-[#64748b] mt-0.5">
                {accessibleChecklists.length} record
                {accessibleChecklists.length === 1 ? '' : 's'} available
              </p>
            </div>
            <ClipboardCheck className="w-4 h-4 text-[#0b57d0]" />
          </div>

          <div className="divide-y divide-[#f1f5f9] max-h-[680px] overflow-y-auto">
            {accessibleChecklists.map((item) => {
              const isSelected = currentChecklist?.pmId === item.pmId;
              const failCount = item.checklistItems.filter(
                (q) => q.result === 'Fail'
              ).length;

              return (
                <button
                  key={item.pmId}
                  type="button"
                  onClick={() => handleSelectChecklist(item.pmId)}
                  className={`w-full text-left p-4 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#eef4ff]/70 border-l-4 border-[#0b57d0]'
                      : 'hover:bg-[#f8fafc]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#0b57d0]">
                      {item.pmId}
                    </span>
                    <StatusBadge
                      status={item.status}
                      variant={CHECKLIST_STATUS_VARIANTS[item.status] || 'blue'}
                      showDot
                      className="px-2 py-0.5 text-[10.5px]"
                    />
                  </div>
                  <p className="text-xs font-bold text-[#0f172a] mt-1">
                    {item.machineId} — {item.machineName}
                  </p>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    {item.frequency} • {item.scheduledDate} • Tech: {item.assignedTechnician}
                  </p>
                  {failCount > 0 && (
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-[#feeceb] text-[#b91c1c] text-[10.5px] font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      {failCount} Failed Item{failCount > 1 ? 's' : ''}
                    </span>
                  )}
                </button>
              );
            })}

            {accessibleChecklists.length === 0 && (
              <div className="p-8 text-center text-xs text-[#64748b]">
                No PM checklists found for this role.
              </div>
            )}
          </div>
        </aside>

        {/* Right Panel: Selected PM Checklist Sheet */}
        <div className="xl:col-span-8 space-y-5">
          {!currentChecklist ? (
            <div className="bg-white rounded-2xl border border-[#edf1f7] p-10 text-center text-sm text-[#64748b]">
              Select a PM task from the left to view or fill its inspection checklist.
            </div>
          ) : (
            <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden">
              {/* Top Checklist Sheet Header */}
              <div className="p-6 border-b border-[#f1f5f9] bg-[#f8fafc]/70 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={sankoLogo}
                      alt="Sanko Gosei"
                      className="h-9 object-contain mix-blend-multiply"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
                          {currentChecklist.pmId}
                        </span>
                        <StatusBadge
                          status={currentChecklist.status}
                          variant={
                            CHECKLIST_STATUS_VARIANTS[currentChecklist.status] || 'blue'
                          }
                          showDot
                        />
                      </div>
                      <h2 className="text-base sm:text-lg font-extrabold text-[#0f172a] mt-1">
                        {currentChecklist.machineId} — {currentChecklist.machineName}
                      </h2>
                    </div>
                  </div>

                  {!isTechnicianEditable && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f1f5f9] text-[#475569] text-xs font-bold self-start sm:self-center">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Read-Only</span>
                    </span>
                  )}
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#edf1f7]">
                    <p className="text-[10.5px] text-[#64748b]">Scheduled Date</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {currentChecklist.scheduledDate}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#edf1f7]">
                    <p className="text-[10.5px] text-[#64748b]">Frequency</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {currentChecklist.frequency}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#edf1f7]">
                    <p className="text-[10.5px] text-[#64748b]">Technician</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {currentChecklist.assignedTechnician}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#edf1f7]">
                    <p className="text-[10.5px] text-[#64748b]">Scheduled By</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {currentChecklist.assignedEngineer}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#edf1f7]">
                    <p className="text-[10.5px] text-[#64748b]">Inspection Date</p>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {currentChecklist.inspectionDate}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#edf1f7]">
                    <p className="text-[10.5px] text-[#64748b]">Submission Date</p>
                    <p className="font-bold text-[#0b57d0] mt-0.5">
                      {currentChecklist.submissionDate}
                    </p>
                  </div>
                </div>

                {/* Highlight Banner if Any Item Failed */}
                {hasFailures && (
                  <div className="p-3.5 rounded-xl bg-[#feeceb] border border-[#fecaca] text-[#991b1b] text-xs flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold">
                        {failedItems.length} Failed Inspection Checkpoint
                        {failedItems.length > 1 ? 's' : ''} Detected
                      </p>
                      <p className="text-[#b91c1c] mt-0.5">
                        {currentChecklist.status === 'Failed / Pending Admin Review'
                          ? 'Automatically routed to Admin PM Failure Review list. Technician remarks and uploaded images are attached.'
                          : currentChecklist.status === 'Closed'
                            ? `Closed by ${currentChecklist.closedBy} on ${currentChecklist.closedAt}.`
                            : 'Submitting this checklist will mark it as Failed / Pending Admin Review and send it directly to Admin.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Checklist Items */}
              <div className="p-6 space-y-3">
                <h3 className="text-xs font-extrabold text-[#64748b] uppercase tracking-wider">
                  Inspection Checkpoints ({currentChecklist.checklistItems.length})
                </h3>

                <div className="space-y-3">
                  {currentChecklist.checklistItems.map((item, index) => {
                    const isFail = item.result === 'Fail';
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-colors text-xs space-y-3 ${
                          isFail
                            ? 'bg-[#feeceb]/45 border-[#fca5a5]'
                            : 'bg-[#f8fafc]/70 border-[#edf1f7]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`w-6 h-6 rounded-lg font-extrabold flex items-center justify-center shrink-0 ${
                                isFail
                                  ? 'bg-[#dc2626] text-white'
                                  : 'bg-[#eef4ff] text-[#0b57d0]'
                              }`}
                            >
                              {index + 1}
                            </span>
                            <p className="font-bold text-[#0f172a] leading-snug pt-0.5">
                              {item.task}
                            </p>
                          </div>

                          {/* Pass / Fail Toggle */}
                          <div className="inline-flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              disabled={!isTechnicianEditable}
                              onClick={() =>
                                handleChecklistItemChange(item.id, 'result', 'Pass')
                              }
                              className={`px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1 transition-all ${
                                item.result === 'Pass'
                                  ? 'bg-[#15803d] text-white'
                                  : 'bg-white border border-[#d6deeb] text-[#475569]'
                              } ${isTechnicianEditable ? 'cursor-pointer' : 'opacity-80'}`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Pass</span>
                            </button>
                            <button
                              type="button"
                              disabled={!isTechnicianEditable}
                              onClick={() =>
                                handleChecklistItemChange(item.id, 'result', 'Fail')
                              }
                              className={`px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1 transition-all ${
                                item.result === 'Fail'
                                  ? 'bg-[#dc2626] text-white'
                                  : 'bg-white border border-[#d6deeb] text-[#475569]'
                              } ${isTechnicianEditable ? 'cursor-pointer' : 'opacity-80'}`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Fail</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#64748b] mb-1">
                              {item.paramLabel}
                            </label>
                            <input
                              type="text"
                              disabled={!isTechnicianEditable}
                              value={item.paramValue}
                              onChange={(e) =>
                                handleChecklistItemChange(
                                  item.id,
                                  'paramValue',
                                  e.target.value
                                )
                              }
                              className="w-full h-9 px-3 bg-white border border-[#d6deeb] rounded-lg font-bold text-[#0f172a] disabled:bg-[#f1f5f9] focus:outline-none focus:border-[#0b57d0]"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              className={`block text-[11px] font-bold mb-1 ${
                                isFail ? 'text-[#b91c1c]' : 'text-[#64748b]'
                              }`}
                            >
                              {isFail ? 'Failure Remarks (Required) *' : 'Inspection Remarks'}
                            </label>
                            <input
                              type="text"
                              disabled={!isTechnicianEditable}
                              value={item.remarks}
                              onChange={(e) =>
                                handleChecklistItemChange(
                                  item.id,
                                  'remarks',
                                  e.target.value
                                )
                              }
                              placeholder={
                                isFail
                                  ? 'Explain the failure details for Admin review...'
                                  : 'Add observation notes...'
                              }
                              className={`w-full h-9 px-3 bg-white border rounded-lg font-medium text-[#0f172a] disabled:bg-[#f1f5f9] focus:outline-none focus:border-[#0b57d0] ${
                                isFail ? 'border-[#fca5a5]' : 'border-[#d6deeb]'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Supporting Images Section */}
                <div className="pt-4 border-t border-[#f1f5f9] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-[#0f172a] flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#0b57d0]" />
                      <span>
                        Supporting Inspection Images ({currentChecklist.supportingImages.length})
                      </span>
                    </h4>
                    {isTechnicianEditable && (
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white font-bold cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {currentChecklist.supportingImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {currentChecklist.supportingImages.map((img) => (
                        <div
                          key={img.id}
                          className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7] flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-[#0f172a] truncate">{img.name}</p>
                            <p className="text-[10.5px] text-[#64748b]">{img.uploadedAt}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {img.url && (
                              <button
                                type="button"
                                onClick={() => setPreviewImage(img)}
                                className="p-1.5 rounded-lg bg-[#eef4ff] text-[#0b57d0] hover:bg-[#0b57d0] hover:text-white cursor-pointer"
                                title="Preview Image"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {isTechnicianEditable && (
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(img.id)}
                                className="p-1.5 rounded-lg bg-[#feeceb] text-[#b91c1c] hover:bg-[#dc2626] hover:text-white cursor-pointer"
                                title="Remove Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#64748b] p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                      No inspection images uploaded yet.
                    </p>
                  )}
                </div>

                {/* Spare Parts Used */}
                <div className="pt-4 border-t border-[#f1f5f9] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-[#0f172a] flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#0b57d0]" />
                      <span>Spare Parts Consumed (Optional)</span>
                    </h4>
                    {isTechnicianEditable && (
                      <button
                        type="button"
                        onClick={handleAddSpareRow}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#f3f6fb] hover:bg-[#eef4ff] text-[#334155] hover:text-[#0b57d0] font-bold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Part</span>
                      </button>
                    )}
                  </div>

                  {currentChecklist.usedParts.length > 0 && (
                    <div className="space-y-2">
                      {currentChecklist.usedParts.map((row) => (
                        <div key={row.id} className="flex items-center gap-2">
                          <select
                            disabled={!isTechnicianEditable}
                            value={row.partCode}
                            onChange={(e) =>
                              handlePartRowChange(row.id, 'partCode', e.target.value)
                            }
                            className="flex-1 h-9 px-3 bg-[#f8fafc] border border-[#d6deeb] rounded-lg font-semibold text-[#0f172a]"
                          >
                            {spareParts.map((sp) => (
                              <option key={sp.partCode} value={sp.partCode}>
                                {sp.partCode} — {sp.description}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="1"
                            disabled={!isTechnicianEditable}
                            value={row.quantityUsed}
                            onChange={(e) =>
                              handlePartRowChange(row.id, 'quantityUsed', e.target.value)
                            }
                            className="w-20 h-9 px-2.5 bg-[#f8fafc] border border-[#d6deeb] rounded-lg font-bold text-[#0f172a]"
                          />
                          {isTechnicianEditable && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSpareRow(row.id)}
                              className="p-2 rounded-lg bg-[#feeceb] text-[#b91c1c] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Overall Technician Remarks */}
                <div className="pt-4 border-t border-[#f1f5f9] text-xs">
                  <label className="block font-extrabold text-[#0f172a] mb-1.5">
                    Technician Overall Remarks
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isTechnicianEditable}
                    value={currentChecklist.finalRemarks}
                    onChange={(e) =>
                      updatePmChecklist(currentChecklist.pmId, (c) => ({
                        ...c,
                        finalRemarks: e.target.value,
                      }))
                    }
                    placeholder="Enter overall machine condition, adjustments made, or failure summary..."
                    className="w-full p-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-[#0f172a] disabled:opacity-70 focus:outline-none focus:border-[#0b57d0]"
                  />
                </div>

                {/* Technician Footer Actions */}
                {isTechnicianEditable && (
                  <div className="pt-4 border-t border-[#f1f5f9] flex flex-wrap items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="h-10 px-5 rounded-xl border border-[#d6deeb] bg-white hover:bg-[#f8fafc] text-[#334155] text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Draft</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestSubmit}
                      className="h-10 px-6 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Checklist</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Automatic Pass / Fail Routing */}
      <Modal
        isOpen={isSubmitConfirmOpen}
        onClose={() => setIsSubmitConfirmOpen(false)}
        title="Confirm PM Checklist Submission"
        subtitle={
          currentChecklist
            ? `${currentChecklist.pmId} • ${currentChecklist.machineId} (${currentChecklist.machineName})`
            : ''
        }
      >
        {currentChecklist && (
          <div className="p-6 space-y-4 text-xs">
            {hasFailures ? (
              <div className="p-4 rounded-xl bg-[#feeceb] border border-[#fecaca] text-[#991b1b] space-y-1.5">
                <p className="font-extrabold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
                  <span>
                    {failedItems.length} Failed Item{failedItems.length > 1 ? 's' : ''}{' '}
                    Detected — Routing to Admin Review
                  </span>
                </p>
                <p className="text-[#b91c1c]">
                  Status will be set to <strong>Failed / Pending Admin Review</strong> and
                  the complete checklist (remarks &amp; uploaded images) will be sent
                  directly to Admin&apos;s PM Failure Review list. You will not be able to
                  edit this checklist after submission.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#e8f8ef] border border-[#bbf7d0] text-[#15803d] space-y-1.5">
                <p className="font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                  <span>All Checkpoints Passed — Auto-Complete PM</span>
                </p>
                <p>
                  Status will be set to <strong>Completed</strong>, saved immediately to{' '}
                  <strong>PM History</strong>, and locked read-only. No Admin failure
                  review is required.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f1f5f9]">
              <button
                type="button"
                onClick={() => setIsSubmitConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className={`px-5 py-2 rounded-xl text-white font-bold cursor-pointer ${
                  hasFailures
                    ? 'bg-[#dc2626] hover:bg-[#b91c1c]'
                    : 'bg-[#15803d] hover:bg-[#166534]'
                }`}
              >
                {hasFailures ? 'Submit & Send to Admin' : 'Confirm & Complete PM'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.name || 'Inspection Image'}
        subtitle={previewImage ? `Uploaded at ${previewImage.uploadedAt}` : ''}
      >
        {previewImage && (
          <div className="p-6 text-center">
            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="max-h-[60vh] mx-auto rounded-xl border border-[#edf1f7]"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PMChecklist;
