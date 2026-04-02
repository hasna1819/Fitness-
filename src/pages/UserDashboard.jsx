import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import StatCard from "../components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    Dumbbell, Flame, Clock, CalendarCheck, TrendingUp,
    ArrowRight, Activity, Target, Zap, ChevronRight, ClipboardList
} from "lucide-react";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const UserDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, workoutsRes] = await Promise.all([
                    API.get("/auth/checkin-stats"),
                    API.get("/workouts?limit=5"),
                ]);
                setStats(statsRes.data);
                setWorkouts(workoutsRes.data);
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

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    const weeklyWorkouts = workouts.filter(w => {
        const d = new Date(w.date);
        const now = new Date();
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return d >= weekAgo;
    });
    const weeklyCalories = weeklyWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const weeklyDuration = weeklyWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const completionRate = Math.min(100, Math.round((weeklyWorkouts.length / 5) * 100));
    const circumference = 2 * Math.PI * 42;

    const chartData = workouts.slice(0, 7).reverse().map(w => ({
        name: new Date(w.date).toLocaleDateString("en-US", { weekday: "short" }),
        calories: w.caloriesBurned || 0,
        duration: w.duration || 0,
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) {
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    {payload.map((entry, i) => (
                        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-card via-background to-card border border-border p-6 sm:p-8">
                <div className="absolute top-[-30%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] left-[10%] w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">{today}</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                            {greeting}, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">Ready to crush your goals today?</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {stats?.currentStreak > 0 && (
                            <Badge variant="warning" className="text-sm px-3 py-1.5 gap-1.5">
                                <Flame size={14} /> {stats.currentStreak} day streak
                            </Badge>
                        )}
                        <Button variant="gradient" onClick={() => window.location.href = "/workouts"}>
                            <Zap size={16} /> Start Workout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Popular Programs (Visuals) */}
            <div className="animate-fade-in-up stagger-1">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-foreground">Popular Programs</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">See All <ChevronRight size={14} /></Button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: "none" }}>
                    {/* Card 1 */}
                    <div className="relative w-64 h-80 shrink-0 rounded-3xl overflow-hidden snap-start group cursor-pointer shadow-sm border border-border/50">
                        <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400&h=600" alt="Yoga" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 text-left p-5">
                            <Badge className="mb-2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none mix-blend-overlay">Flow Yoga</Badge>
                            <h3 className="text-2xl font-bold text-white mb-1">Katie Foster</h3>
                            <p className="text-white/80 text-sm font-medium">30 mins • Beginner</p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="relative w-64 h-80 shrink-0 rounded-3xl overflow-hidden snap-start group cursor-pointer shadow-sm border border-border/50">
                        <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400&h=600" alt="Strength" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 text-left p-5">
                            <Badge className="mb-2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none mix-blend-overlay">Strength</Badge>
                            <h3 className="text-2xl font-bold text-white mb-1 leading-tight">Make Yourself Better</h3>
                            <p className="text-white/80 text-sm font-medium mt-1">45 mins • Advanced</p>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="relative w-64 h-80 shrink-0 rounded-3xl overflow-hidden snap-start group cursor-pointer shadow-sm border border-border/50">
                        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400&h=600" alt="Cardio" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 text-left p-5">
                            <Badge className="mb-2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none mix-blend-overlay">Cardio</Badge>
                            <h3 className="text-2xl font-bold text-white mb-1">Jackie West</h3>
                            <p className="text-white/80 text-sm font-medium">20 mins • HIIT</p>
                        </div>
                    </div>
                    {/* Card 4 */}
                    <div className="relative w-64 h-80 shrink-0 rounded-3xl overflow-hidden snap-start group cursor-pointer shadow-sm border border-border/50">
                        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400&h=600" alt="Lifting" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 text-left p-5">
                            <Badge className="mb-2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none mix-blend-overlay">Power</Badge>
                            <h3 className="text-2xl font-bold text-white mb-1">Barbell Press</h3>
                            <p className="text-white/80 text-sm font-medium">60 mins • Intermediate</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Dumbbell} label="Total Workouts" value={workouts.length} color="primary" delay={0} />
                <StatCard icon={Flame} label="Weekly Calories" value={weeklyCalories} color="warning" delay={80} />
                <StatCard icon={Clock} label="Weekly Minutes" value={weeklyDuration} color="accent" delay={160} />
                <StatCard icon={CalendarCheck} label="Check-ins" value={stats?.totalCheckIns || 0} color="success" delay={240} />
            </div>

            {/* Activity Ring + Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Activity Ring */}
                <Card className="animate-fade-in-up stagger-4">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Target size={18} className="text-primary" /> Weekly Goal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center pb-6">
                        <div className="relative">
                            <svg width="120" height="120" className="activity-ring">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--color-muted))" strokeWidth="8" />
                                <circle cx="60" cy="60" r="50" fill="none"
                                    stroke="url(#userProgressGrad)" strokeWidth="8" strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 50}`}
                                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionRate / 100)}`} />
                                <defs>
                                    <linearGradient id="userProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#6C63FF" />
                                        <stop offset="100%" stopColor="#4ECDC4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-foreground">{completionRate}%</span>
                                <span className="text-xs text-muted-foreground">Complete</span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">{weeklyWorkouts.length}/5 workouts this week</p>
                    </CardContent>
                </Card>

                {/* Calorie Chart */}
                <Card className="animate-fade-in-up stagger-5">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Flame size={18} className="text-amber-400" /> Calories Burned
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={160}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#6C63FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="calories" stroke="#6C63FF" strokeWidth={2} fill="url(#calGrad)" name="Calories" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Duration Chart */}
                <Card className="animate-fade-in-up stagger-6">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Activity size={18} className="text-accent" /> Duration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="duration" fill="#4ECDC4" radius={[4, 4, 0, 0]} name="Minutes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Workouts */}
            <Card className="animate-fade-in-up stagger-7">
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="text-base">Recent Workouts</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = "/workouts"}>
                        View all <ChevronRight size={14} />
                    </Button>
                </CardHeader>
                <CardContent>
                    {workouts.length > 0 ? (
                        <div className="space-y-3">
                            {workouts.slice(0, 5).map((w, i) => (
                                <div key={w._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Dumbbell size={16} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground text-sm">{w.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {w.duration}min
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={w.status === "completed" ? "success" : "secondary"}>
                                            {w.status || "planned"}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">{w.caloriesBurned} cal</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Dumbbell size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                            <p className="text-muted-foreground">No workouts yet. Start your first one!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Log Workout", icon: Dumbbell, href: "/workouts", color: "text-primary" },
                    { label: "Check In", icon: CalendarCheck, href: "/checkin", color: "text-emerald-400" },
                    { label: "Track Progress", icon: TrendingUp, href: "/progress", color: "text-amber-400" },
                    { label: "My Plan", icon: ClipboardList, href: "/my-plan", color: "text-sky-400" },
                ].map((action, i) => (
                    <a key={i} href={action.href}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer group">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-muted ${action.color}`}>
                                    <action.icon size={18} />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
                                <ArrowRight size={14} className="ml-auto text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                            </CardContent>
                        </Card>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default UserDashboard;
