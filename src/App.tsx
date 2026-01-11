import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Segmentation from "./pages/Segmentation";
import SegmentDetail from "./pages/SegmentDetail";
import SegmentCreation from "./pages/SegmentCreation";
import SegmentEdit from "./pages/SegmentEdit";
import Campaigns from "./pages/Campaigns";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignDetail from "./pages/CampaignDetail";
import CampaignApproval from "./pages/CampaignApproval";
import CampaignListForApprover from "./pages/CampaignListForApprover";
import AIInsights from "./pages/AIInsights";
import Customer360 from "./pages/Customer360";
import Reports from "./pages/Reports";
import ReportCreate from "./pages/ReportCreate";
import RewardAccountManagement from "./pages/RewardAccountManagement";
import Configuration from "./pages/Configuration";
import MpesaCoreDetail from "./pages/configuration/MpesaCoreDetail";
import SmscDetail from "./pages/configuration/SmscDetail";
import UssdGatewayDetail from "./pages/configuration/UssdGatewayDetail";
import AppPushDetail from "./pages/configuration/AppPushDetail";
import RewardAccountDetail from "./pages/configuration/RewardAccountDetail";
import EmailServiceDetail from "./pages/configuration/EmailServiceDetail";
import IvrConfigDetail from "./pages/configuration/IvrConfigDetail";
import DatabaseDetail from "./pages/configuration/DatabaseDetail";
import UserManagement from "./pages/admin/UserManagement";
import AddUser from "./pages/admin/AddUser";
import EditUser from "./pages/admin/EditUser";
import ManageRoles from "./pages/admin/ManageRoles";
import RolePermissions from "./pages/admin/RolePermissions";
import AuditLogs from "./pages/admin/AuditLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Standalone pages - no sidebar/header */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/campaigns/:id/approval" element={<CampaignApproval />} />
          <Route path="/list_comain_to_me" element={<CampaignListForApprover />} />
          
          {/* Main app with layout */}
          <Route
            path="/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/segmentation" element={<Segmentation />} />
                  <Route path="/segmentation/create" element={<SegmentCreation />} />
                  <Route path="/segmentation/:id" element={<SegmentDetail />} />
                  <Route path="/segmentation/:id/edit" element={<SegmentEdit />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/campaigns/create" element={<CampaignCreate />} />
                  <Route path="/campaigns/:id" element={<CampaignDetail />} />
                  <Route path="/campaigns/approvals" element={<Campaigns />} />
                  <Route path="/ai-insights" element={<AIInsights />} />
                  <Route path="/customer-360" element={<Customer360 />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/reports/create" element={<ReportCreate />} />
                  <Route path="/reward-accounts" element={<RewardAccountManagement />} />
                  <Route path="/configuration" element={<Configuration />} />
                  <Route path="/configuration/mpesa-core" element={<MpesaCoreDetail />} />
                  <Route path="/configuration/smsc" element={<SmscDetail />} />
                  <Route path="/configuration/ussd-gateway" element={<UssdGatewayDetail />} />
                  <Route path="/configuration/app-push" element={<AppPushDetail />} />
                  <Route path="/configuration/reward-account" element={<RewardAccountDetail />} />
                  <Route path="/configuration/email-service" element={<EmailServiceDetail />} />
                  <Route path="/configuration/ivr-config" element={<IvrConfigDetail />} />
                  <Route path="/configuration/database" element={<DatabaseDetail />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/users/add" element={<AddUser />} />
                  <Route path="/admin/users/:id/edit" element={<EditUser />} />
                  <Route path="/admin/users/:id/roles" element={<ManageRoles />} />
                  <Route path="/admin/permissions" element={<RolePermissions />} />
                  <Route path="/admin/audit-logs" element={<AuditLogs />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
