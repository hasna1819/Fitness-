import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Target, Calendar, Shield, Save, Camera } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        name: "", email: "", gender: "", goal: "",
        weight: "", height: "", age: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/auth/me");
                const p = res.data;
                setForm({
                    name: p.name || "", email: p.email || "", gender: p.gender || "",
                    goal: p.goal || "", weight: p.weight || "", height: p.height || "", age: p.age || "",
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await API.put("/auth/profile", form);
            updateUser(res.data);
            toast.success("Profile updated!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally { setSaving(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    const roleVariant = { admin: "destructive", trainer: "warning", user: "default" };
    const selectClasses = "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer";

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    My <span className="gradient-text">Profile</span>
                </h1>
                <p className="text-muted-foreground mt-1">Manage your account and personal information</p>
            </div>

            {/* Profile Card */}
            <Card className="animate-fade-in-up">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-lg">{form.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">{form.name}</h2>
                            <p className="text-sm text-muted-foreground">{form.email}</p>
                            <Badge variant={roleVariant[user?.role] || "default"} className="mt-1">
                                <Shield size={10} /> {user?.role}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Form */}
            <Card className="animate-fade-in-up stagger-2">
                <CardHeader>
                    <CardTitle className="text-base">Personal Information</CardTitle>
                    <CardDescription>Update your profile details below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="name" value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="pl-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="email" value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="pl-10" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <select id="gender" value={form.gender}
                                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                    className={selectClasses}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="goal">Fitness Goal</Label>
                                <select id="goal" value={form.goal}
                                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                                    className={selectClasses}>
                                    <option value="">Select</option>
                                    <option value="Lose Weight">Lose Weight</option>
                                    <option value="Gain Muscle">Gain Muscle</option>
                                    <option value="Maintain Fitness">Maintain Fitness</option>
                                    <option value="Build Strength">Build Strength</option>
                                    <option value="Improve Endurance">Improve Endurance</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input id="weight" type="number" value={form.weight}
                                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                                    placeholder="70" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="height">Height (cm)</Label>
                                <Input id="height" type="number" value={form.height}
                                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                                    placeholder="175" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" type="number" value={form.age}
                                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                                    placeholder="25" />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" variant="gradient" disabled={saving}>
                                {saving ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <><Save size={16} /> Save Changes</>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
