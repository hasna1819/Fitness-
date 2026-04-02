import React from "react";
import { useAuth } from "../context/AuthContext";
import UserDashboard from "./UserDashboard";
import TrainerDashboard from "./TrainerDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
    const { user } = useAuth();

    if (user?.role === "admin") return <AdminDashboard />;
    if (user?.role === "trainer") return <TrainerDashboard />;
    return <UserDashboard />;
};

export default Dashboard;