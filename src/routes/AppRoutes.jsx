import { Routes, Route, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import NotFound from '../components/common/NotFound';
import { useAuth } from '../context/AuthContext';

import Login from '../features/auth/Login';
import Dashboard from '../features/dashboard/Dashboard';
import MachineStatus from '../features/machines/MachineStatus';
import MachineDetails from '../features/machines/MachineDetails';
import BreakdownManagement from '../features/breakdowns/BreakdownManagement';
import RCAManagement from '../features/breakdowns/RCAManagement';
import RCAForm from '../features/breakdowns/RCAForm';
import RCAReportView from '../features/breakdowns/RCAReportView';
import ProductionMonitoring from '../features/production/ProductionMonitoring';
import ProductionPlan from '../features/production/ProductionPlan';
import PMCalendar from '../features/maintenance/PMCalendar';
import PMChecklist from '../features/maintenance/PMChecklist';
import PMHistory from '../features/maintenance/PMHistory';
import PMFailureReview from '../features/maintenance/PMFailureReview';
import PMFailureReportView from '../features/maintenance/PMFailureReportView';
import SparePartsInventory from '../features/inventory/SparePartsInventory';
import ToolManagement from '../features/tools/ToolManagement';
import ToolDetails from '../features/tools/ToolDetails';
import UserManagement from '../features/users/UserManagement';
import RolesPermissions from '../features/roles/RolesPermissions';

// Route-level permission guard matching Roles & Permissions
const PermissionRoute = ({ permission, children }) => {
  const { activeRole, hasPermission } = useAuth();
  const navigate = useNavigate();

  if (hasPermission(permission)) {
    return children;
  }

  return (
    <div className="bg-white rounded-2xl border border-[#edf1f7] p-10 text-center shadow-[0_2px_12px_rgba(15,23,42,0.03)] max-w-xl mx-auto mt-6">
      <div className="w-14 h-14 rounded-2xl bg-[#feeceb] text-[#b91c1c] flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-extrabold text-[#0f172a]">Access Restricted</h3>
      <p className="text-xs sm:text-sm text-[#64748b] mt-2 leading-relaxed">
        Your current role (<strong>{activeRole}</strong>) does not have permission to view
        this page. Contact an Administrator or switch roles from the profile menu.
      </p>
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    {/* Public Login Routes */}
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />

    {/* Protected Dashboard Routes */}
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/machines"
          element={
            <PermissionRoute permission="machines.view_status">
              <MachineStatus />
            </PermissionRoute>
          }
        />
        <Route
          path="/machines/details"
          element={
            <PermissionRoute permission="machines.view_status">
              <MachineDetails />
            </PermissionRoute>
          }
        />
        <Route
          path="/breakdowns"
          element={
            <PermissionRoute permission="breakdowns.view">
              <BreakdownManagement />
            </PermissionRoute>
          }
        />
        <Route
          path="/breakdowns/rca"
          element={
            <PermissionRoute permission="breakdowns.submit_rca">
              <RCAManagement />
            </PermissionRoute>
          }
        />
        <Route
          path="/breakdowns/rca/form"
          element={
            <PermissionRoute permission="breakdowns.submit_rca">
              <RCAForm />
            </PermissionRoute>
          }
        />
        <Route
          path="/breakdowns/rca/report"
          element={
            <PermissionRoute permission="breakdowns.submit_rca">
              <RCAReportView />
            </PermissionRoute>
          }
        />
        <Route
          path="/production"
          element={
            <PermissionRoute permission="production.view_monitoring">
              <ProductionMonitoring />
            </PermissionRoute>
          }
        />
        <Route
          path="/production/plan"
          element={
            <PermissionRoute permission="production.view_plan">
              <ProductionPlan />
            </PermissionRoute>
          }
        />
        <Route
          path="/pm/calendar"
          element={
            <PermissionRoute permission="pm.view_calendar">
              <PMCalendar />
            </PermissionRoute>
          }
        />
        <Route
          path="/pm/checklist"
          element={
            <PermissionRoute permission="pm.fill_checklist">
              <PMChecklist />
            </PermissionRoute>
          }
        />
        <Route
          path="/pm/history"
          element={
            <PermissionRoute permission="pm.view_history">
              <PMHistory />
            </PermissionRoute>
          }
        />
        <Route
          path="/pm/failure-review"
          element={
            <PermissionRoute permission="admin.manage_users">
              <PMFailureReview />
            </PermissionRoute>
          }
        />
        <Route
          path="/pm/failure-review/report"
          element={
            <PermissionRoute permission="admin.manage_users">
              <PMFailureReportView />
            </PermissionRoute>
          }
        />
        <Route
          path="/inventory/spare-parts"
          element={
            <PermissionRoute permission="inventory.view_spare_parts">
              <SparePartsInventory />
            </PermissionRoute>
          }
        />
        <Route
          path="/inventory/tools"
          element={
            <PermissionRoute permission="inventory.view_tools">
              <ToolManagement />
            </PermissionRoute>
          }
        />
        <Route
          path="/inventory/tools/details"
          element={
            <PermissionRoute permission="inventory.view_tools">
              <ToolDetails />
            </PermissionRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PermissionRoute permission="admin.manage_users">
              <UserManagement />
            </PermissionRoute>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <PermissionRoute permission="admin.manage_roles">
              <RolesPermissions />
            </PermissionRoute>
          }
        />
      </Route>
    </Route>

    {/* Fallback 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
