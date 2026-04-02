import React, { useEffect, useState } from "react";
import API from "../api";
import Modal from "../components/Modal";
import { Plus, Edit, Trash2, Wrench, AlertTriangle } from "lucide-react";

const AdminEquipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ name: "", category: "Cardio", quantity: 1, status: "Working", purchaseDate: "", lastMaintenanceDate: "", nextMaintenanceDate: "", notes: "" });

    useEffect(() => { fetchEquipment(); }, []);
    const fetchEquipment = async () => { try { const res = await API.get("/admin/equipment"); setEquipment(res.data); } catch (e) { } finally { setLoading(false); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editItem) await API.put(`/admin/equipment/${editItem._id}`, form);
            else await API.post("/admin/equipment", form);
            setShowModal(false); setEditItem(null); fetchEquipment();
        } catch (e) { }
    };

    const handleEdit = (item) => { setEditItem(item); setForm({ name: item.name, category: item.category, quantity: item.quantity, status: item.status, purchaseDate: item.purchaseDate?.split("T")[0] || "", lastMaintenanceDate: item.lastMaintenanceDate?.split("T")[0] || "", nextMaintenanceDate: item.nextMaintenanceDate?.split("T")[0] || "", notes: item.notes || "" }); setShowModal(true); };
    const handleDelete = async (id) => { if (!window.confirm("Delete?")) return; try { await API.delete(`/admin/equipment/${id}`); fetchEquipment(); } catch (e) { } };

    const statusColors = { Working: "badge-success", "Needs Repair": "badge-danger", "Under Maintenance": "badge-warning", "Out of Service": "badge-info" };

    if (loading) return <div className="flex items-center justify-center h-96"><div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-text-primary">Manage <span className="gradient-text">Equipment</span></h1>
                <button onClick={() => { setEditItem(null); setForm({ name: "", category: "Cardio", quantity: 1, status: "Working", purchaseDate: "", lastMaintenanceDate: "", nextMaintenanceDate: "", notes: "" }); setShowModal(true); }} className="btn-gradient flex items-center gap-2"><Plus size={18} />Add Equipment</button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-dark">
                        <thead><tr><th>Name</th><th>Category</th><th>Qty</th><th>Status</th><th>Last Maintenance</th><th>Next Due</th><th>Actions</th></tr></thead>
                        <tbody>
                            {equipment.map(item => (
                                <tr key={item._id}>
                                    <td className="font-medium">{item.name}</td>
                                    <td>{item.category}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td><span className={`badge ${statusColors[item.status] || "badge-primary"}`}>{item.status}</span></td>
                                    <td className="text-text-muted">{item.lastMaintenanceDate ? new Date(item.lastMaintenanceDate).toLocaleDateString() : "—"}</td>
                                    <td className="text-text-muted">{item.nextMaintenanceDate ? new Date(item.nextMaintenanceDate).toLocaleDateString() : "—"}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"><Edit size={14} /></button>
                                            <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? "Edit Equipment" : "Add Equipment"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div><label className="block text-sm font-medium text-text-secondary mb-1">Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-dark" required /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-dark"><option>Cardio</option><option>Strength</option><option>Free Weights</option><option>Machines</option><option>Accessories</option><option>Other</option></select></div>
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Quantity</label><input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })} className="input-dark" min="1" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-text-secondary mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-dark"><option>Working</option><option>Needs Repair</option><option>Under Maintenance</option><option>Out of Service</option></select></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Last Maintenance</label><input type="date" value={form.lastMaintenanceDate} onChange={e => setForm({ ...form, lastMaintenanceDate: e.target.value })} className="input-dark" /></div>
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Next Due</label><input type="date" value={form.nextMaintenanceDate} onChange={e => setForm({ ...form, nextMaintenanceDate: e.target.value })} className="input-dark" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-text-secondary mb-1">Notes</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-dark" rows="2" /></div>
                    <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-dark-border text-text-secondary hover:bg-dark-hover font-medium">Cancel</button><button type="submit" className="btn-gradient flex-1 py-3">{editItem ? "Update" : "Add"}</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminEquipment;
