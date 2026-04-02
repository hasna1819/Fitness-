import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const colorMap = {
    primary: { icon: "bg-primary/10 text-primary", accent: "border-primary/20" },
    accent: { icon: "bg-accent/10 text-accent", accent: "border-accent/20" },
    success: { icon: "bg-emerald-500/10 text-emerald-400", accent: "border-emerald-500/20" },
    warning: { icon: "bg-amber-500/10 text-amber-400", accent: "border-amber-500/20" },
    danger: { icon: "bg-red-500/10 text-red-400", accent: "border-red-500/20" },
    info: { icon: "bg-sky-500/10 text-sky-400", accent: "border-sky-500/20" },
};

const StatCard = ({ icon: Icon, label, value, sub, color = "primary", trend, delay = 0 }) => {
    const colors = colorMap[color] || colorMap.primary;

    return (
        <Card
            className={cn(
                "animate-fade-in-up border-border hover:border-border/80 transition-all duration-300",
                colors.accent
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className={cn("p-2.5 rounded-lg", colors.icon)}>
                        <Icon size={20} />
                    </div>
                    {trend && (
                        <span className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-md",
                            trend > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        )}>
                            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
            </CardContent>
        </Card>
    );
};

export default StatCard;
