import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    LayoutDashboard, Dumbbell, CalendarCheck, TrendingUp, Users,
    ClipboardList, Settings, LogOut, Shield, Wrench, Timer,
    UserCog, Menu, X, UtensilsCrossed
} from "lucide-react";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => { logout(); navigate("/login"); };

    const userLinks = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/workouts", icon: Dumbbell, label: "Workouts" },
        { to: "/my-plan", icon: ClipboardList, label: "My Plan" },
        { to: "/timer", icon: Timer, label: "Workout Timer" },
        { to: "/diet", icon: UtensilsCrossed, label: "Diet Tracker" },
        { to: "/progress", icon: TrendingUp, label: "Progress" },
        { to: "/checkin", icon: CalendarCheck, label: "Check-in" },
        { to: "/profile", icon: Settings, label: "Profile" },
    ];

    const trainerLinks = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/trainer/users", icon: Users, label: "My Clients" },
        { to: "/trainer/plans", icon: ClipboardList, label: "Workout Plans" },
        { to: "/profile", icon: Settings, label: "Profile" },
    ];

    const adminLinks = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/admin/users", icon: Users, label: "Users" },
        { to: "/admin/trainers", icon: UserCog, label: "Trainers" },
        { to: "/admin/equipment", icon: Wrench, label: "Equipment" },
        { to: "/admin/memberships", icon: Shield, label: "Memberships" },
        { to: "/profile", icon: Settings, label: "Profile" },
    ];

    const links = user?.role === "admin" ? adminLinks : user?.role === "trainer" ? trainerLinks : userLinks;

    const roleConfig = {
        admin: { label: "Administrator", color: "text-red-400", bg: "bg-red-500/10" },
        trainer: { label: "Trainer", color: "text-amber-400", bg: "bg-amber-500/10" },
        user: { label: "Member", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    };
    const role = roleConfig[user?.role] || roleConfig.user;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 p-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                    <Dumbbell size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-base font-bold gradient-text leading-tight">FitPulse</h1>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${role.color}`}>{role.label}</p>
                </div>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                    >
                        <link.icon size={18} className="shrink-0" />
                        <span className="truncate">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <Separator />

            {/* User info */}
            <div className="p-4">
                <div className="flex items-center gap-3 mb-3 px-1">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate leading-tight">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-lg bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center text-foreground shadow-lg"
            >
                <Menu size={18} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
                    <div className="w-64 h-full bg-sidebar border-r border-sidebar-border shadow-2xl animate-slide-in-left" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted z-10">
                            <X size={16} />
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-30">
                <SidebarContent />
            </aside>
        </>
    );
};

export default Sidebar;
