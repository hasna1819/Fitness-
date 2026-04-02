import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import StatCard from "../components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Users, ClipboardList, UserCog, ArrowRight, Flame, Target, Crown } from "lucide-react";

const TrainerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    API.get("/trainer/stats"),
                    API.get("/trainer/users"),
                ]);
                setStats(statsRes.data);
                setClients(usersRes.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    const goalBadgeVariant = {
        "Lose Weight": "destructive",
        "Gain Muscle": "default",
        "Maintain Fitness": "success",
        "Build Strength": "warning",
        "Improve Endurance": "info",
    };

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-card via-background to-card border border-border p-6 sm:p-8">
                <div className="absolute top-[-30%] right-[-5%] w-56 h-56 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Badge variant="warning" className="mb-2">
                            <Crown size={12} /> Trainer
                        </Badge>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                            Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage your clients and workout plans</p>
                    </div>
                    <Button variant="gradient" onClick={() => window.location.href = "/trainer/plans"}>
                        <ClipboardList size={16} /> Create Plan
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={Users} label="Total Clients" value={stats?.totalClients || clients.length} color="primary" delay={0} />
                <StatCard icon={ClipboardList} label="Active Plans" value={stats?.activePlans || 0} color="success" delay={80} />
                <StatCard icon={UserCog} label="Total Plans" value={stats?.totalPlans || 0} color="accent" delay={160} />
            </div>

            {/* Clients */}
            <Card className="animate-fade-in-up stagger-3">
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users size={18} className="text-primary" /> Your Clients
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = "/trainer/users"}>
                        View all <ArrowRight size={14} />
                    </Button>
                </CardHeader>
                <CardContent>
                    {clients.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {clients.map((client, i) => (
                                <div key={client._id}
                                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in-up"
                                    style={{ animationDelay: `${i * 60}ms` }}>
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>{client.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground text-sm truncate">{client.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge variant={goalBadgeVariant[client.goal] || "secondary"}>
                                            {client.goal || "No goal"}
                                        </Badge>
                                        {client.currentStreak > 0 && (
                                            <span className="text-xs text-amber-400 flex items-center gap-0.5">
                                                <Flame size={12} /> {client.currentStreak}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Users size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                            <p className="text-muted-foreground">No clients assigned yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                    { label: "Manage Clients", desc: "View and manage client profiles", icon: Users, href: "/trainer/users", color: "text-primary" },
                    { label: "Workout Plans", desc: "Create and assign workout plans", icon: ClipboardList, href: "/trainer/plans", color: "text-accent" },
                ].map((action, i) => (
                    <a key={i} href={action.href}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer group">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className={`p-3 rounded-lg bg-muted ${action.color}`}>
                                    <action.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground text-sm">{action.label}</p>
                                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                                </div>
                                <ArrowRight size={16} className="text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                            </CardContent>
                        </Card>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default TrainerDashboard;
