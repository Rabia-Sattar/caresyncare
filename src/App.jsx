// src/App.jsx
import React, { useContext } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "./context/authcontext";
import "./utils/axiosconfig";

// Components
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ScrollToTop from "./components/scrolltotop";
import ProtectedRoute from "./components/protectedroute";
import Loader from "./components/loader";
import usePageLoader from "./hooks/usePageLoader";

// Public Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotpassword";
import ResetPassword from "./pages/resetpassword";
import DoctorsList from "./pages/doctorslist";
import DoctorDetail from "./pages/doctordetail";
import PharmaciesList from "./pages/pharmacieslist";
import Nurse from "./pages/nurse";
import Profile from "./pages/profile";


// Dashboard Pages
import Dashboard from "./pages/dashboard";
import FamilyDashboard from "./pages/familydashboard";
import FamilyDetails from "./pages/familydetails";
import Tasks from "./pages/tasks";
import Calendar from "./pages/calendar";
import HealthLogs from "./pages/healthlogs";
import Reminders from "./pages/reminders";
import Forum from "./pages/forum";
import FamilyChat from "./pages/familychat";
import AnalyticsDashboard from "./pages/analyticsdashboard";
import AIInsights from "./pages/aiinsights";
import AIChatbot from "./pages/aichatbot";
import HealthTrends from "./pages/healthtrends";
import SmartReminders from "./pages/smartreminders";
import Emergency from "./pages/emergency";
import Notes from "./pages/notes";
import Analytic from "./pages/analytic";

// Layout
import DashboardLayout from "./layouts/dashboardlayout";

export default function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Loader on specific pages
  const loaderPages = ["/", "/doctors", "/pharmacies", "/nurses", "/login", "/signup", "/dashboard","/profile"];
  
  // Show loader if pathname matches exactly or starts with dynamic route
  const showLoader =
    loaderPages.includes(location.pathname) ||
    location.pathname.startsWith("/doctors/"); // For doctor detail page

  const loading = usePageLoader(showLoader ? 800 : 0);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <ScrollToTop />

          <Routes>
            {/* Public Layout */}
            <Route
              element={
                <>
                  <Navbar />
                  <main style={{ paddingTop: "64px" }}>
                    <Outlet />
                  </main>
                  <Footer />
                </>
              }
            >
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/dashboard" />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              <Route
                path="/doctors"
                element={<ProtectedRoute><DoctorsList /></ProtectedRoute>}
              />
              <Route
                path="/doctors/:id"
                element={<ProtectedRoute><DoctorDetail /></ProtectedRoute>}
              />
              <Route
                path="/pharmacies"
                element={<ProtectedRoute><PharmaciesList /></ProtectedRoute>}
              />
              <Route
                path="/nurses"
                element={<ProtectedRoute><Nurse /></ProtectedRoute>}
              />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>

            {/* Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/family-dashboard" element={<FamilyDashboard />} />
              <Route path="/family/:id" element={<FamilyDetails />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/health-logs" element={<HealthLogs />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/family-chat" element={<FamilyChat />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/ai-chatbot" element={<AIChatbot />} />
              <Route path="/health-trends" element={<HealthTrends />} />
              <Route path="/smart-reminders" element={<SmartReminders />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/analytic" element={<Analytic />} />
            </Route>

            {/* Fallback */}
            <Route
              path="*"
              element={<Navigate to={user ? "/dashboard" : "/login"} />}
            />
          </Routes>
        </>
      )}
    </>
  );
}