import React, { useEffect, useState } from "react";
import API from "../api";
import Modal from "../components/Modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Search, Users, Flame } from "lucide-react";
import toast from "react-hot-toast";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", phone: "", goal: "Maintain Fitness" });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try { const res = await API.get("/admin/users?role=user"); setUsers(res.data); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editUser) await API.put(`/admin/users/${editUser._id}`, form);
            else await API.post("/admin/users", form);
            setShowModal(false); setEditUser(null); fetchUsers();
            toast.success(editUser ? "Updated!" : "User created!");
        } catch (err) { toast.error("Failed"); }
    };

    const handleEdit = (u) => {
        setEditUser(u);
        setForm({ name: u.name, email: u.email, password: "", role: u.role, phone: u.phone || "", goal: u.goal || "" });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try { await API.delete(`/admin/users/${id}`); fetchUsers(); toast.success("Deleted"); }
        catch (err) { toast.error("Delete failed"); }
    };

    const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
    const selectClasses = "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer";

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manage <span className="gradient-text">Users</span></h1>
                    <p className="text-muted-foreground mt-1">{users.length} registered members</p>
                </div>
                <Button variant="gradient" onClick={() => { setEditUser(null); setForm({ name: "", email: "", password: "", role: "user", phone: "", goal: "Maintain Fitness" }); setShowModal(true); }}>
                    <Plus size={16} /> Add User
                </Button>
            </div>

            <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="table-dark">
                            <thead>
                                <tr><th>Name</th><th>Email</th><th>Goal</th><th>Membership</th><th>Status</th><th>Streak</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr key={u._id}>
                                        <td className="font-medium">{u.name}</td>
                                        <td className="text-muted-foreground">{u.email}</td>
                                        <td><Badge variant="default">{u.goal || "—"}</Badge></td>
                                        <td>{u.membershipType || "None"}</td>
                                        <td><Badge variant={u.membershipStatus === "active" ? "success" : "warning"}>{u.membershipStatus || "—"}</Badge></td>
                                        <td><span className="flex items-center gap-1 text-amber-400"><Flame size={14} />{u.currentStreak || 0}</span></td>
                                        <td>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(u)}>
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => handleDelete(u._id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-muted-foreground">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editUser ? "Edit User" : "Add User"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                    {!editUser && <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>}
                    <div className="space-y-2"><Label>Phone</Label><Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                    <div className="space-y-2">
                        <Label>Goal</Label>
                        <select value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} className={selectClasses}>
                            <option>Lose Weight</option><option>Gain Muscle</option><option>Maintain Fitness</option><option>Build Strength</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" variant="gradient" className="flex-1">{editUser ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminUsers;
