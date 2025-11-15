
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { syncLegalDatabase } from "./utils/loadLegalData";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const lastSync = localStorage.getItem('legal_last_sync');
    const now = new Date().getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (!lastSync || (now - parseInt(lastSync)) > oneDayMs) {
      console.log('Syncing legal database from official sources...');
      syncLegalDatabase().then((result) => {
        if (result.success) {
          localStorage.setItem('legal_last_sync', now.toString());
          console.log('✅ Database synchronized successfully');
        }
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;