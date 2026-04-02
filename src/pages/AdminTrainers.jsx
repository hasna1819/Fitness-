import React, { useEffect, useState } from "react";
import API from "../api";
import Modal from "../components/Modal";
import { Plus, Edit, Trash2, UserCog } from "lucide-react";

const AdminTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTrainer, setEditTrainer] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "trainer", phone: "", specialization: "", experience: 0, salary: 0, bio: "" });

    useEffect(() => { fetchTrainers(); }, []);
    const fetchTrainers = async () => { try { const res = await API.get("/admin/users?role=trainer"); setTrainers(res.data); } catch (err) { console.error(err); } finally { setLoading(false); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editTrainer) await API.put(`/admin/users/${editTrainer._id}`, form);
            else await API.post("/admin/users", { ...form, role: "trainer" });
            setShowModal(false); setEditTrainer(null); fetchTrainers();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (t) => { setEditTrainer(t); setForm({ name: t.name, email: t.email, password: "", role: "trainer", phone: t.phone || "", specialization: t.specialization || "", experience: t.experience || 0, salary: t.salary || 0, bio: t.bio || "" }); setShowModal(true); };
    const handleDelete = async (id) => { if (!window.confirm("Delete?")) return; try { await API.delete(`/admin/users/${id}`); fetchTrainers(); } catch (e) { } };

    if (loading) return <div className="flex items-center justify-center h-96"><div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-text-primary">Manage <span className="gradient-text">Trainers</span></h1>
                <button onClick={() => { setEditTrainer(null); setForm({ name: "", email: "", password: "", role: "trainer", phone: "", specialization: "", experience: 0, salary: 0, bio: "" }); setShowModal(true); }} className="btn-gradient flex items-center gap-2"><Plus size={18} />Add Trainer</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainers.map((t, i) => (
                    <div key={t._id} className="glass-card p-5 animate-fadeIn" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">{t.name?.charAt(0)}</div>
                            <div className="flex-1 min-w-0"><p className="font-bold text-text-primary truncate">{t.name}</p><p className="text-xs text-text-muted truncate">{t.email}</p></div>
                        </div>
                        <div className="space-y-1 text-sm mb-3">
                            <p className="text-text-muted">🏋️ {t.specialization || "Not specified"}</p>
                            <p className="text-text-muted">📅 {t.experience || 0} years experience</p>
                            <p className="text-text-muted">💰 ₹{t.salary || 0}/month</p>
                            <p className="text-text-muted">👥 {t.assignedUsers?.length || 0} clients</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(t)} className="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 flex items-center justify-center gap-1"><Edit size={14} />Edit</button>
                            <button onClick={() => handleDelete(t._id)} className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
                {trainers.length === 0 && <div className="col-span-full glass-card p-12 text-center"><UserCog size={48} className="mx-auto mb-4 text-text-muted opacity-30" /><p className="text-text-muted">No trainers found</p></div>}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTrainer ? "Edit Trainer" : "Add Trainer"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-dark" required /></div>
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-dark" required /></div>
                    </div>
                    {!editTrainer && <div><label className="block text-sm font-medium text-text-secondary mb-1">Password</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-dark" required /></div>}
                    <div><label className="block text-sm font-medium text-text-secondary mb-1">Specialization</label><input type="text" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="input-dark" placeholder="e.g. Strength Training" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Experience (years)</label><input type="number" value={form.experience} onChange={e => setForm({ ...form, experience: parseInt(e.target.value) })} className="input-dark" /></div>
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Salary (₹/month)</label><input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: parseInt(e.target.value) })} className="input-dark" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-text-secondary mb-1">Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-dark" rows="2" /></div>
                    <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-dark-border text-text-secondary hover:bg-dark-hover font-medium">Cancel</button><button type="submit" className="btn-gradient flex-1 py-3">{editTrainer ? "Update" : "Create"}</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminTrainers;
