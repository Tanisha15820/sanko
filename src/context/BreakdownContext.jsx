import { createContext, useContext, useState } from 'react';
import {
  initialBreakdownRecords,
  calculateDowntimeMinutes,
} from '../features/breakdowns/breakdownData';
import { initialRcaReports } from '../features/breakdowns/rcaData';

const BreakdownContext = createContext(null);

const formatNowTimestamp = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const formatTodayDate = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Shared in-memory React state for Breakdown Management and RCA Management (no localStorage)
export const BreakdownProvider = ({ children }) => {
  const [breakdowns, setBreakdowns] = useState(initialBreakdownRecords);
  const [rcaReports, setRcaReports] = useState(initialRcaReports);

  const addBreakdown = (newBreakdown) => {
    setBreakdowns((prev) => [newBreakdown, ...prev]);
  };

  const updateBreakdown = (breakdownId, updates) => {
    setBreakdowns((prev) =>
      prev.map((b) =>
        b.breakdownId === breakdownId ? { ...b, ...updates } : b
      )
    );
  };

  // Save RCA as Draft or Submit for Admin Review
  const saveRcaReport = (reportData, mode = 'Draft') => {
    const isSubmit = mode === 'Submit';
    const nextStatus = isSubmit ? 'Pending Admin Review' : 'Draft';
    const submissionDate = isSubmit
      ? reportData.submissionDate || formatTodayDate()
      : reportData.submissionDate || '';

    const normalizedReport = {
      ...reportData,
      status: nextStatus,
      submissionDate,
      targetDate: reportData.targetCompletionDate || reportData.targetDate || '',
    };

    setRcaReports((prev) => {
      const exists = prev.some((r) => r.breakdownId === normalizedReport.breakdownId);
      if (exists) {
        return prev.map((r) =>
          r.breakdownId === normalizedReport.breakdownId ? normalizedReport : r
        );
      }
      return [normalizedReport, ...prev];
    });

    // Keep parent breakdown status synchronized (never altering actualRepairCompletionTime)
    setBreakdowns((prev) =>
      prev.map((b) =>
        b.breakdownId === normalizedReport.breakdownId
          ? {
              ...b,
              status: isSubmit ? 'Pending Admin Approval' : 'RCA Required',
              rca: {
                rootCause: normalizedReport.finalRootCause,
                whyHappened: normalizedReport.why4 || normalizedReport.why1,
                correctiveAction: normalizedReport.permanentCountermeasure,
                preventiveAction: normalizedReport.preventionPlan,
                responsiblePerson: normalizedReport.responsiblePerson,
                rcaDate: submissionDate || formatTodayDate(),
                engineerRemarks: normalizedReport.engineerRemarks,
              },
            }
          : b
      )
    );

    return normalizedReport;
  };

  // Admin: Approve & Close RCA (never modifies Engineer fields or repair completion time)
  const approveAndCloseRca = (rcaId, adminRemarks, adminName = 'Rajesh Kumar (Admin)') => {
    const closedAt = formatNowTimestamp();
    const targetReport = rcaReports.find((r) => r.rcaId === rcaId);
    if (!targetReport) return;

    const finalAdminRemarks =
      adminRemarks.trim() ||
      'Root cause analysis and corrective/preventive actions verified. Formally closed by Admin.';

    setRcaReports((prev) =>
      prev.map((r) =>
        r.rcaId === rcaId
          ? {
              ...r,
              status: 'Closed',
              adminRemarks: finalAdminRemarks,
              closedBy: adminName,
              closedAt,
            }
          : r
      )
    );

    setBreakdowns((prev) =>
      prev.map((b) =>
        b.breakdownId === targetReport.breakdownId
          ? {
              ...b,
              status: 'Closed',
              adminRemarks: finalAdminRemarks,
              closedBy: adminName,
              closedAt,
            }
          : b
      )
    );
  };

  // Helper: breakdowns eligible for RCA (downtime strictly > 30 minutes)
  const rcaEligibleBreakdowns = breakdowns.filter((b) => {
    const mins = calculateDowntimeMinutes(
      b.breakdownStartTime,
      b.actualRepairCompletionTime
    );
    return mins !== null && mins > 30;
  });

  const getRcaByBreakdownId = (breakdownId) =>
    rcaReports.find((r) => r.breakdownId === breakdownId) || null;

  const getNextRcaId = () =>
    `RCA-2026-${String(rcaReports.length + 1).padStart(3, '0')}`;

  return (
    <BreakdownContext.Provider
      value={{
        breakdowns,
        rcaReports,
        rcaEligibleBreakdowns,
        addBreakdown,
        updateBreakdown,
        saveRcaReport,
        approveAndCloseRca,
        getRcaByBreakdownId,
        getNextRcaId,
      }}
    >
      {children}
    </BreakdownContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBreakdowns = () => {
  const context = useContext(BreakdownContext);
  if (!context) {
    throw new Error('useBreakdowns must be used within a BreakdownProvider');
  }
  return context;
};
