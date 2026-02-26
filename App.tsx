import React from 'react';
// DEPLOY_TOKEN_FORCE_PURGE: 20260222-1345
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { PermissionGuard } from './components/PermissionGuard';
import { UserRole } from './types';

// Layouts
import { AdminLayout } from './components/AdminLayout';
import { RepLayout } from './components/RepLayout';
import { DelivererLayout } from './components/DelivererLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { RoleSelection } from './pages/RoleSelection';
import { HqAccess } from './pages/HqAccess';
import { Checkout } from './pages/Checkout';
import { CustomerStore } from './pages/CustomerStore';
import { SuspendedAccount } from './pages/SuspendedAccount';
import { OnboardingHub } from './pages/OnboardingHub';
import { ExperienceSelector } from './pages/ExperienceSelector';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { EnterprisePlanSelection } from './pages/EnterprisePlanSelection';
import { AdminOrders } from './pages/AdminOrders';
import { AdminProducts } from './pages/AdminProducts';
import { AdminInventory } from './pages/AdminInventory';
import { AdminCustomers } from './pages/AdminCustomers';
import { AdminClientDetail } from './pages/AdminClientDetail';
import { AdminSalesforce } from './pages/AdminSalesforce';
import { AdminConfigDist } from './pages/AdminConfigDist';
import { AdminRouteManagement } from './pages/AdminRouteManagement';
import { AdminPlanning } from './pages/AdminPlanning';
import { AdminAutoventa } from './pages/AdminAutoventa';
import { AdminLiveMonitor } from './pages/AdminLiveMonitor';
import { AdminDeployments } from './pages/AdminDeployments';
import { AdminSystemLogs } from './pages/AdminSystemLogs';
import { AdminCloudConsole } from './pages/AdminCloudConsole';
import { AdminSettings } from './pages/AdminSettings';
import { AdminTargets } from './pages/AdminTargets';
import { AdminSupervisors } from './pages/AdminSupervisors';
import { AdminAutomation } from './pages/AdminAutomation';

// Rep Pages
import { RepDashboard } from './pages/RepDashboard';
import { RepRoute } from './pages/RepRoute';
import { RepCatalog } from './pages/RepCatalog';
import { RepOrder } from './pages/RepOrder';
import { RepVisitExecution } from './pages/RepVisitExecution';
import { RepInvoiceCreation } from './pages/RepInvoiceCreation';
import { RepMerchantConfig } from './pages/RepMerchantConfig';
import { RepRecovery } from './pages/RepRecovery';

// Deliverer Pages
import { DelivererDashboard } from './pages/DelivererDashboard';
import { DelivererRoute } from './pages/DelivererRoute';
import { DelivererSettlement } from './pages/DelivererSettlement';

// Super Admin
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { SuperAdminTenants } from './pages/SuperAdminTenants';
import { SuperAdminPricing } from './pages/SuperAdminPricing';
import { SuperAdminMarketing } from './pages/SuperAdminMarketing';
import { SuperAdminSetup } from './pages/SuperAdminSetup';
import { SuperAdminTemplates } from './pages/SuperAdminTemplates';

/**
 * Determina la ruta inicial lógica basada en el rol del usuario
 */
const getDefaultRouteByRole = (role?: UserRole) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/superadmin/dashboard';
    case 'ADMIN':
    case 'SUPERVISOR':
    case 'WAREHOUSE_ADMIN':
      return '/admin/dashboard';
    case 'REPRESENTATIVE':
      return '/rep/dashboard';
    case 'DELIVERER':
      return '/deliverer/dashboard';
    default:
      return '/';
  }
};

/**
 * Redirige a usuarios ya autenticados lejos de rutas públicas (Landing/Login)
 */
