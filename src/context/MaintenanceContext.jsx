import { createContext, useContext, useState } from 'react';
import {
  initialPmChecklists,
  createPmChecklistFromSchedule,
} from '../features/maintenance/pmChecklistData';
import { initialPmHistoryRecords } from '../features/maintenance/pmHistoryData';

const MaintenanceContext = createContext(null);

const formatNowTimestamp = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const toCalendarTasks = (checklists) =>
  checklists.map((c) => ({
    pmId: c.pmId,
    machineId: c.machineId,
    machineName: c.machineName,
    line: c.line,
    frequency: c.frequency,
    scheduledDate: c.scheduledDate,
    scheduledTime: c.pmSchedule.includes('•')
      ? c.pmSchedule.split('•')[1].trim()
      : '10:00',
    engineer: c.assignedEngineer,
    assignedTechnician: c.assignedTechnician,
    status: c.status,
    notes: c.finalRemarks || '',
  }));

const toAdminFailureRecord = (checklist) => {
  const failedItems = checklist.checklistItems.filter((i) => i.result === 'Fail');
  return {
    pmId: checklist.pmId,
    machineName: checklist.machineName,
    machineId: checklist.machineId,
    line: checklist.line,
    frequency: checklist.frequency,
    scheduledDate: checklist.scheduledDate,
    technicianName: checklist.assignedTechnician,
    engineerName: checklist.assignedEngineer,
    inspectionDate: checklist.inspectionDate,
    checklistItems: checklist.checklistItems,
    failedItems,
    technicianRemarks: checklist.finalRemarks,
    uploadedImages: checklist.supportingImages,
    submissionDate: checklist.submissionDate,
    status: checklist.status,
    adminRemarks: checklist.adminRemarks || '',
    closedBy: checklist.closedBy || '',
    closedAt: checklist.closedAt || '',
  };
};

