
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Trainings from "./pages/Trainings";
import TrainingDetail from "./pages/TrainingDetail";
import AddTraining from "./pages/AddTraining";
import WeeklyPlan from "./pages/WeeklyPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/training/:id" element={<TrainingDetail />} />
          <Route path="/add-training" element={<AddTraining />} />
          <Route path="/weekly-plan" element={<WeeklyPlan />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
