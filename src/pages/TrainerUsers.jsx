import React, { useEffect, useState } from "react";
import API from "../api";
import { Users, Eye, TrendingUp, Dumbbell, Search } from "lucide-react";

const TrainerUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userWorkouts, setUserWorkouts] = useState([]);
    const [userProgress, setUserProgress] = useState([]);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await API.get("/trainer/users");
            setUsers(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const viewUser = async (user) => {
        setSelectedUser(user);
        try {
            const [wRes, pRes] = await Promise.all([
                API.get(`/trainer/users/${user._id}/workouts`),
                API.get(`/trainer/users/${user._id}/progress`),
            ]);
            setUserWorkouts(wRes.data);
            setUserProgress(pRes.data);
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="flex items-center justify-center h-96"><div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My <span className="gradient-text">Clients</span></h1>

            {selectedUser ? (
                <div className="space-y-4">
                    <button onClick={() => setSelectedUser(null)} className="text-primary text-sm font-medium hover:text-primary-light">← Back to clients</button>
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">{selectedUser.name?.charAt(0)}</div>
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">{selectedUser.name}</h2>
                                <p className="text-text-muted">{selectedUser.email}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="badge badge-primary">{selectedUser.goal}</span>
                                    <span className="badge badge-success">{selectedUser.membershipStatus}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            <div className="p-3 rounded-xl bg-dark/50 text-center"><p className="text-lg font-bold text-text-primary">{selectedUser.weight || "—"}kg</p><p className="text-xs text-text-muted">Weight</p></div>
                            <div className="p-3 rounded-xl bg-dark/50 text-center"><p className="text-lg font-bold text-text-primary">{selectedUser.height || "—"}cm</p><p className="text-xs text-text-muted">Height</p></div>
                            <div className="p-3 rounded-xl bg-dark/50 text-center"><p className="text-lg font-bold text-text-primary">🔥 {selectedUser.currentStreak || 0}</p><p className="text-xs text-text-muted">Streak</p></div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="font-bold text-text-primary mb-4">Recent Workouts</h3>
                        {userWorkouts.length > 0 ? (
                            <div className="space-y-2">
                                {userWorkouts.slice(0, 10).map((w) => (
                                    <div key={w._id} className="flex items-center justify-between p-3 rounded-xl bg-dark/50">
                                        <div><p className="font-medium text-text-primary">{w.title}</p><p className="text-xs text-text-muted">{new Date(w.date).toLocaleDateString()}</p></div>
                                        <div className="text-right"><span className={`badge ${w.status === "completed" ? "badge-success" : "badge-warning"}`}>{w.status}</span></div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-text-muted">No workouts yet</p>}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((client, i) => (
                        <div key={client._id} className="glass-card p-5 animate-fadeIn cursor-pointer group" style={{ animationDelay: `${i * 80}ms` }} onClick={() => viewUser(client)}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">{client.name?.charAt(0)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-text-primary truncate">{client.name}</p>
                                    <p className="text-xs text-text-muted truncate">{client.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="badge badge-primary">{client.goal}</span>
                                <div className="streak-badge text-xs py-1 px-2">🔥 {client.currentStreak || 0}</div>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye size={14} /> View details
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && <div className="col-span-full glass-card p-12 text-center"><Users size={48} className="mx-auto mb-4 text-text-muted opacity-30" /><p className="text-text-muted">No clients assigned</p></div>}
                </div>
            )}
        </div>
    );
};

export default TrainerUsers;
