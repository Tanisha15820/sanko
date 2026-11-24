import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Upload,
  CheckCircle2,
  Lock,
  Image as ImageIcon,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBreakdowns } from '../../context/BreakdownContext';
import StatusBadge from '../../components/common/StatusBadge';
import {
  CATEGORY_OPTIONS,
  ENGINEER_OPTIONS,
  calculateDowntimeMinutes,
  formatDowntime,
  formatDateTimeDisplay,
} from './breakdownData';
import { RCA_STATUS_VARIANTS, createEmptyRcaDraft } from './rcaData';

const SectionHeader = ({ code, title }) => (
  <div className="bg-[#0b57d0]/8 border-y border-[#cbd5e1] px-5 py-2.5 flex items-center gap-2">
    <span className="px-2 py-0.5 rounded bg-[#0b57d0] text-white text-[10.5px] font-extrabold tracking-wide">
      {code}
    </span>
    <h3 className="text-xs sm:text-sm font-extrabold text-[#1e3a5f] uppercase tracking-wider">
      {title}
    </h3>
  </div>
);

const RCAForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const breakdownIdParam = searchParams.get('breakdownId');

  const { user, activeRole } = useAuth();
  const {
    breakdowns,
    rcaEligibleBreakdowns,
    getRcaByBreakdownId,
    getNextRcaId,
    saveRcaReport,
  } = useBreakdowns();

  const breakdown =
    breakdowns.find((b) => b.breakdownId === breakdownIdParam) ||
    rcaEligibleBreakdowns[0] ||
    null;

  const existingReport = breakdown ? getRcaByBreakdownId(breakdown.breakdownId) : null;

  const [formData, setFormData] = useState(() => {
    if (existingReport) return { ...existingReport };
    if (breakdown) {
      return createEmptyRcaDraft(
        breakdown,
        getNextRcaId(),
        user?.name || ENGINEER_OPTIONS[0]
      );
    }
    return null;
  });

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!breakdown || !formData) {
    return (
      <div className="bg-white rounded-2xl border border-[#edf1f7] p-8 text-center space-y-4">
        <p className="text-sm font-semibold text-[#64748b]">
          Breakdown record not found for RCA.
        </p>
        <button
          type="button"
          onClick={() => navigate('/breakdowns/rca')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b57d0] text-white text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to RCA Management</span>
        </button>
      </div>
    );
  }

  const downtimeMins = calculateDowntimeMinutes(
    breakdown.breakdownStartTime,
    breakdown.actualRepairCompletionTime
  );
  const currentStatus = existingReport ? existingReport.status : formData.status || 'RCA Required';
  const isSubmittedOrClosed =
    currentStatus === 'Pending Admin Review' || currentStatus === 'Closed';
  const isAssignedToCurrentEngineer =
    activeRole === 'Engineer' && breakdown.assignedEngineer === user?.name;
  const isReadOnly = isSubmittedOrClosed || !isAssignedToCurrentEngineer;

  const handleImageUpload = (nameKey, urlKey) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      [nameKey]: file.name,
      [urlKey]: URL.createObjectURL(file),
    }));
  };

  const handleSaveDraft = () => {
    setErrorMsg('');
    const saved = saveRcaReport(formData, 'Draft');
    setFormData(saved);
    setFeedbackMsg(
      `Draft saved successfully (${saved.rcaId}). You can continue editing before submission.`
    );
  };

  const handleSubmitRca = (e) => {
    e.preventDefault();
    if (
      !formData.failureDetails.trim() ||
      !formData.why1.trim() ||
      !formData.finalRootCause.trim() ||
      !formData.permanentCountermeasure.trim() ||
      !formData.targetCompletionDate
    ) {
      setErrorMsg(
        'Please complete Failure Details, Why 1, Final Root Cause, Permanent Countermeasure, and Target Completion Date before submitting.'
      );
      return;
    }

    setErrorMsg('');
    const submitted = saveRcaReport(formData, 'Submit');
    setFormData(submitted);
    setFeedbackMsg(
      `RCA Report ${submitted.rcaId} submitted successfully! Status changed to Pending Admin Review and form is now read-only.`
    );
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/breakdowns/rca')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b57d0] hover:text-[#0947ab] cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to RCA Action Plans</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
            {formData.rcaId}
          </span>
          <StatusBadge
            status={currentStatus}
            variant={RCA_STATUS_VARIANTS[currentStatus] || 'blue'}
            showDot
          />
        </div>
      </div>

      {/* Confirmation / Read-only / Error Banners */}
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-[#e8f8ef] border border-[#bbf7d0] text-[#15803d] text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#feeceb] border border-[#fecaca] text-[#b91c1c] text-xs font-bold flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isReadOnly && (
        <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] text-[#334155] text-xs font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#0b57d0] shrink-0" />
          <span>
            {isSubmittedOrClosed
              ? `This RCA report is ${currentStatus} and is locked in read-only mode.`
              : `Read-only mode: Only the assigned Engineer (${breakdown.assignedEngineer}) can edit or submit this RCA.`}
          </span>
        </div>
      )}

      {/* Structured Industrial CAPA Inspection Sheet */}
      <form
        onSubmit={handleSubmitRca}
        className="bg-white rounded-2xl border border-[#cbd5e1] shadow-[0_4px_20px_rgba(15,23,42,0.04)] overflow-hidden text-xs"
      >
        {/* Document Sheet Header */}
        <div className="px-6 py-5 bg-[#f8fafc] border-b border-[#cbd5e1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#0b57d0]">
              Sanko Gosei Maintenance 4.0 — CAPA Inspection Sheet
            </p>
            <h2 className="text-lg font-extrabold text-[#0f172a] mt-0.5">
              Root Cause Analysis (RCA) Report Form
            </h2>
          </div>
          <div className="text-left sm:text-right text-xs text-[#475569]">
            <p>
              <strong>RCA ID:</strong> {formData.rcaId}
            </p>
            <p>
              <strong>Ref Breakdown:</strong> {breakdown.breakdownId}
            </p>
          </div>
        </div>

        {/* SECTION A: BREAKDOWN INFORMATION (Read-only structured table) */}
        <SectionHeader code="SECTION A" title="Breakdown Information" />
        <div className="p-5">
          <div className="overflow-x-auto border border-[#cbd5e1] rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <tbody className="divide-y divide-[#cbd5e1]">
                <tr>
                  <th className="w-44 bg-[#f8fafc] px-3.5 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    RCA ID
                  </th>
                  <td className="px-3.5 py-2.5 font-extrabold text-[#0b57d0] border-r border-[#cbd5e1]">
                    {formData.rcaId}
                  </td>
                  <th className="w-44 bg-[#f8fafc] px-3.5 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    Breakdown ID
                  </th>
                  <td className="px-3.5 py-2.5 font-bold text-[#0f172a]">
                    {breakdown.breakdownId}
                  </td>
                </tr>
                <tr>
                  <th className="bg-[#f8fafc] px-3.5 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    Machine Name
                  </th>
                  <td className="px-3.5 py-2.5 font-semibold text-[#0f172a] border-r border-[#cbd5e1]">
                    {breakdown.machineName}
                  </td>
                  <th className="bg-[#f8fafc] px-3.5 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    Machine ID
                  </th>
                  <td className="px-3.5 py-2.5 font-bold text-[#0f172a]">
                    {breakdown.machineId}
                  </td>
                </tr>
                <tr>
                  <th className="bg-[#f8fafc] px-3.5 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    Production Line
                  </th>
                  <td className="px-3.5 py-2.5 text-[#334155] border-r border-[#cbd5e1]">
                    {breakdown.plantLine}
                  </td>
                  <th className="bg-[#f8fafc] px-3.5 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    Breakdown Date
                  </th>
                  <td className="px-3.5 py-2.5 text-[#334155]">
                    {breakdown.breakdownDate}
                  </td>
                </tr>
                <tr>
                  <th className="bg-[#f8fafc] px-3.5 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    Breakdown Start Time
                  </th>
                  <td className="px-3.5 py-2.5 text-[#334155] border-r border-[#cbd5e1]">
                    {formatDateTimeDisplay(breakdown.breakdownStartTime)}
                  </td>
                  <th className="bg-[#f8fafc] px-3.5 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    Repair Start Time
                  </th>
                  <td className="px-3.5 py-2.5 text-[#334155]">
                    {formatDateTimeDisplay(breakdown.repairStartTime)}
                  </td>
                </tr>
                <tr>
                  <th className="bg-[#f8fafc] px-3.5 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    Actual Repair Completion
                  </th>
                  <td className="px-3.5 py-2.5 text-[#334155] border-r border-[#cbd5e1]">
                    {formatDateTimeDisplay(breakdown.actualRepairCompletionTime)}
                  </td>
                  <th className="bg-[#f8fafc] px-3.5 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    Total Downtime
                  </th>
                  <td className="px-3.5 py-2.5 font-extrabold text-[#b91c1c]">
                    {formatDowntime(downtimeMins)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION B: PROBLEM DETAILS */}
        <SectionHeader code="SECTION B" title="Problem Details" />
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-[#1e3a5f] mb-1.5">
                Problem Description *
              </label>
              <textarea
                rows={2}
                disabled={isReadOnly}
                value={formData.problemDescription}
                onChange={(e) =>
                  setFormData({ ...formData, problemDescription: e.target.value })
                }
                className="w-full p-3 bg-white border border-[#cbd5e1] rounded-lg text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1e3a5f] mb-1.5">
                Breakdown Category *
              </label>
              <select
                disabled={isReadOnly}
                value={formData.breakdownCategory}
                onChange={(e) =>
                  setFormData({ ...formData, breakdownCategory: e.target.value })
                }
                className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-lg font-semibold text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <label className="block font-bold text-[#1e3a5f] mb-1.5">
                Failure / Defect Details *
              </label>
              <textarea
                rows={3}
                disabled={isReadOnly}
                value={formData.failureDetails}
                onChange={(e) =>
                  setFormData({ ...formData, failureDetails: e.target.value })
                }
                placeholder="Describe failure symptoms, affected component, measurements, and operational impact..."
                className="w-full p-3 bg-white border border-[#cbd5e1] rounded-lg text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1e3a5f] mb-1.5">
                Defect Image Upload
              </label>
              <div className="border border-dashed border-[#94a3b8] rounded-lg p-3 bg-[#f8fafc] text-center space-y-2">
                {formData.defectImageUrl ? (
                  <img
                    src={formData.defectImageUrl}
                    alt="Defect"
                    className="w-full h-24 object-cover rounded border border-[#e2e8f0]"
                  />
                ) : (
                  <div className="h-16 flex flex-col items-center justify-center text-[#64748b]">
                    <ImageIcon className="w-5 h-5 mb-1 text-[#94a3b8]" />
                    <span className="text-[11px] font-medium truncate max-w-full px-1">
                      {formData.defectImageName || 'No image uploaded'}
                    </span>
                  </div>
                )}
                {!isReadOnly && (
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload('defectImageName', 'defectImageUrl')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION C: ROOT CAUSE */}
        <SectionHeader code="SECTION C" title="ROOT CAUSE" />
        <div className="p-5 space-y-3.5">
          {[
            { key: 'why1', label: 'Why 1 *', placeholder: 'Why did the failure occur?' },
            { key: 'why2', label: 'Why 2', placeholder: 'Why did the condition in Why 1 happen?' },
            { key: 'why3', label: 'Why 3', placeholder: 'Why did the condition in Why 2 happen?' },
            { key: 'why4', label: 'Why 4', placeholder: 'Why did the systemic cause occur?' },
          ].map((item) => (
            <div key={item.key} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
              <label className="md:col-span-2 pt-2 font-bold text-[#1e3a5f]">
                {item.label}
              </label>
              <textarea
                rows={2}
                disabled={isReadOnly}
                value={formData[item.key]}
                onChange={(e) =>
                  setFormData({ ...formData, [item.key]: e.target.value })
                }
                placeholder={item.placeholder}
                className="md:col-span-10 w-full p-2.5 bg-white border border-[#cbd5e1] rounded-lg text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start pt-2 border-t border-[#e2e8f0]">
            <label className="md:col-span-2 pt-2 font-extrabold text-[#b91c1c]">
              Final Root Cause *
            </label>
            <textarea
              rows={3}
              disabled={isReadOnly}
              value={formData.finalRootCause}
              onChange={(e) =>
                setFormData({ ...formData, finalRootCause: e.target.value })
              }
              placeholder="Summarize the verified fundamental root cause..."
              className="md:col-span-10 w-full p-2.5 bg-[#fffafa] border border-[#fca5a5] rounded-lg font-medium text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>
        </div>

        {/* SECTION D: CORRECTIVE ACTIONS */}
        <SectionHeader code="SECTION D" title="Corrective Actions" />
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1e3a5f] mb-1.5">
                Temporary Countermeasure
              </label>
              <textarea
                rows={3}
                disabled={isReadOnly}
                value={formData.temporaryCountermeasure}
                onChange={(e) =>
                  setFormData({ ...formData, temporaryCountermeasure: e.target.value })
                }
                placeholder="Immediate containment action taken to resume production..."
                className="w-full p-3 bg-white border border-[#cbd5e1] rounded-lg text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1e3a5f] mb-1.5">
                Radical / Permanent Countermeasure *
              </label>
              <textarea
                rows={3}
                disabled={isReadOnly}
                value={formData.permanentCountermeasure}
                onChange={(e) =>
                  setFormData({ ...formData, permanentCountermeasure: e.target.value })
                }
                placeholder="Permanent engineering fix to eliminate recurrence..."
                className="w-full p-3 bg-white border border-[#cbd5e1] rounded-lg text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1e3a5f] mb-1.5">
                Responsible Person *
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.responsiblePerson}
                onChange={(e) =>
                  setFormData({ ...formData, responsiblePerson: e.target.value })
                }
                className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-lg font-semibold text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1e3a5f] mb-1.5">
                Target Completion Date *
              </label>
              <input
                type="date"
                disabled={isReadOnly}
                value={formData.targetCompletionDate}
                onChange={(e) =>
                  setFormData({ ...formData, targetCompletionDate: e.target.value })
                }
                className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-lg font-semibold text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>
          </div>
        </div>

        {/* SECTION E: PREVENTIVE ACTIONS */}
        <SectionHeader code="SECTION E" title="Preventive Actions" />
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-[#1e3a5f] mb-1.5">
              Inspection Control Plan
            </label>
            <textarea
              rows={3}
              disabled={isReadOnly}
              value={formData.inspectionControlPlan}
              onChange={(e) =>
                setFormData({ ...formData, inspectionControlPlan: e.target.value })
              }
              placeholder="PM checklist additions or periodic inspection criteria..."
              className="w-full p-3 bg-white border border-[#cbd5e1] rounded-lg text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#1e3a5f] mb-1.5">
              Process Control Plan
            </label>
            <textarea
              rows={3}
              disabled={isReadOnly}
              value={formData.processControlPlan}
              onChange={(e) =>
                setFormData({ ...formData, processControlPlan: e.target.value })
              }
              placeholder="PLC limits, alarms, or process parameter controls..."
              className="w-full p-3 bg-white border border-[#cbd5e1] rounded-lg text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#1e3a5f] mb-1.5">
              Prevention Plan
            </label>
            <textarea
              rows={3}
              disabled={isReadOnly}
              value={formData.preventionPlan}
              onChange={(e) =>
                setFormData({ ...formData, preventionPlan: e.target.value })
              }
              placeholder="Horizontal deployment across similar machines & training..."
              className="w-full p-3 bg-white border border-[#cbd5e1] rounded-lg text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
            />
          </div>
        </div>

        {/* SECTION F: IMPROVEMENT EVIDENCE (3 Horizontal Image Upload Boxes) */}
        <SectionHeader code="SECTION F" title="Improvement Evidence" />
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Before Improvement',
              nameKey: 'beforeImageName',
              urlKey: 'beforeImageUrl',
            },
            {
              title: 'After Improvement',
              nameKey: 'afterImageName',
              urlKey: 'afterImageUrl',
            },
            {
              title: 'Prevention Evidence',
              nameKey: 'preventionImageName',
              urlKey: 'preventionImageUrl',
            },
          ].map((box) => (
            <div
              key={box.title}
              className="border border-[#cbd5e1] rounded-xl p-4 bg-[#f8fafc] flex flex-col justify-between gap-3"
            >
              <p className="font-extrabold text-[#1e3a5f] text-center">{box.title}</p>
              {formData[box.urlKey] ? (
                <img
                  src={formData[box.urlKey]}
                  alt={box.title}
                  className="w-full h-36 object-cover rounded-lg border border-[#cbd5e1]"
                />
              ) : (
                <div className="h-36 rounded-lg border border-dashed border-[#94a3b8] bg-white flex flex-col items-center justify-center p-2 text-center text-[#64748b]">
                  <ImageIcon className="w-6 h-6 text-[#94a3b8] mb-1.5" />
                  <span className="text-[11px] font-semibold break-all">
                    {formData[box.nameKey] || 'No image selected'}
                  </span>
                </div>
              )}

              {!isReadOnly && (
                <label className="w-full py-2 rounded-lg bg-[#eef4ff] hover:bg-[#0b57d0] text-[#0b57d0] hover:text-white font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload(box.nameKey, box.urlKey)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* SECTION G: ENGINEER REMARKS */}
        <SectionHeader code="SECTION G" title="Engineer Remarks" />
        <div className="p-5">
          <textarea
            rows={4}
            disabled={isReadOnly}
            value={formData.engineerRemarks}
            onChange={(e) =>
              setFormData({ ...formData, engineerRemarks: e.target.value })
            }
            placeholder="Enter additional technical observations, trial run verification notes, or follow-up recommendations..."
            className="w-full p-3 bg-white border border-[#cbd5e1] rounded-lg text-[#0f172a] disabled:bg-[#f8fafc] focus:outline-none focus:border-[#0b57d0]"
          />
        </div>

        {/* Form Footer Actions */}
        {!isReadOnly && (
          <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#cbd5e1] flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-10 px-5 rounded-xl border border-[#cbd5e1] bg-white hover:bg-[#f1f5f9] text-[#334155] text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit RCA</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RCAForm;
