import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import OrderManagement from "./pages/OrderManagement";
import AllOrders from "./pages/AllOrders";
import WaiterManagement from "./pages/WaiterManagement";
import WaiterDetail from "./pages/WaiterDetail";
import ChefManagement from "./pages/ChefManagement";
import ChefDetail from "./pages/ChefDetail";
import CustomerManagement from "./pages/CustomerManagement";
import CustomerDetail from "./pages/CustomerDetail";
import Advertisements from "./pages/Advertisements";
import AdvertisementDetail from "./pages/AdvertisementDetail";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/all-orders" element={<AllOrders />} />
              <Route path="/waiters" element={<WaiterManagement />} />
              <Route path="/waiters/:id" element={<WaiterDetail />} />
              <Route path="/chefs" element={<ChefManagement />} />
              <Route path="/chefs/:id" element={<ChefDetail />} />
              <Route path="/customers" element={<CustomerManagement />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/advertisements" element={<Advertisements />} />
              <Route path="/advertisements/:id" element={<AdvertisementDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
