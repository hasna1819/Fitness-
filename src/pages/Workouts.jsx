import React, { useEffect, useState } from "react";
import API from "../api";
import Modal from "../components/Modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dumbbell, Plus, Trash2, Edit2, Clock, Flame, Calendar,
    ChevronDown, Search, Filter
} from "lucide-react";
import toast from "react-hot-toast";

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({
        title: "", type: "Strength", duration: "",
        caloriesBurned: "", notes: "", status: "completed",
        exercises: [{ name: "", sets: "", reps: "", weight: "" }],
    });

    useEffect(() => { fetchWorkouts(); }, []);

    const fetchWorkouts = async () => {
        try {
            const res = await API.get("/workouts");
            setWorkouts(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/workouts/${editingId}`, form);
                toast.success("Workout updated!");
            } else {
                await API.post("/workouts", form);
                toast.success("Workout logged!");
            }
            setShowModal(false);
            resetForm();
            fetchWorkouts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this workout?")) return;
        try {
            await API.delete(`/workouts/${id}`);
            fetchWorkouts();
            toast.success("Deleted");
        } catch (err) { toast.error("Delete failed"); }
    };

    const handleEdit = (w) => {
        setEditingId(w._id);
        setForm({
            title: w.title || "", type: w.type || "Strength",
            duration: w.duration || "", caloriesBurned: w.caloriesBurned || "",
            notes: w.notes || "", status: w.status || "completed",
            exercises: w.exercises?.length > 0 ? w.exercises : [{ name: "", sets: "", reps: "", weight: "" }],
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({
            title: "", type: "Strength", duration: "",
            caloriesBurned: "", notes: "", status: "completed",
            exercises: [{ name: "", sets: "", reps: "", weight: "" }],
        });
    };

    const addExercise = () => setForm({ ...form, exercises: [...form.exercises, { name: "", sets: "", reps: "", weight: "" }] });
    const removeExercise = (i) => setForm({ ...form, exercises: form.exercises.filter((_, idx) => idx !== i) });
    const updateExercise = (i, field, value) => {
        const updated = [...form.exercises];
        updated[i][field] = value;
        setForm({ ...form, exercises: updated });
    };

    const filtered = workouts.filter(w => w.title?.toLowerCase().includes(search.toLowerCase()));
    const selectClasses = "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer";

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
                        My <span className="gradient-text">Workouts</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">{workouts.length} total workouts logged</p>
                </div>
                <Button variant="gradient" onClick={() => { resetForm(); setShowModal(true); }}>
                    <Plus size={16} /> Log Workout
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search workouts..." value={search}
                    onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>

            {/* Workout List */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((w, i) => (
                        <Card key={w._id} className="animate-fade-in-up group" style={{ animationDelay: `${i * 50}ms` }}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                            <Dumbbell size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{w.title}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Badge variant="secondary">{w.type || "General"}</Badge>
                                                <Badge variant={w.status === "completed" ? "success" : w.status === "skipped" ? "destructive" : "default"}>
                                                    {w.status || "planned"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(w)}>
                                            <Edit2 size={14} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => handleDelete(w._id)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={13} /> {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </span>
                                    {w.duration > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Clock size={13} /> {w.duration}min
                                        </span>
                                    )}
                                    {w.caloriesBurned > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Flame size={13} /> {w.caloriesBurned} cal
                                        </span>
                                    )}
                                </div>

                                {w.exercises?.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-border">
                                        <p className="text-xs text-muted-foreground mb-2">{w.exercises.length} exercise(s)</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {w.exercises.slice(0, 4).map((ex, j) => (
                                                <Badge key={j} variant="outline" className="text-xs">{ex.name}</Badge>
                                            ))}
                                            {w.exercises.length > 4 && (
                                                <Badge variant="outline" className="text-xs">+{w.exercises.length - 4} more</Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Dumbbell size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                            {search ? "No workouts match your search" : "No workouts logged yet. Start your first one!"}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }}
                title={editingId ? "Edit Workout" : "Log Workout"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2 col-span-2">
                            <Label>Title</Label>
                            <Input value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g., Morning Push Day" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <select value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className={selectClasses}>
                                {["Strength", "Cardio", "HIIT", "Yoga", "Stretching", "CrossFit", "Other"].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className={selectClasses}>
                                <option value="completed">Completed</option>
                                <option value="planned">Planned</option>
                                <option value="skipped">Skipped</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Duration (min)</Label>
                            <Input type="number" value={form.duration}
                                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                placeholder="45" />
                        </div>
                        <div className="space-y-2">
                            <Label>Calories</Label>
                            <Input type="number" value={form.caloriesBurned}
                                onChange={(e) => setForm({ ...form, caloriesBurned: e.target.value })}
                                placeholder="300" />
                        </div>
                    </div>

                    {/* Exercises */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Exercises</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={addExercise}>
                                <Plus size={14} /> Add
                            </Button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {form.exercises.map((ex, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <Input placeholder="Name" value={ex.name}
                                        onChange={(e) => updateExercise(i, "name", e.target.value)}
                                        className="flex-1" />
                                    <Input placeholder="Sets" type="number" value={ex.sets}
                                        onChange={(e) => updateExercise(i, "sets", e.target.value)}
                                        className="w-16" />
                                    <Input placeholder="Reps" type="number" value={ex.reps}
                                        onChange={(e) => updateExercise(i, "reps", e.target.value)}
                                        className="w-16" />
                                    <Input placeholder="kg" type="number" value={ex.weight}
                                        onChange={(e) => updateExercise(i, "weight", e.target.value)}
                                        className="w-16" />
                                    {form.exercises.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-400 shrink-0"
                                            onClick={() => removeExercise(i)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <textarea value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            rows="2" placeholder="Any notes..." />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1"
                            onClick={() => { setShowModal(false); resetForm(); }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="gradient" className="flex-1">
                            {editingId ? "Update" : "Save"} Workout
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Workouts;
