import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";

import CareerRoadmap from "./pages/CareerRoadmap";
import CareerStart from "./pages/CareerStart";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { QuizProvider } from "./contexts/QuizContext";
import { useCareer } from "./contexts/CareerContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import BrowseCareers from "./pages/BrowseCareers";
import CareerAssessment from "./pages/CareerAssessment";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LearningJourney from './pages/LearningJourney';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const queryClient = new QueryClient();

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

const AppRoutes = () => {
  const { hasStartedCareer } = useCareer();

  return (
    <Routes>
      <Route path="/" element={hasStartedCareer ? <Dashboard /> : <Login />} />
      <Route path="/home" element={hasStartedCareer ? <Dashboard /> : <Index />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Career Assessment & Browsing Flow */}
      <Route path="/career-assessment" element={<CareerAssessment />} />
      <Route path="/browse-careers" element={<BrowseCareers />} />
      
      {/* Career Management */}
      <Route path="/career/:careerId" element={<CareerStart />} />
      <Route path="/career-roadmap/:careerId" element={<CareerRoadmap />} />
      
      {/* User Management */}
      <Route path="/mentor-dashboard" element={<MentorDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/learning" element={<PrivateRoute><LearningJourney /></PrivateRoute>} />
      
      {/* Admin Panel */}
      <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <QuizProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QuizProvider>
  </QueryClientProvider>
);

export default App;


