import React, { useEffect, useState } from "react";
import API from "../api";
import Modal from "../components/Modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Plus, Trash2, Scale } from "lucide-react";
import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import toast from "react-hot-toast";

const Progress = () => {
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        weight: "", bodyFat: "", muscleMass: "", chest: "", waist: "", hips: "", arms: "", thighs: "", notes: "",
    });

    useEffect(() => { fetchProgress(); }, []);

    const fetchProgress = async () => {
        try {
            const res = await API.get("/progress");
            setProgress(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/progress", form);
            setShowModal(false);
            setForm({ weight: "", bodyFat: "", muscleMass: "", chest: "", waist: "", hips: "", arms: "", thighs: "", notes: "" });
            fetchProgress();
            toast.success("Progress logged!");
        } catch (err) { toast.error("Failed"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this entry?")) return;
        try {
            await API.delete(`/progress/${id}`);
            fetchProgress();
            toast.success("Deleted");
        } catch (err) { toast.error("Delete failed"); }
    };

    const chartData = progress.map((p) => ({
        date: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        weight: p.weight ? Number(p.weight).toFixed(1) : null,
        bodyFat: p.bodyFat ? Number(p.bodyFat).toFixed(1) : null,
        muscleMass: p.muscleMass ? Number(p.muscleMass).toFixed(1) : null,
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

    const latestEntry = progress[progress.length - 1];

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
                        Progress <span className="gradient-text">Tracking</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Monitor your body metrics over time</p>
                </div>
                <Button variant="gradient" onClick={() => setShowModal(true)}>
                    <Plus size={16} /> Log Progress
                </Button>
            </div>

            {/* Current Stats */}
            {latestEntry && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Weight", value: `${latestEntry.weight || "—"}kg`, color: "text-primary" },
                        { label: "Body Fat", value: `${latestEntry.bodyFat || "—"}%`, color: "text-red-400" },
                        { label: "Muscle Mass", value: `${latestEntry.muscleMass || "—"}kg`, color: "text-accent" },
                        { label: "Waist", value: `${latestEntry.waist || "—"}cm`, color: "text-amber-400" },
                    ].map((stat, i) => (
                        <Card key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                            <CardContent className="p-4 text-center">
                                <p className={`text-2xl font-bold text-foreground`}>{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Charts */}
            {chartData.length > 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="animate-fade-in-up stagger-4">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Scale size={18} className="text-primary" /> Weight Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#6C63FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="weight" stroke="#6C63FF" strokeWidth={2} fill="url(#weightGrad)" name="Weight (kg)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="animate-fade-in-up stagger-5">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp size={18} className="text-accent" /> Body Composition
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="bodyFat" stroke="#FF6B6B" strokeWidth={2} dot={{ fill: "#FF6B6B", r: 3 }} name="Body Fat (%)" />
                                    <Line type="monotone" dataKey="muscleMass" stroke="#4ECDC4" strokeWidth={2} dot={{ fill: "#4ECDC4", r: 3 }} name="Muscle Mass (kg)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* History Table */}
            <Card className="animate-fade-in-up stagger-6">
                <CardHeader>
                    <CardTitle className="text-base">History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="table-dark">
                            <thead>
                                <tr>
                                    <th>Date</th><th>Weight</th><th>Body Fat</th><th>Muscle</th><th>Waist</th><th>Notes</th><th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...progress].reverse().map((entry) => (
                                    <tr key={entry._id}>
                                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                                        <td className="font-medium">{entry.weight ? `${entry.weight}kg` : "—"}</td>
                                        <td>{entry.bodyFat ? `${entry.bodyFat}%` : "—"}</td>
                                        <td>{entry.muscleMass ? `${entry.muscleMass}kg` : "—"}</td>
                                        <td>{entry.waist ? `${entry.waist}cm` : "—"}</td>
                                        <td className="text-muted-foreground max-w-32 truncate">{entry.notes || "—"}</td>
                                        <td>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300"
                                                onClick={() => handleDelete(entry._id)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Progress">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Weight (kg)", key: "weight", placeholder: "75.5" },
                            { label: "Body Fat (%)", key: "bodyFat", placeholder: "18" },
                            { label: "Muscle Mass (kg)", key: "muscleMass", placeholder: "58" },
                            { label: "Chest (cm)", key: "chest", placeholder: "" },
                            { label: "Waist (cm)", key: "waist", placeholder: "" },
                            { label: "Hips (cm)", key: "hips", placeholder: "" },
                            { label: "Arms (cm)", key: "arms", placeholder: "" },
                            { label: "Thighs (cm)", key: "thighs", placeholder: "" },
                        ].map((field) => (
                            <div key={field.key} className="space-y-2">
                                <Label>{field.label}</Label>
                                <Input type="number" step="0.1" value={form[field.key]}
                                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                    placeholder={field.placeholder} />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <textarea value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            rows="2" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="gradient" className="flex-1">Save Progress</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Progress;
