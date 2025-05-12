
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { AppLayout } from "@/components/layout/app-layout";

// Auth Pages
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Lecturer Pages
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import LecturerTimetable from "./pages/lecturer/LecturerTimetable";
import LecturerProfile from "./pages/lecturer/LecturerProfile";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentTimetable from "./pages/student/StudentTimetable";
import StudentProfile from "./pages/student/StudentProfile";

// Common Pages
import { NotificationsPage } from "./components/notifications/notifications-page";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect based on authentication state and user role
  const getHomePath = () => {
    if (!isAuthenticated) return "/";
    return user?.role === "lecturer" ? "/lecturer-dashboard" : "/student-dashboard";
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={getHomePath()} />
          ) : (
            <AuthPage />
          )
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Lecturer Routes */}
      <Route path="/" element={<AppLayout requiredRole="lecturer" />}>
        <Route path="lecturer-dashboard" element={<LecturerDashboard />} />
        <Route path="lecturer-timetable" element={<LecturerTimetable />} />
        <Route path="lecturer-profile" element={<LecturerProfile />} />
        <Route path="lecturer-courses" element={<LecturerTimetable />} />
        <Route path="lecturer-classes" element={<LecturerTimetable />} />
      </Route>

      {/* Student Routes */}
      <Route path="/" element={<AppLayout requiredRole="student" />}>
        <Route path="student-dashboard" element={<StudentDashboard />} />
        <Route path="student-timetable" element={<StudentTimetable />} />
        <Route path="student-schedule" element={<StudentTimetable />} />
        <Route path="student-profile" element={<StudentProfile />} />
      </Route>

      {/* Common Protected Routes */}
      <Route path="/" element={<AppLayout />}>
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<StudentProfile />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
