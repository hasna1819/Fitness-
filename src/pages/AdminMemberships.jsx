import React, { useEffect, useState } from "react";
import API from "../api";
import Modal from "../components/Modal";
import { Plus, Edit, CreditCard, Search, Check, X } from "lucide-react";

const AdminMemberships = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({ membershipType: "Monthly", membershipStatus: "active", membershipStart: "", membershipEnd: "", paymentAmount: 0, paymentStatus: "paid" });

    useEffect(() => { fetchUsers(); }, []);
    const fetchUsers = async () => { try { const res = await API.get("/admin/users?role=user"); setUsers(res.data); } catch (e) { } finally { setLoading(false); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { await API.put(`/admin/users/${editUser._id}/membership`, form); setShowModal(false); fetchUsers(); } catch (e) { }
    };

    const handleEdit = (u) => { setEditUser(u); setForm({ membershipType: u.membershipType || "Monthly", membershipStatus: u.membershipStatus || "active", membershipStart: u.membershipStart?.split("T")[0] || "", membershipEnd: u.membershipEnd?.split("T")[0] || "", paymentAmount: u.paymentAmount || 0, paymentStatus: u.paymentStatus || "paid" }); setShowModal(true); };

    const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <div className="flex items-center justify-center h-96"><div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-fadeIn">
            <h1 className="text-2xl font-bold text-text-primary">Manage <span className="gradient-text">Memberships</span></h1>

            <div className="relative"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input-dark pl-12" placeholder="Search members..." /></div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-dark">
                        <thead><tr><th>Member</th><th>Plan</th><th>Status</th><th>Start</th><th>End</th><th>Payment</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u._id}>
                                    <td><div><p className="font-medium">{u.name}</p><p className="text-xs text-text-muted">{u.email}</p></div></td>
                                    <td><span className="badge badge-primary">{u.membershipType || "None"}</span></td>
                                    <td><span className={`badge ${u.membershipStatus === "active" ? "badge-success" : "badge-warning"}`}>{u.membershipStatus || "—"}</span></td>
                                    <td className="text-text-muted">{u.membershipStart ? new Date(u.membershipStart).toLocaleDateString() : "—"}</td>
                                    <td className="text-text-muted">{u.membershipEnd ? new Date(u.membershipEnd).toLocaleDateString() : "—"}</td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            {u.paymentStatus === "paid" ? <Check size={14} className="text-success" /> : <X size={14} className="text-danger" />}
                                            <span className="text-text-secondary">₹{u.paymentAmount || 0}</span>
                                        </div>
                                    </td>
                                    <td><button onClick={() => handleEdit(u)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"><Edit size={14} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Membership: ${editUser?.name}`}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Plan</label><select value={form.membershipType} onChange={e => setForm({ ...form, membershipType: e.target.value })} className="input-dark"><option>Monthly</option><option>Quarterly</option><option>Half-Yearly</option><option>Annual</option></select></div>
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Status</label><select value={form.membershipStatus} onChange={e => setForm({ ...form, membershipStatus: e.target.value })} className="input-dark"><option value="active">Active</option><option value="inactive">Inactive</option><option value="expired">Expired</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Start Date</label><input type="date" value={form.membershipStart} onChange={e => setForm({ ...form, membershipStart: e.target.value })} className="input-dark" /></div>
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">End Date</label><input type="date" value={form.membershipEnd} onChange={e => setForm({ ...form, membershipEnd: e.target.value })} className="input-dark" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Amount (₹)</label><input type="number" value={form.paymentAmount} onChange={e => setForm({ ...form, paymentAmount: parseInt(e.target.value) })} className="input-dark" /></div>
                        <div><label className="block text-sm font-medium text-text-secondary mb-1">Payment Status</label><select value={form.paymentStatus} onChange={e => setForm({ ...form, paymentStatus: e.target.value })} className="input-dark"><option value="paid">Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option></select></div>
                    </div>
                    <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-dark-border text-text-secondary hover:bg-dark-hover font-medium">Cancel</button><button type="submit" className="btn-gradient flex-1 py-3">Update</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminMemberships;
