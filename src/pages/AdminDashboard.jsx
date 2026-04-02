import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import StatCard from "../components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Users, UserCog, CreditCard, Wrench, TrendingUp, DollarSign,
    AlertTriangle, Activity, Shield, ArrowRight, ArrowUpRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const res = await API.get("/admin/stats");
            setStats(res.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    const totalRevenue = stats?.totalRevenue || 0;
    const totalSalaries = stats?.totalSalaries || 0;
    const profit = totalRevenue - totalSalaries;

    const membershipData = [
        { name: "Active", value: stats?.activeMembers || 0, color: "#4ECDC4" },
        { name: "Inactive", value: Math.max(0, (stats?.totalUsers || 0) - (stats?.activeMembers || 0)), color: "#FF6B6B" },
    ];

    const typeData = [
        { name: "Premium", value: stats?.premiumMembers || 0, color: "#6C63FF" },
        { name: "Standard", value: stats?.standardMembers || 0, color: "#4ECDC4" },
        { name: "Basic", value: stats?.basicMembers || 0, color: "#FFE66D" },
        { name: "None", value: stats?.noMembership || 0, color: "#71717a" },
    ].filter(d => d.value > 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload?.length) {
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
                    <p className="text-sm font-semibold" style={{ color: payload[0].payload.color }}>
                        {payload[0].name}: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-card via-background to-card border border-border p-6 sm:p-8">
                <div className="absolute top-[-30%] right-[-5%] w-56 h-56 bg-red-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] left-[20%] w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Badge variant="destructive" className="mb-2">
                            <Shield size={12} /> Administrator
                        </Badge>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                            Welcome, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">Complete overview of your gym</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Net Profit</p>
                        <p className={`text-2xl font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            ₹{profit.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Primary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Members" value={stats?.totalUsers || 0} color="primary" delay={0} />
                <StatCard icon={UserCog} label="Trainers" value={stats?.totalTrainers || 0} color="accent" delay={80} />
                <StatCard icon={CreditCard} label="Monthly Revenue" value={`₹${(stats?.monthlyRevenue || 0).toLocaleString()}`} color="success" delay={160} />
                <StatCard icon={Wrench} label="Equipment" value={stats?.totalEquipment || 0} color="warning" delay={240} />
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Activity} label="Active Members" value={stats?.activeMembers || 0} color="info" delay={0} />
                <StatCard icon={DollarSign} label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="success" delay={80} />
                <StatCard icon={DollarSign} label="Trainer Salaries" value={`₹${totalSalaries.toLocaleString()}`} color="danger" delay={160} />
                <StatCard icon={AlertTriangle} label="Needs Maintenance" value={stats?.equipmentNeedsMaintenance || 0}
                    color={stats?.equipmentNeedsMaintenance > 0 ? "danger" : "success"} delay={240} />
            </div>

            {/* Charts + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Membership Chart */}
                <Card className="animate-fade-in-up stagger-4">
                    <CardHeader>
                        <CardTitle className="text-base">Membership Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={membershipData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                                        paddingAngle={4} dataKey="value" strokeWidth={0}>
                                        {membershipData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3 shrink-0">
                                {membershipData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                                        <span className="text-sm text-muted-foreground">{item.name}</span>
                                        <span className="text-sm font-semibold text-foreground ml-auto">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="animate-fade-in-up stagger-5">
                    <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Manage Users", desc: "View & edit members", icon: Users, href: "/admin/users", color: "text-primary" },
                                { label: "Trainers", desc: "Staff management", icon: UserCog, href: "/admin/trainers", color: "text-amber-400" },
                                { label: "Equipment", desc: "Track inventory", icon: Wrench, href: "/admin/equipment", color: "text-accent" },
                                { label: "Memberships", desc: "Plans & billing", icon: Shield, href: "/admin/memberships", color: "text-emerald-400" },
                            ].map((action, i) => (
                                <a key={i} href={action.href}
                                    className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group cursor-pointer flex flex-col gap-2">
                                    <div className={`p-2 rounded-lg bg-muted w-fit ${action.color}`}>
                                        <action.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{action.label}</p>
                                        <p className="text-xs text-muted-foreground">{action.desc}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground/50 group-hover:text-primary flex items-center gap-0.5 mt-auto transition-colors">
                                        Open <ArrowUpRight size={10} />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alert */}
            {stats?.equipmentNeedsMaintenance > 0 && (
                <Card className="border-amber-500/30 animate-fade-in-up">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <AlertTriangle size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{stats.equipmentNeedsMaintenance} equipment item(s) need maintenance</p>
                            <p className="text-xs text-muted-foreground">Review and schedule maintenance</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => window.location.href = "/admin/equipment"}>
                            View <ArrowRight size={14} />
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminDashboard;
