import React, { useEffect, useState } from "react";
import API from "../api";
import Modal from "../components/Modal";
import { Plus, Edit, Trash2, UserPlus, ClipboardList } from "lucide-react";

const TrainerPlans = () => {
    const [plans, setPlans] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [assignModal, setAssignModal] = useState(null);
    const [form, setForm] = useState({
        title: "", description: "", difficulty: "Intermediate", goal: "Gain Muscle", durationWeeks: 4,
        days: [{ day: "Monday", focus: "", exercises: [{ name: "", sets: 3, reps: 10, weight: 0, order: 1 }], isRestDay: false }]
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [pRes, uRes] = await Promise.all([API.get("/workout-plans/trainer"), API.get("/trainer/users")]);
            setPlans(pRes.data); setUsers(uRes.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPlan) await API.put(`/workout-plans/${editingPlan._id}`, form);
            else await API.post("/workout-plans", form);
            setShowModal(false); setEditingPlan(null); fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this plan?")) return;
        try { await API.delete(`/workout-plans/${id}`); fetchData(); } catch (err) { console.error(err); }
    };

    const handleAssign = async (planId, userId) => {
        try { await API.put(`/workout-plans/${planId}/assign`, { userId }); setAssignModal(null); fetchData(); }
        catch (err) { console.error(err); }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setForm({ title: plan.title, description: plan.description, difficulty: plan.difficulty, goal: plan.goal, durationWeeks: plan.durationWeeks, days: plan.days || [] });
        setShowModal(true);
    };

    const addDay = () => {
        const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const usedDays = form.days.map(d => d.day);
        const next = allDays.find(d => !usedDays.includes(d));
        if (!next) return;
        setForm({ ...form, days: [...form.days, { day: next, focus: "", exercises: [{ name: "", sets: 3, reps: 10, weight: 0, order: 1 }], isRestDay: false }] });
    };

    const updateDay = (idx, field, val) => { const d = [...form.days]; d[idx][field] = val; setForm({ ...form, days: d }); };
    const removeDay = (idx) => { setForm({ ...form, days: form.days.filter((_, i) => i !== idx) }); };

    const addExToDay = (dayIdx) => {
        const d = [...form.days];
        d[dayIdx].exercises = [...d[dayIdx].exercises, { name: "", sets: 3, reps: 10, weight: 0, order: d[dayIdx].exercises.length + 1 }];
        setForm({ ...form, days: d });
    };

    const updateEx = (dayIdx, exIdx, field, val) => {
        const d = [...form.days]; d[dayIdx].exercises[exIdx][field] = val; setForm({ ...form, days: d });
    };

    if (loading) return <div className="flex items-center justify-center h-96"><div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Workout <span className="gradient-text">Plans</span></h1><p className="text-text-muted mt-1">Create and assign workout plans</p></div>
                <button onClick={() => { setEditingPlan(null); setForm({ title: "", description: "", difficulty: "Intermediate", goal: "Gain Muscle", durationWeeks: 4, days: [] }); setShowModal(true); }} className="btn-gradient flex items-center gap-2"><Plus size={18} /> Create Plan</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {plans.map((plan, i) => (
                    <div key={plan._id} className="glass-card p-5 animate-fadeIn" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="flex items-start justify-between mb-3">
                            <div><h3 className="font-bold text-text-primary text-lg">{plan.title}</h3><p className="text-sm text-text-muted">{plan.description}</p></div>
                            <div className="flex gap-1">
                                <span className="badge badge-primary">{plan.difficulty}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-text-muted mb-3">
                            <span>🎯 {plan.goal}</span><span>📅 {plan.durationWeeks} weeks</span>
                            <span>📋 {plan.days?.length || 0} days</span>
                        </div>
                        {plan.assignedTo && <p className="text-sm text-accent mb-3">→ Assigned to: {plan.assignedTo.name}</p>}
                        <div className="flex items-center gap-2">
                            <button onClick={() => setAssignModal(plan._id)} className="flex-1 py-2 rounded-lg bg-accent/15 text-accent text-sm font-medium hover:bg-accent/25 transition-colors flex items-center justify-center gap-1"><UserPlus size={14} />Assign</button>
                            <button onClick={() => handleEdit(plan)} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(plan._id)} className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
                {plans.length === 0 && <div className="col-span-full glass-card p-12 text-center"><ClipboardList size={48} className="mx-auto mb-4 text-text-muted opacity-30" /><p className="text-text-muted">No plans created yet</p></div>}
            </div>

            {/* Assign Modal */}
            <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title="Assign to Client">
                <div className="space-y-2">
                    {users.map(u => (
                        <button key={u._id} onClick={() => handleAssign(assignModal, u._id)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-dark/50 hover:bg-dark-hover transition-colors text-left">
                            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">{u.name?.charAt(0)}</div>
                            <div><p className="font-medium text-text-primary">{u.name}</p><p className="text-xs text-text-muted">{u.email}</p></div>
                        </button>
                    ))}
                    {users.length === 0 && <p className="text-text-muted text-center py-4">No clients to assign</p>}
                </div>
            </Modal>

            {/* Create/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingPlan ? "Edit Plan" : "Create Plan"} maxWidth="max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Title</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-dark" required /></div>
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Difficulty</label><select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="input-dark"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                        <div className="col-span-2"><label className="block text-sm font-medium text-text-secondary mb-1">Description</label><input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-dark" /></div>
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Goal</label><select value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} className="input-dark"><option>Lose Weight</option><option>Gain Muscle</option><option>Maintain Fitness</option><option>Build Strength</option></select></div>
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Weeks</label><input type="number" value={form.durationWeeks} onChange={e => setForm({ ...form, durationWeeks: parseInt(e.target.value) })} className="input-dark" /></div>
                    </div>

                    <div className="flex items-center justify-between"><label className="text-sm font-medium text-text-secondary">Days</label><button type="button" onClick={addDay} className="text-primary text-sm font-medium flex items-center gap-1"><Plus size={14} />Add Day</button></div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {form.days.map((day, di) => (
                            <div key={di} className="p-3 rounded-xl bg-dark/50 border border-dark-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <select value={day.day} onChange={e => updateDay(di, "day", e.target.value)} className="input-dark w-36 py-1.5 text-sm">
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => <option key={d}>{d}</option>)}
                                    </select>
                                    <input type="text" value={day.focus} onChange={e => updateDay(di, "focus", e.target.value)} className="input-dark flex-1 py-1.5 text-sm" placeholder="Focus (e.g. Chest)" />
                                    <label className="flex items-center gap-1 text-xs text-text-muted"><input type="checkbox" checked={day.isRestDay} onChange={e => updateDay(di, "isRestDay", e.target.checked)} />Rest</label>
                                    <button type="button" onClick={() => removeDay(di)} className="text-danger p-1"><Trash2 size={14} /></button>
                                </div>
                                {!day.isRestDay && (
                                    <div className="space-y-1">
                                        {day.exercises.map((ex, ei) => (
                                            <div key={ei} className="flex items-center gap-1">
                                                <input type="text" value={ex.name} onChange={e => updateEx(di, ei, "name", e.target.value)} className="input-dark flex-1 py-1 text-xs" placeholder="Exercise" />
                                                <input type="number" value={ex.sets} onChange={e => updateEx(di, ei, "sets", parseInt(e.target.value))} className="input-dark w-12 py-1 text-xs text-center" placeholder="S" />
                                                <input type="number" value={ex.reps} onChange={e => updateEx(di, ei, "reps", parseInt(e.target.value))} className="input-dark w-12 py-1 text-xs text-center" placeholder="R" />
                                                <input type="number" value={ex.weight} onChange={e => updateEx(di, ei, "weight", parseInt(e.target.value))} className="input-dark w-14 py-1 text-xs text-center" placeholder="kg" />
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addExToDay(di)} className="text-primary text-xs">+ exercise</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-dark-border text-text-secondary hover:bg-dark-hover font-medium">Cancel</button>
                        <button type="submit" className="btn-gradient flex-1 py-3">{editingPlan ? "Update" : "Create"} Plan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TrainerPlans;
