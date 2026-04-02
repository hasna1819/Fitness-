import React, { useEffect, useState } from "react";
import API from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "../components/StatCard";
import { CalendarCheck, Flame, TrendingUp, Check, Clock } from "lucide-react";
import toast from "react-hot-toast";

const CheckIn = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const res = await API.get("/auth/checkin-stats");
            setStats(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCheckIn = async () => {
        setCheckingIn(true);
        try {
            await API.post("/auth/checkin");
            toast.success("Checked in! 💪");
            fetchStats();
        } catch (err) {
            toast.error(err.response?.data?.message || "Already checked in today");
        } finally { setCheckingIn(false); }
    };

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const monthName = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const checkInDates = (stats?.checkIns || []).map(ci =>
        new Date(ci.date || ci).toDateString()
    );
    const isCheckedToday = checkInDates.includes(today.toDateString());

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Daily <span className="gradient-text">Check-in</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Keep your streak alive!</p>
                </div>
                <Button variant="gradient" onClick={handleCheckIn}
                    disabled={checkingIn || isCheckedToday} className="gap-2">
                    {isCheckedToday ? (
                        <><Check size={16} /> Checked In Today</>
                    ) : checkingIn ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <><CalendarCheck size={16} /> Check In Now</>
                    )}
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={CalendarCheck} label="Total Check-ins" value={stats?.totalCheckIns || 0} color="primary" delay={0} />
                <StatCard icon={Flame} label="Current Streak" value={`${stats?.currentStreak || 0} days`} color="warning" delay={80} />
                <StatCard icon={TrendingUp} label="Best Streak" value={`${stats?.longestStreak || 0} days`} color="success" delay={160} />
            </div>

            {/* Calendar */}
            <Card className="animate-fade-in-up stagger-3">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <CalendarCheck size={18} className="text-primary" /> {monthName}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`e-${i}`} className="aspect-square" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const date = new Date(today.getFullYear(), today.getMonth(), day);
                            const isChecked = checkInDates.includes(date.toDateString());
                            const isToday = day === today.getDate();

                            return (
                                <div key={day}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                                        ${isChecked ? "bg-primary/20 text-primary ring-1 ring-primary/30" :
                                            isToday ? "bg-muted text-foreground ring-1 ring-border" :
                                                date > today ? "text-muted-foreground/40" : "text-muted-foreground hover:bg-muted"}
                                    `}
                                >
                                    {isChecked ? <Check size={14} /> : day}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-3 h-3 rounded bg-primary/20 ring-1 ring-primary/30" /> Checked in
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-3 h-3 rounded bg-muted ring-1 ring-border" /> Today
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CheckIn;
