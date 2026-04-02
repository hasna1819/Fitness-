import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import WorkoutTimer from "./pages/WorkoutTimer";
import Progress from "./pages/Progress";
import CheckIn from "./pages/CheckIn";
import MyPlan from "./pages/MyPlan";
import DietTracker from "./pages/DietTracker";
import Profile from "./pages/Profile";
import TrainerUsers from "./pages/TrainerUsers";
import TrainerPlans from "./pages/TrainerPlans";
import AdminUsers from "./pages/AdminUsers";
import AdminTrainers from "./pages/AdminTrainers";
import AdminEquipment from "./pages/AdminEquipment";
import AdminMemberships from "./pages/AdminMemberships";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen bg-dark"><div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/timer" element={<WorkoutTimer />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/my-plan" element={<MyPlan />} />
        <Route path="/diet" element={<DietTracker />} />
        <Route path="/profile" element={<Profile />} />
        {/* Trainer */}
        <Route path="/trainer/users" element={<ProtectedRoute roles={["trainer", "admin"]}><TrainerUsers /></ProtectedRoute>} />
        <Route path="/trainer/plans" element={<ProtectedRoute roles={["trainer", "admin"]}><TrainerPlans /></ProtectedRoute>} />
        {/* Admin */}
        <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/trainers" element={<ProtectedRoute roles={["admin"]}><AdminTrainers /></ProtectedRoute>} />
        <Route path="/admin/equipment" element={<ProtectedRoute roles={["admin"]}><AdminEquipment /></ProtectedRoute>} />
        <Route path="/admin/memberships" element={<ProtectedRoute roles={["admin"]}><AdminMemberships /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;