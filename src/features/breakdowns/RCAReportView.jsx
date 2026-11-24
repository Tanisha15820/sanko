import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBreakdowns } from '../../context/BreakdownContext';
import StatusBadge from '../../components/common/StatusBadge';
import {
  calculateDowntimeMinutes,
  formatDowntime,
  formatDateTimeDisplay,
} from './breakdownData';
import { RCA_STATUS_VARIANTS } from './rcaData';

const RCAReportView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rcaIdParam = searchParams.get('rcaId');

  const { activeRole, user } = useAuth();
  const { breakdowns, rcaReports, approveAndCloseRca } = useBreakdowns();

  const report =
    rcaReports.find((r) => r.rcaId === rcaIdParam) || rcaReports[0] || null;
  const breakdown = report
    ? breakdowns.find((b) => b.breakdownId === report.breakdownId) || null
    : null;

  const [adminRemarks, setAdminRemarks] = useState(report?.adminRemarks || '');
  const [justApproved, setJustApproved] = useState(false);

  if (!report) {
    return (
      <div className="bg-white rounded-2xl border border-[#edf1f7] p-8 text-center space-y-4">
        <p className="text-sm font-semibold text-[#64748b]">RCA Report not found.</p>
        <button
          type="button"
          onClick={() => navigate('/breakdowns/rca')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b57d0] text-white text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to RCA Register</span>
        </button>
      </div>
    );
  }

  const downtimeMins = breakdown
    ? calculateDowntimeMinutes(
        breakdown.breakdownStartTime,
        breakdown.actualRepairCompletionTime
      )
    : null;

  const isClosed = report.status === 'Closed';
  const canAdminApprove =
    activeRole === 'Admin' && report.status === 'Pending Admin Review';

  const handleApproveClose = () => {
    approveAndCloseRca(
      report.rcaId,
      adminRemarks,
      `${user?.name || 'Rajesh Kumar'} (Admin)`
    );
    setJustApproved(true);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/breakdowns/rca')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b57d0] hover:text-[#0947ab] mb-2 cursor-pointer print:hidden"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to RCA Register</span>
          </button>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
              RCA Corrective Review
            </h2>
            <StatusBadge
              status={report.status}
              variant={RCA_STATUS_VARIANTS[report.status] || 'blue'}
              showDot
            />
          </div>
          <p className="text-xs font-medium text-[#64748b] mt-1">
            RCA ID: <strong className="text-[#0b57d0]">{report.rcaId}</strong> • Reference
            Breakdown ID:{' '}
            <strong className="text-[#0f172a]">{report.breakdownId}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="h-10 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] inline-flex items-center justify-center gap-2 transition-all cursor-pointer self-start md:self-center print:hidden"
        >
          <Download className="w-4 h-4" />
          <span>Download Report (PDF)</span>
        </button>
      </div>

      {justApproved && (
        <div className="p-4 rounded-xl bg-[#e8f8ef] border border-[#bbf7d0] text-[#15803d] text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            RCA Report {report.rcaId} has been approved and formally Closed.
          </span>
        </div>
      )}

      {/* Formal Industrial Structured Report Table */}
      <section className="bg-white rounded-2xl border border-[#cbd5e1] shadow-[0_4px_20px_rgba(15,23,42,0.04)] overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <tbody>
              {/* 1. Breakdown Information */}
              <tr>
                <td
                  colSpan={4}
                  className="bg-[#1e3a5f] text-white px-5 py-2.5 font-extrabold uppercase tracking-wider text-xs"
                >
                  1. Breakdown Information
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="w-44 bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Machine Name &amp; ID
                </th>
                <td className="px-4 py-2.5 font-bold text-[#0f172a] border-r border-[#cbd5e1]">
                  {breakdown ? `${breakdown.machineId} — ${breakdown.machineName}` : '—'}
                </td>
                <th className="w-44 bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Production Line
                </th>
                <td className="px-4 py-2.5 text-[#334155]">
                  {breakdown?.plantLine || '—'}
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Breakdown Date
                </th>
                <td className="px-4 py-2.5 text-[#334155] border-r border-[#cbd5e1]">
                  {breakdown?.breakdownDate || '—'}
                </td>
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Breakdown Start Time
                </th>
                <td className="px-4 py-2.5 text-[#334155]">
                  {formatDateTimeDisplay(breakdown?.breakdownStartTime)}
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Repair Start / Completion
                </th>
                <td className="px-4 py-2.5 text-[#334155] border-r border-[#cbd5e1]">
                  {formatDateTimeDisplay(breakdown?.repairStartTime)} →{' '}
                  {formatDateTimeDisplay(breakdown?.actualRepairCompletionTime)}
                </td>
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Total Downtime
                </th>
                <td className="px-4 py-2.5 font-extrabold text-[#b91c1c]">
                  {formatDowntime(downtimeMins)}
                </td>
              </tr>

              {/* 2. Problem Details */}
              <tr>
                <td
                  colSpan={4}
                  className="bg-[#1e3a5f] text-white px-5 py-2.5 font-extrabold uppercase tracking-wider text-xs"
                >
                  2. Problem Details
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Problem Description
                </th>
                <td colSpan={3} className="px-4 py-2.5 font-semibold text-[#0f172a]">
                  {report.problemDescription}
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Breakdown Category
                </th>
                <td className="px-4 py-2.5 font-bold text-[#0b57d0] border-r border-[#cbd5e1]">
                  {report.breakdownCategory}
                </td>
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Submitted By / Date
                </th>
                <td className="px-4 py-2.5 text-[#334155]">
                  {report.submittedBy} ({report.submissionDate || '—'})
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-3 font-bold text-[#334155] border-r border-[#cbd5e1] align-top">
                  Failure / Defect Details
                </th>
                <td colSpan={2} className="px-4 py-3 text-[#334155] leading-relaxed border-r border-[#cbd5e1] align-top">
                  {report.failureDetails || '—'}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="border border-[#cbd5e1] rounded-lg p-2 bg-[#f8fafc] text-center">
                    <p className="text-[10.5px] font-bold text-[#64748b] mb-1">
                      Defect Image
                    </p>
                    {report.defectImageUrl ? (
                      <img
                        src={report.defectImageUrl}
                        alt="Defect"
                        className="w-full h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="h-20 flex flex-col items-center justify-center text-[#64748b]">
                        <ImageIcon className="w-5 h-5 text-[#94a3b8] mb-1" />
                        <span className="text-[10.5px] font-semibold break-all">
                          {report.defectImageName || 'No image attached'}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>

              {/* 3. Root Cause */}
              <tr>
                <td
                  colSpan={4}
                  className="bg-[#1e3a5f] text-white px-5 py-2.5 font-extrabold uppercase tracking-wider text-xs"
                >
                  3. Root Cause Analysis
                </td>
              </tr>
              {[
                { label: 'Why 1', value: report.why1 },
                { label: 'Why 2', value: report.why2 },
                { label: 'Why 3', value: report.why3 },
                { label: 'Why 4', value: report.why4 },
              ].map((row) => (
                <tr key={row.label} className="border-b border-[#cbd5e1]">
                  <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                    {row.label}
                  </th>
                  <td colSpan={3} className="px-4 py-2.5 text-[#334155]">
                    {row.value || '—'}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-[#cbd5e1] bg-[#fffafa]">
                <th className="bg-[#feeceb]/60 px-4 py-3 font-extrabold text-[#991b1b] border-r border-[#cbd5e1]">
                  Final Root Cause
                </th>
                <td colSpan={3} className="px-4 py-3 font-bold text-[#0f172a]">
                  {report.finalRootCause}
                </td>
              </tr>

              {/* 4. Corrective Actions */}
              <tr>
                <td
                  colSpan={4}
                  className="bg-[#1e3a5f] text-white px-5 py-2.5 font-extrabold uppercase tracking-wider text-xs"
                >
                  4. Corrective Actions
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Temporary Countermeasure
                </th>
                <td colSpan={3} className="px-4 py-2.5 text-[#334155]">
                  {report.temporaryCountermeasure || '—'}
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Permanent Countermeasure
                </th>
                <td colSpan={3} className="px-4 py-2.5 font-semibold text-[#0f172a]">
                  {report.permanentCountermeasure || '—'}
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Responsible Person
                </th>
                <td className="px-4 py-2.5 font-bold text-[#0f172a] border-r border-[#cbd5e1]">
                  {report.responsiblePerson || '—'}
                </td>
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Target Completion Date
                </th>
                <td className="px-4 py-2.5 font-bold text-[#0b57d0]">
                  {report.targetCompletionDate || report.targetDate || '—'}
                </td>
              </tr>

              {/* 5. Preventive Actions */}
              <tr>
                <td
                  colSpan={4}
                  className="bg-[#1e3a5f] text-white px-5 py-2.5 font-extrabold uppercase tracking-wider text-xs"
                >
                  5. Preventive Actions
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Inspection Control Plan
                </th>
                <td colSpan={3} className="px-4 py-2.5 text-[#334155]">
                  {report.inspectionControlPlan || '—'}
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Process Control Plan
                </th>
                <td colSpan={3} className="px-4 py-2.5 text-[#334155]">
                  {report.processControlPlan || '—'}
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <th className="bg-[#f8fafc] px-4 py-2.5 font-bold text-[#334155] border-r border-[#cbd5e1]">
                  Prevention Plan
                </th>
                <td colSpan={3} className="px-4 py-2.5 text-[#334155]">
                  {report.preventionPlan || '—'}
                </td>
              </tr>

              {/* 6. Improvement Evidence */}
              <tr>
                <td
                  colSpan={4}
                  className="bg-[#1e3a5f] text-white px-5 py-2.5 font-extrabold uppercase tracking-wider text-xs"
                >
                  6. Improvement Evidence
                </td>
              </tr>
              <tr className="border-b border-[#cbd5e1]">
                <td colSpan={4} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        label: 'Before Improvement',
                        name: report.beforeImageName,
                        url: report.beforeImageUrl,
                      },
                      {
                        label: 'After Improvement',
                        name: report.afterImageName,
                        url: report.afterImageUrl,
                      },
                      {
                        label: 'Prevention Evidence',
                        name: report.preventionImageName,
                        url: report.preventionImageUrl,
                      },
                    ].map((img) => (
                      <div
                        key={img.label}
                        className="border border-[#cbd5e1] rounded-xl p-3 bg-[#f8fafc]"
                      >
                        <p className="font-extrabold text-[#1e3a5f] text-center mb-2">
                          {img.label}
                        </p>
                        {img.url ? (
                          <img
                            src={img.url}
                            alt={img.label}
                            className="w-full h-36 object-cover rounded-lg border border-[#cbd5e1]"
                          />
                        ) : (
                          <div className="h-32 rounded-lg border border-dashed border-[#94a3b8] bg-white flex flex-col items-center justify-center p-2 text-center text-[#64748b]">
                            <ImageIcon className="w-6 h-6 text-[#94a3b8] mb-1" />
                            <span className="text-[11px] font-semibold break-all">
                              {img.name || 'No photo attached'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>

              {/* 7. Engineer Remarks */}
              <tr>
                <td
                  colSpan={4}
                  className="bg-[#1e3a5f] text-white px-5 py-2.5 font-extrabold uppercase tracking-wider text-xs"
                >
                  7. Engineer Remarks
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="px-5 py-3.5 text-[#334155] leading-relaxed">
                  {report.engineerRemarks || 'No additional remarks provided.'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Admin Review & Approval Card */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0b57d0]" />
            <h3 className="text-base font-extrabold text-[#0f172a]">
              Admin Review &amp; Approval
            </h3>
          </div>
          <StatusBadge
            status={report.status}
            variant={RCA_STATUS_VARIANTS[report.status] || 'blue'}
            showDot
          />
        </div>

        {isClosed ? (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#e8f8ef] border border-[#bbf7d0] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-[#15803d] font-medium">Approved &amp; Closed By</p>
                <p className="font-extrabold text-[#0f172a] mt-0.5">
                  {report.closedBy || 'Rajesh Kumar (Admin)'}
                </p>
              </div>
              <div>
                <p className="text-[#15803d] font-medium">RCA Closure Date &amp; Time</p>
                <p className="font-extrabold text-[#0f172a] mt-0.5">
                  {report.closedAt || '—'}
                </p>
              </div>
            </div>
            <div>
              <p className="font-bold text-[#334155] mb-1">Admin Review Remarks</p>
              <p className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7] text-[#334155] leading-relaxed">
                {report.adminRemarks}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Admin Review Remarks
              </label>
              <textarea
                rows={3}
                disabled={!canAdminApprove}
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Enter verification comments, CAPA audit notes, or closure remarks..."
                className="w-full p-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-[#0f172a] disabled:opacity-60 focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            {canAdminApprove ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleApproveClose}
                  className="h-10 px-6 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold shadow-[0_6px_16px_rgba(21,128,61,0.22)] inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve &amp; Close RCA</span>
                </button>
              </div>
            ) : (
              <p className="text-xs font-semibold text-[#64748b]">
                Only an Administrator can approve and close submitted RCA reports.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default RCAReportView;