const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isInitializing } = useAuth();

  if (isInitializing) return null;

  if (isAuthenticated) {
    const target = getDefaultRouteByRole(user?.role);
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

/**
 * Punto de entrada universal que decide a dónde enviar al usuario logueado
 */
const RoleRedirect: React.FC = () => {
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return null;

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  const target = getDefaultRouteByRole(user?.role);
  return <Navigate to={target} replace />;
};

export default function App() {
  console.log("DistriMaster HQ v22.0.2 - Build 20260226-0640");
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AuthRedirect><LandingPage /></AuthRedirect>} />
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/onboarding" element={<AuthRedirect><OnboardingHub /></AuthRedirect>} />
          <Route path="/experience-selector" element={<AuthRedirect><ExperienceSelector /></AuthRedirect>} />
          <Route path="/home" element={<RoleRedirect />} />
          <Route path="/hq-access" element={<HqAccess />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/store" element={<CustomerStore />} />
          <Route path="/suspended" element={<SuspendedAccount />} />
          <Route path="/app/billing/plans" element={<PermissionGuard redirectTo="/login"><EnterprisePlanSelection /></PermissionGuard>} />
          <Route path="/enterprise/select-plan" element={<PermissionGuard redirectTo="/login"><EnterprisePlanSelection /></PermissionGuard>} />

          {/* Protected Routes Area */}
          <Route path="/roles" element={<PermissionGuard redirectTo="/login"><RoleSelection /></PermissionGuard>} />

          {/* Admin Context */}
          <Route path="/admin" element={<PermissionGuard redirectTo="/login" allowedRoles={['ADMIN', 'SUPER_ADMIN', 'WAREHOUSE_ADMIN', 'SUPERVISOR']}><AdminLayout /></PermissionGuard>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customer-detail" element={<AdminClientDetail />} />
            <Route path="settings/salesforce" element={<AdminSalesforce />} />
            <Route path="distribution" element={<AdminConfigDist />} />
            <Route path="routes" element={<AdminRouteManagement />} />
            <Route path="settings" element={<AdminSettings />} />

            {/* Premium Admin Routes (Professional+) */}
            <Route path="planning" element={<PermissionGuard redirectTo="/login" minPlan="Professional"><AdminPlanning /></PermissionGuard>} />
            <Route path="autoventa" element={<PermissionGuard redirectTo="/login" minPlan="Professional"><AdminAutoventa /></PermissionGuard>} />
            <Route path="targets" element={<PermissionGuard redirectTo="/login" minPlan="Professional"><AdminTargets /></PermissionGuard>} />
            <Route path="supervisors" element={<PermissionGuard redirectTo="/login" minPlan="Professional"><AdminSupervisors /></PermissionGuard>} />

            {/* Elite Admin Routes (Enterprise Only) */}
            <Route path="live-monitor" element={<PermissionGuard redirectTo="/login" minPlan="Enterprise"><AdminLiveMonitor /></PermissionGuard>} />
            <Route path="automation" element={<PermissionGuard redirectTo="/login" minPlan="Enterprise"><AdminAutomation /></PermissionGuard>} />
            <Route path="deployments" element={<PermissionGuard redirectTo="/login" minPlan="Enterprise"><AdminDeployments /></PermissionGuard>} />
            <Route path="system-logs" element={<PermissionGuard redirectTo="/login" minPlan="Enterprise"><AdminSystemLogs /></PermissionGuard>} />
            <Route path="cloud-console" element={<PermissionGuard redirectTo="/login" minPlan="Enterprise"><AdminCloudConsole /></PermissionGuard>} />
          </Route>

          {/* Rep Context */}
          <Route path="/rep" element={<PermissionGuard redirectTo="/login" allowedRoles={['REPRESENTATIVE', 'SUPERVISOR', 'ADMIN']}><RepLayout /></PermissionGuard>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RepDashboard />} />
            <Route path="route" element={<RepRoute />} />
            <Route path="catalog" element={<RepCatalog />} />
            <Route path="orders" element={<RepOrder />} />
            <Route path="visit-execution" element={<RepVisitExecution />} />
            <Route path="invoice" element={<RepInvoiceCreation />} />
            <Route path="contacts" element={<RepMerchantConfig />} />
            {/* Premium Rep Features */}
            <Route path="recovery" element={<PermissionGuard redirectTo="/login" minPlan="Professional"><RepRecovery /></PermissionGuard>} />
          </Route>

          {/* Deliverer Context */}
          <Route path="/deliverer" element={<PermissionGuard redirectTo="/login" allowedRoles={['DELIVERER', 'ADMIN']}><DelivererLayout /></PermissionGuard>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DelivererDashboard />} />
            <Route path="route" element={<DelivererRoute />} />
            <Route path="settlement" element={<DelivererSettlement />} />
          </Route>

          {/* Super Admin Context */}
          <Route path="/superadmin">
            <Route path="dashboard" element={<PermissionGuard redirectTo="/login" allowedRoles={['SUPER_ADMIN']}><SuperAdminDashboard /></PermissionGuard>} />
            <Route path="tenants" element={<PermissionGuard redirectTo="/login" allowedRoles={['SUPER_ADMIN']}><SuperAdminTenants /></PermissionGuard>} />
            <Route path="pricing" element={<PermissionGuard redirectTo="/login" allowedRoles={['SUPER_ADMIN']}><SuperAdminPricing /></PermissionGuard>} />
            <Route path="marketing" element={<PermissionGuard redirectTo="/login" allowedRoles={['SUPER_ADMIN']}><SuperAdminMarketing /></PermissionGuard>} />
            <Route path="setup" element={<PermissionGuard redirectTo="/login" allowedRoles={['SUPER_ADMIN']}><SuperAdminSetup /></PermissionGuard>} />
            <Route path="templates" element={<PermissionGuard redirectTo="/login" allowedRoles={['SUPER_ADMIN']}><SuperAdminTemplates /></PermissionGuard>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
