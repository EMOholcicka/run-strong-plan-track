
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Trainings from "./pages/Trainings";
import TrainingDetail from "./pages/TrainingDetail";
import AddTraining from "./pages/AddTraining";
import WeeklyPlan from "./pages/WeeklyPlan";
import MicroCycle from "./pages/MicroCycle";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Athletes from "./pages/Athletes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/trainings" element={<ProtectedRoute><Trainings /></ProtectedRoute>} />
            <Route path="/training/:id" element={<ProtectedRoute><TrainingDetail /></ProtectedRoute>} />
            <Route path="/add-training" element={<ProtectedRoute><AddTraining /></ProtectedRoute>} />
            <Route path="/weekly-plan" element={<ProtectedRoute><WeeklyPlan /></ProtectedRoute>} />
            <Route path="/micro-cycle" element={<ProtectedRoute><MicroCycle /></ProtectedRoute>} />
            <Route path="/athletes" element={<ProtectedRoute><Athletes /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