// Pure in-memory React state for PM Calendar, PM Checklist, PM History, and Admin Failure Review queue (no localStorage)
export const MaintenanceProvider = ({ children }) => {
  const [pmChecklists, setPmChecklists] = useState(initialPmChecklists);
  const [pmTasks, setPmTasks] = useState(() => toCalendarTasks(initialPmChecklists));
  const [pmHistory, setPmHistory] = useState(() => {
    const checklistIds = new Set(initialPmChecklists.map((c) => c.pmId));
    const fromChecklists = initialPmChecklists
      .filter(
        (c) =>
          c.status === 'Completed' ||
          c.status === 'Failed / Pending Admin Review' ||
          c.status === 'Closed'
      )
      .map((c) => {
        const hasFail = c.checklistItems.some((i) => i.result === 'Fail');
        return {
          pmId: c.pmId,
          machineId: c.machineId,
          machineName: c.machineName,
          line: c.line,
          pmType: c.frequency,
          assignedTechnician: c.assignedTechnician,
          assignedEngineer: c.assignedEngineer,
          scheduledDate: c.scheduledDate,
          inspectionDate: c.inspectionDate,
          submissionDate: c.submissionDate,
          checklistResult: hasFail ? 'Fail' : 'Pass',
          pmStatus: c.status,
          technicianRemarks: c.finalRemarks,
          adminRemarks: c.adminRemarks || '',
          closedBy: c.closedBy || '',
          closedAt: c.closedAt || '',
          uploadedImages: c.supportingImages,
          checklistItems: c.checklistItems,
        };
      });

    const extraHistorical = initialPmHistoryRecords
      .filter(
        (rec) =>
          !checklistIds.has(rec.pmId) &&
          (rec.pmStatus === 'Approved' || rec.pmStatus === 'Closed')
      )
      .map((rec) => {
        const hasFail = rec.checklistItems.some((i) => i.result === 'Fail');
        return {
          pmId: rec.pmId,
          machineId: rec.machineId,
          machineName: rec.machineName,
          line: rec.line,
          pmType: rec.pmType,
          assignedTechnician: rec.assignedTechnician,
          assignedEngineer: rec.assignedEngineer,
          scheduledDate: rec.scheduledDate,
          inspectionDate: rec.scheduledDate,
          submissionDate: rec.submissionDate,
          checklistResult: hasFail ? 'Fail' : 'Pass',
          pmStatus: rec.pmStatus === 'Approved' ? 'Completed' : rec.pmStatus,
          technicianRemarks: rec.technicianRemarks,
          adminRemarks: rec.adminRemarks || '',
          closedBy: rec.closedBy || '',
          closedAt: rec.closedAt || '',
          uploadedImages: rec.uploadedImages || [],
          checklistItems: rec.checklistItems,
        };
      });

    return [...fromChecklists, ...extraHistorical];
  });
  const [adminFailureQueue, setAdminFailureQueue] = useState(() =>
    initialPmChecklists
      .filter(
        (c) =>
          c.checklistItems.some((i) => i.result === 'Fail') &&
          (c.status === 'Failed / Pending Admin Review' || c.status === 'Closed')
      )
      .map(toAdminFailureRecord)
  );

  // Engineer schedules a new PM task from PM Calendar -> appears in assigned Technician's PM Checklist
  const addPmTask = (newTask) => {
    const normalizedTask = {
      ...newTask,
      status: 'Scheduled',
      assignedTechnician: newTask.assignedTechnician || 'Suresh Nair',
    };
    setPmTasks((prev) => [normalizedTask, ...prev]);

    const newChecklist = createPmChecklistFromSchedule(normalizedTask);
    setPmChecklists((prev) => [newChecklist, ...prev]);
  };

  // Engineer updates an existing PM schedule (date, time, frequency, assigned technician, notes)
  const updatePmTask = (pmId, updates) => {
    setPmTasks((prev) =>
      prev.map((t) => (t.pmId === pmId ? { ...t, ...updates } : t))
    );
    setPmChecklists((prev) =>
      prev.map((c) =>
        c.pmId === pmId
          ? {
              ...c,
              scheduledDate: updates.scheduledDate || c.scheduledDate,
              pmSchedule: `${updates.scheduledDate || c.scheduledDate}${
                updates.scheduledTime ? ` • ${updates.scheduledTime}` : ''
              }`,
              frequency: updates.frequency || c.frequency,
              assignedTechnician: updates.assignedTechnician || c.assignedTechnician,
              finalRemarks:
                updates.notes !== undefined ? updates.notes : c.finalRemarks,
            }
          : c
      )
    );
  };

  // Update checklist fields or Save as Draft (also syncs PM Calendar status)
  const updatePmChecklist = (pmId, updater) => {
    let nextStatus = null;
    setPmChecklists((prev) =>
      prev.map((c) => {
        if (c.pmId !== pmId) return c;
        const updated = updater(c);
        nextStatus = updated.status;
        return updated;
      })
    );
    if (nextStatus) {
      setPmTasks((prev) =>
        prev.map((t) => (t.pmId === pmId ? { ...t, status: nextStatus } : t))
      );
    }
  };

  // Technician submits checklist -> Automatic Pass / Fail workflow
  const submitPmChecklist = (pmId) => {
    const target = pmChecklists.find((c) => c.pmId === pmId);
    if (!target) return null;

    const nowTs = formatNowTimestamp();
    const failedItems = target.checklistItems.filter((i) => i.result === 'Fail');
    const hasFailures = failedItems.length > 0;
    const nextStatus = hasFailures ? 'Failed / Pending Admin Review' : 'Completed';

    const updatedChecklist = {
      ...target,
      status: nextStatus,
      submissionDate: nowTs,
      inspectionDate: target.inspectionDate || nowTs.slice(0, 10),
    };

    // 1. Update checklist state (becomes read-only for Technician)
    setPmChecklists((prev) =>
      prev.map((c) => (c.pmId === pmId ? updatedChecklist : c))
    );

    // 2. Sync PM Calendar task status
    setPmTasks((prev) =>
      prev.map((t) => (t.pmId === pmId ? { ...t, status: nextStatus } : t))
    );

    // 3. Save to PM History (preserving original PM ID, no duplicates)
    const historyEntry = {
      pmId: updatedChecklist.pmId,
      machineId: updatedChecklist.machineId,
      machineName: updatedChecklist.machineName,
      line: updatedChecklist.line,
      pmType: updatedChecklist.frequency,
      assignedTechnician: updatedChecklist.assignedTechnician,
      assignedEngineer: updatedChecklist.assignedEngineer,
      scheduledDate: updatedChecklist.scheduledDate,
      inspectionDate: updatedChecklist.inspectionDate,
      submissionDate: nowTs,
      checklistResult: hasFailures ? 'Fail' : 'Pass',
      pmStatus: nextStatus,
      technicianRemarks: updatedChecklist.finalRemarks,
      adminRemarks: '',
      closedBy: '',
      closedAt: '',
      uploadedImages: updatedChecklist.supportingImages.map((img) => ({
        name: img.name,
        uploadedAt: img.uploadedAt,
        url: img.url || null,
      })),
      checklistItems: updatedChecklist.checklistItems,
    };

    setPmHistory((prev) => [
      historyEntry,
      ...prev.filter((h) => h.pmId !== pmId),
    ]);

    // 4. If any item failed, automatically route full record to Admin's PM Failure Review list
    if (hasFailures) {
      const failureRecord = toAdminFailureRecord(updatedChecklist);
      setAdminFailureQueue((prev) => [
        failureRecord,
        ...prev.filter((f) => f.pmId !== pmId),
      ]);
    }

    return {
      status: nextStatus,
      hasFailures,
      failedCount: failedItems.length,
      checklist: updatedChecklist,
    };
  };

  // Admin closure (separate from Technician submission)
  const closeFailedPmRecord = (pmId, adminRemarks, closedBy = 'Rajesh Kumar (Admin)') => {
    const nowTs = formatNowTimestamp();
    const remarks =
      adminRemarks.trim() ||
      'Corrective action verified by Admin. Failed PM record formally closed.';

    setPmChecklists((prev) =>
      prev.map((c) =>
        c.pmId === pmId
          ? { ...c, status: 'Closed', adminRemarks: remarks, closedBy, closedAt: nowTs }
          : c
      )
    );
    setPmTasks((prev) =>
      prev.map((t) => (t.pmId === pmId ? { ...t, status: 'Closed' } : t))
    );
    setPmHistory((prev) =>
      prev.map((h) =>
        h.pmId === pmId
          ? {
              ...h,
              pmStatus: 'Closed',
              engineerApprovalStatus: 'Closed',
              adminClosureStatus: 'Closed',
              adminRemarks: remarks,
              closedBy,
              closedAt: nowTs,
            }
          : h
      )
    );
    setAdminFailureQueue((prev) =>
      prev.map((f) =>
        f.pmId === pmId
          ? { ...f, status: 'Closed', adminRemarks: remarks, closedBy, closedAt: nowTs }
          : f
      )
    );
  };

  return (
    <MaintenanceContext.Provider
      value={{
        pmTasks,
        pmChecklists,
        pmHistory,
        adminFailureQueue,
        addPmTask,
        updatePmTask,
        updatePmChecklist,
        submitPmChecklist,
        closeFailedPmRecord,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
