import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppNavigation } from "@/components/AppNavigation";
import { getSettings } from "@/lib/storage";
import Index from "./pages/Index";
import Session from "./pages/Session";
import Heatmap from "./pages/Heatmap";
import Mushaf from "./pages/Mushaf";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const settings = getSettings();
  const showNav = settings?.onboardingComplete;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col md:flex-row min-h-screen">
            {showNav && <AppNavigation />}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/session" element={<Session />} />
                <Route path="/heatmap" element={<Heatmap />} />
                <Route path="/mushaf" element={<Mushaf />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
