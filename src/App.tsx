import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StatusProvider } from "@/context/StatusContext";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import ChannelsPage from "./pages/ChannelsPage";
import BuildingChannelsPage from "./pages/BuildingChannelsPage";
import ProfilePage from "./pages/ProfilePage";
import ManagementDashboard from "./pages/ManagementDashboard";
import ManagementLoginPage from "./pages/ManagementLoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StatusProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/channels" element={<ChannelsPage />} />
            <Route path="/channels/:buildingId" element={<BuildingChannelsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/management" element={<ManagementDashboard />} />
            <Route path="/management/login" element={<ManagementLoginPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StatusProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
