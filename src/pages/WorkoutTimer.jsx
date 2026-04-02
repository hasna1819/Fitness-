import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Timer, Clock, ChevronUp, ChevronDown } from "lucide-react";

const WorkoutTimer = () => {
    const [mode, setMode] = useState("stopwatch");
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [countdownTime, setCountdownTime] = useState(60);
    const [rounds, setRounds] = useState(0);
    const [laps, setLaps] = useState([]);
    const intervalRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => () => clearInterval(intervalRef.current), []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => {
                    if (mode === "countdown") {
                        if (prev <= 1) {
                            clearInterval(intervalRef.current);
                            setIsRunning(false);
                            setRounds((r) => r + 1);
                            try { audioRef.current?.play(); } catch (e) { }
                            return 0;
                        }
                        return prev - 1;
                    }
                    return prev + 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, mode]);

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setTime(mode === "countdown" ? countdownTime : 0);
        setLaps([]);
    };
    const addLap = () => { if (mode === "stopwatch" && isRunning) setLaps([...laps, time]); };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const adjustCountdown = (delta) => {
        if (!isRunning) {
            const newTime = Math.max(5, countdownTime + delta);
            setCountdownTime(newTime);
            setTime(newTime);
        }
    };

    const switchMode = (newMode) => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setMode(newMode);
        setLaps([]);
        setTime(newMode === "countdown" ? countdownTime : 0);
    };

    const progress = mode === "countdown" ? ((countdownTime - time) / countdownTime) * 100 : 0;
    const circumference = 2 * Math.PI * 120;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const presets = [30, 45, 60, 90, 120, 180, 300];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Workout <span className="gradient-text">Timer</span>
                </h1>
                <p className="text-muted-foreground mt-1">Time your exercises and rest periods</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex justify-center">
                <Tabs value={mode} onValueChange={switchMode}>
                    <TabsList>
                        <TabsTrigger value="stopwatch" className="gap-2"><Timer size={14} /> Stopwatch</TabsTrigger>
                        <TabsTrigger value="countdown" className="gap-2"><Clock size={14} /> Countdown</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Timer Display */}
            <div className="flex justify-center">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 sm:p-12 text-center">
                        <div className="relative inline-flex items-center justify-center mb-8">
                            <svg width="270" height="270" className="-rotate-90">
                                <circle cx="135" cy="135" r="120" stroke="var(--color-muted)" strokeWidth="5" fill="none" />
                                {mode === "countdown" && (
                                    <circle cx="135" cy="135" r="120" stroke="url(#timerGradient)" strokeWidth="5" fill="none"
                                        strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 120}`}
                                        strokeDashoffset={strokeDashoffset}
                                        style={{ transition: "stroke-dashoffset 1s linear" }} />
                                )}
                                {mode === "stopwatch" && (
                                    <circle cx="135" cy="135" r="120" stroke="url(#timerGradient)" strokeWidth="5" fill="none"
                                        strokeLinecap="round" strokeDasharray="10 5"
                                        className={isRunning ? "animate-spin-slow" : ""} />
                                )}
                                <defs>
                                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#6C63FF" />
                                        <stop offset="100%" stopColor="#4ECDC4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-5xl sm:text-6xl font-black text-foreground font-mono tracking-wider">
                                    {formatTime(time)}
                                </p>
                                {mode === "countdown" && rounds > 0 && (
                                    <p className="text-primary font-semibold mt-2">Round {rounds} done!</p>
                                )}
                            </div>
                        </div>

                        {/* Countdown adjustment */}
                        {mode === "countdown" && !isRunning && (
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <Button variant="outline" size="icon" onClick={() => adjustCountdown(-5)}>
                                    <ChevronDown size={18} />
                                </Button>
                                <span className="text-muted-foreground text-sm font-medium w-16 text-center">{formatTime(countdownTime)}</span>
                                <Button variant="outline" size="icon" onClick={() => adjustCountdown(5)}>
                                    <ChevronUp size={18} />
                                </Button>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-4">
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl" onClick={resetTimer}>
                                <RotateCcw size={20} />
                            </Button>
                            <button onClick={toggleTimer}
                                className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-lg cursor-pointer ${isRunning
                                    ? "bg-gradient-to-br from-red-500 to-red-600 hover:shadow-red-500/30"
                                    : "bg-gradient-to-br from-primary to-accent hover:shadow-primary/30"
                                    } hover:scale-105 active:scale-95`}>
                                {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                            </button>
                            {mode === "stopwatch" && (
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl"
                                    onClick={addLap} disabled={!isRunning}>
                                    <span className="text-xs font-bold">LAP</span>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Presets */}
            {mode === "countdown" && (
                <div className="flex flex-wrap justify-center gap-2">
                    {presets.map((preset) => (
                        <Button key={preset} variant={countdownTime === preset ? "default" : "outline"} size="sm"
                            onClick={() => { setCountdownTime(preset); setTime(preset); }}>
                            {formatTime(preset)}
                        </Button>
                    ))}
                </div>
            )}

            {/* Laps */}
            {laps.length > 0 && (
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-base">Laps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {laps.map((lap, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-muted-foreground text-sm">Lap {i + 1}</span>
                                    <span className="font-mono font-semibold text-foreground">{formatTime(lap)}</span>
                                    {i > 0 && <span className="text-xs text-muted-foreground">+{formatTime(lap - laps[i - 1])}</span>}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <audio ref={audioRef} preload="auto">
                <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczIj2markup..." type="audio/wav" />
            </audio>
        </div>
    );
};

export default WorkoutTimer;
