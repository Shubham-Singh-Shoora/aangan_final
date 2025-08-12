
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ICPProvider } from "./contexts/ICPContext";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import TenantDashboard from "./pages/TenantDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import AddProperty from "./pages/AddProperty";
import RentalAgreement from "./pages/RentalAgreement";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ICPProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tenant-dashboard" element={<TenantDashboard />} />
            <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/edit-property/:id" element={<AddProperty />} />
            <Route path="/rental-agreement/:id" element={<RentalAgreement />} />
            <Route path="/success" element={<Success />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ICPProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
