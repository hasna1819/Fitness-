import React, { useEffect, useState } from "react";
import API from "../api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClipboardList, Calendar, User, Dumbbell } from "lucide-react";

const MyPlan = () => {
    const [todayPlans, setTodayPlans] = useState([]);
    const [allPlans, setAllPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [todayRes, allRes] = await Promise.all([
                API.get("/workout-plans/today"),
                API.get("/workout-plans/my-plans"),
            ]);
            setTodayPlans(todayRes.data);
            setAllPlans(allRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    My Workout <span className="gradient-text">Plan</span>
                </h1>
                <p className="text-muted-foreground mt-1">Your trainer-assigned workout schedule</p>
            </div>

            {/* Today's Workout */}
            {todayPlans.length > 0 ? (
                <Card className="animate-fade-in-up border-primary/20">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Today's Workout</CardTitle>
                                <CardDescription>
                                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {todayPlans.map((plan) => (
                            <div key={plan._id} className="mb-4 last:mb-0">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-foreground">{plan.title}</h4>
                                    <Badge variant="secondary">{plan.todayPlan?.focus}</Badge>
                                </div>
                                {plan.todayPlan?.isRestDay ? (
                                    <div className="p-6 rounded-xl bg-muted/50 text-center">
                                        <p className="text-2xl mb-2">🧘</p>
                                        <p className="text-muted-foreground font-medium">Rest Day — recover and recharge</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {plan.todayPlan?.exercises?.map((ex, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                                <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                                    {i + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-foreground text-sm">{ex.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {ex.sets} sets × {ex.reps} reps{ex.weight > 0 && ` • ${ex.weight}kg`}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {plan.trainer && (
                                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                                        <User size={14} />
                                        <span>Trainer: {plan.trainer.name}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ) : (
                <Card className="animate-fade-in-up">
                    <CardContent className="p-8 text-center">
                        <Calendar size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No workout scheduled for today</p>
                    </CardContent>
                </Card>
            )}

            {/* Weekly Plans */}
            {allPlans.map((plan, idx) => (
                <Card key={plan._id} className="animate-fade-in-up" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-base">{plan.title}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="default">{plan.difficulty}</Badge>
                                <Badge variant="secondary">{plan.durationWeeks}w</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {days.map((day) => {
                                const dp = plan.days?.find((d) => d.day === day);
                                return (
                                    <div key={day} className={`p-4 rounded-xl border transition-colors ${dp?.isRestDay
                                            ? "bg-muted/30 border-border"
                                            : dp
                                                ? "bg-muted/50 border-primary/15 hover:bg-muted"
                                                : "bg-muted/20 border-border opacity-50"
                                        }`}>
                                        <p className="font-semibold text-foreground text-sm mb-1">{day}</p>
                                        {dp?.isRestDay ? (
                                            <p className="text-xs text-muted-foreground">🧘 Rest</p>
                                        ) : dp ? (
                                            <>
                                                <p className="text-xs text-primary font-medium mb-1">{dp.focus}</p>
                                                {dp.exercises?.map((ex, i) => (
                                                    <p key={i} className="text-xs text-muted-foreground truncate">
                                                        • {ex.name} ({ex.sets}×{ex.reps})
                                                    </p>
                                                ))}
                                            </>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">—</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {allPlans.length === 0 && (
                <Card className="animate-fade-in-up stagger-2">
                    <CardContent className="p-12 text-center">
                        <ClipboardList size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                        <p className="text-muted-foreground text-lg">No plans assigned yet</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">Ask your trainer to assign a workout plan</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default MyPlan;
