import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Camera,
  Eye,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMaintenance } from '../../context/MaintenanceContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';

const PMFailureReportView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pmIdParam = searchParams.get('pmId');

  const { user } = useAuth();
  const { adminFailureQueue, closeFailedPmRecord } = useMaintenance();

  const record =
    adminFailureQueue.find((r) => r.pmId === pmIdParam) ||
    adminFailureQueue[0] ||
    null;

  const [adminRemarks, setAdminRemarks] = useState(record?.adminRemarks || '');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [justClosed, setJustClosed] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  if (!record) {
    return (
      <div className="bg-white rounded-2xl border border-[#edf1f7] p-8 text-center space-y-4">
        <p className="text-sm font-semibold text-[#64748b]">
          PM Failure record not found.
        </p>
        <button
          type="button"
          onClick={() => navigate('/pm/failure-review')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b57d0] text-white text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to PM Failure Review</span>
        </button>
      </div>
    );
  }

  const isClosed = record.status === 'Closed';
  const displayStatus = isClosed ? 'Closed' : 'Pending Admin Review';

  const handleConfirmClose = () => {
    closeFailedPmRecord(
      record.pmId,
      adminRemarks,
      `${user?.name || 'Rajesh Kumar'} (Admin)`
    );
    setIsConfirmOpen(false);
    setJustClosed(true);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl border border-[#edf1f7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/pm/failure-review')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b57d0] hover:text-[#0947ab] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to PM Failure Review</span>
          </button>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
              PM Failure Inspection Report
            </h2>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#eef4ff] text-[#0b57d0] text-xs font-extrabold">
              {record.pmId}
            </span>
            <StatusBadge
              status={displayStatus}
              variant={isClosed ? 'green' : 'red'}
              showDot
            />
          </div>
          <p className="text-xs font-medium text-[#64748b] mt-1">
            Read-only Technician checklist submission — Admin review and closure record
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f1f5f9] text-[#475569] text-xs font-bold self-start sm:self-center">
          <Lock className="w-3.5 h-3.5" />
          <span>Technician Data Locked</span>
        </span>
      </div>

      {justClosed && (
        <div className="p-4 rounded-xl bg-[#e8f8ef] border border-[#bbf7d0] text-[#15803d] text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            PM Failure Record {record.pmId} has been closed and remains archived in PM
            History.
          </span>
        </div>
      )}

      {/* 1. Machine Information */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden text-xs">
        <div className="px-6 py-3.5 bg-[#f8fafc] border-b border-[#edf1f7]">
          <h3 className="text-sm font-extrabold text-[#0f172a]">Machine Information</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b]">Machine Name &amp; ID</p>
            <p className="font-extrabold text-[#0f172a] mt-0.5">
              {record.machineId} — {record.machineName}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b]">Production Line</p>
            <p className="font-bold text-[#0f172a] mt-0.5">{record.line}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b]">PM Date</p>
            <p className="font-bold text-[#0f172a] mt-0.5">{record.scheduledDate}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b]">PM Frequency</p>
            <p className="font-bold text-[#0b57d0] mt-0.5">
              {record.frequency || 'Scheduled PM'}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b]">Assigned Engineer</p>
            <p className="font-bold text-[#0f172a] mt-0.5">{record.engineerName}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b]">Assigned Technician</p>
            <p className="font-bold text-[#0f172a] mt-0.5">{record.technicianName}</p>
          </div>
        </div>
      </section>

      {/* 2. PM Checklist Responses */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden text-xs">
        <div className="px-6 py-3.5 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#0f172a]">
            PM Checklist Responses
          </h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#feeceb] text-[#b91c1c] text-xs font-extrabold">
            <AlertTriangle className="w-3.5 h-3.5" />
            {record.failedItems.length} Failed Checkpoint
            {record.failedItems.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="p-6 space-y-3">
          {record.checklistItems.map((item, idx) => {
            const isFail = item.result === 'Fail';
            return (
              <div
                key={item.id || idx}
                className={`p-4 rounded-xl border space-y-2 ${
                  isFail
                    ? 'bg-[#feeceb]/60 border-[#fca5a5]'
                    : 'bg-[#f8fafc] border-[#edf1f7]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-lg font-extrabold flex items-center justify-center shrink-0 ${
                        isFail
                          ? 'bg-[#dc2626] text-white'
                          : 'bg-[#eef4ff] text-[#0b57d0]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <p
                      className={`font-bold leading-snug pt-0.5 ${
                        isFail ? 'text-[#991b1b]' : 'text-[#0f172a]'
                      }`}
                    >
                      {item.task}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-extrabold shrink-0 self-start sm:self-center ${
                      isFail
                        ? 'bg-[#dc2626] text-white'
                        : 'bg-[#e8f8ef] text-[#15803d]'
                    }`}
                  >
                    {isFail ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>{item.result}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div>
                    <span className="text-[#64748b] font-semibold">
                      {item.paramLabel}:{' '}
                    </span>
                    <span
                      className={`font-extrabold ${
                        isFail ? 'text-[#b91c1c]' : 'text-[#0f172a]'
                      }`}
                    >
                      {item.paramValue}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#64748b] font-semibold">Remarks: </span>
                    <span
                      className={
                        isFail
                          ? 'font-bold text-[#991b1b]'
                          : 'font-medium text-[#334155]'
                      }
                    >
                      {item.remarks || '—'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Technician Overall Remarks */}
          <div className="pt-3 border-t border-[#f1f5f9]">
            <p className="font-bold text-[#334155] mb-1.5">
              Technician Overall Remarks
            </p>
            <p className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7] text-[#334155] leading-relaxed">
              {record.technicianRemarks || 'No overall remarks recorded.'}
            </p>
          </div>

          {/* Supporting Uploaded Images */}
          <div className="pt-3 border-t border-[#f1f5f9] space-y-2.5">
            <p className="font-bold text-[#334155] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#0b57d0]" />
              <span>
                Supporting Uploaded Images ({record.uploadedImages?.length || 0})
              </span>
            </p>
            {record.uploadedImages && record.uploadedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {record.uploadedImages.map((img, i) => (
                  <div
                    key={img.id || i}
                    className="p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-[#0f172a] truncate">{img.name}</p>
                      <p className="text-[10.5px] text-[#64748b]">{img.uploadedAt}</p>
                    </div>
                    {img.url && (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(img)}
                        className="p-1.5 rounded-lg bg-[#eef4ff] text-[#0b57d0] hover:bg-[#0b57d0] hover:text-white cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#64748b] p-3 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
                No supporting images attached.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Submission Details */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden text-xs">
        <div className="px-6 py-3.5 bg-[#f8fafc] border-b border-[#edf1f7]">
          <h3 className="text-sm font-extrabold text-[#0f172a]">Submission Details</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b]">Inspection Date</p>
            <p className="font-bold text-[#0f172a] mt-0.5">{record.inspectionDate}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b]">Submission Date</p>
            <p className="font-bold text-[#0b57d0] mt-0.5">{record.submissionDate}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7]">
            <p className="text-[#64748b]">Technician Name</p>
            <p className="font-bold text-[#0f172a] mt-0.5">{record.technicianName}</p>
          </div>
        </div>
      </section>

      {/* 4. Admin Review Section */}
      <section className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_2px_12px_rgba(15,23,42,0.03)] p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0b57d0]" />
            <h3 className="text-base font-extrabold text-[#0f172a]">Admin Review</h3>
          </div>
          <StatusBadge
            status={displayStatus}
            variant={isClosed ? 'green' : 'red'}
            showDot
          />
        </div>

        {isClosed ? (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#e8f8ef] border border-[#bbf7d0] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-[#15803d] font-medium">Closed By</p>
                <p className="font-extrabold text-[#0f172a] mt-0.5">
                  {record.closedBy || 'Rajesh Kumar (Admin)'}
                </p>
              </div>
              <div>
                <p className="text-[#15803d] font-medium">Closure Date &amp; Time</p>
                <p className="font-extrabold text-[#0f172a] mt-0.5">
                  {record.closedAt || '—'}
                </p>
              </div>
            </div>
            <div>
              <p className="font-bold text-[#334155] mb-1">Admin Review Remarks</p>
              <p className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#edf1f7] text-[#334155] leading-relaxed">
                {record.adminRemarks}
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
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Enter corrective action verification, spare replacement notes, or closure remarks..."
                className="w-full p-3 bg-[#f8fafc] border border-[#d6deeb] rounded-xl text-[#0f172a] focus:outline-none focus:border-[#0b57d0]"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                className="h-10 px-6 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold shadow-[0_6px_16px_rgba(21,128,61,0.22)] inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Close PM Failure Record</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm PM Failure Closure"
        subtitle={`${record.pmId} • ${record.machineId} (${record.machineName})`}
      >
        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-[#fff4e5] border border-[#fed7aa] text-[#9a3412] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold">
                Are you sure you want to close this PM failure record?
              </p>
              <p className="mt-1 text-[#c2410c]">
                The status will change to <strong>Closed</strong>, your review remarks
                and closure timestamp will be saved, and the entire report will become
                permanently read-only in PM History.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f1f5f9]">
            <button
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#d6deeb] font-bold text-[#475569] hover:bg-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmClose}
              className="px-5 py-2 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold cursor-pointer"
            >
              Confirm &amp; Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.name || 'Inspection Image'}
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

export default PMFailureReportView;
