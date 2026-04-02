import React, { useEffect, useState } from "react";
import API from "../api";
import Modal from "../components/Modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { UtensilsCrossed, Plus, Trash2, Clock, Flame, Apple, Beef, Droplets } from "lucide-react";
import toast from "react-hot-toast";

const DietTracker = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "Breakfast", calories: "",
    protein: "", carbs: "", fats: "", notes: "",
  });

  useEffect(() => { fetchMeals(); }, []);

  const fetchMeals = async () => {
    try {
      const res = await API.get("/meals");
      setMeals(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/meals", form);
      toast.success("Meal logged!");
      setShowModal(false);
      setForm({ name: "", type: "Breakfast", calories: "", protein: "", carbs: "", fats: "", notes: "" });
      fetchMeals();
    } catch (err) { toast.error("Failed to log meal"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this meal?")) return;
    try {
      await API.delete(`/meals/${id}`);
      fetchMeals();
      toast.success("Deleted");
    } catch (err) { toast.error("Delete failed"); }
  };

  const todayMeals = meals.filter(m => new Date(m.date).toDateString() === new Date().toDateString());
  const dailyTotals = todayMeals.reduce((acc, m) => ({
    calories: acc.calories + (m.calories || 0),
    protein: acc.protein + (m.protein || 0),
    carbs: acc.carbs + (m.carbs || 0),
    fats: acc.fats + (m.fats || 0),
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const goals = { calories: 2200, protein: 150, carbs: 250, fats: 70 };
  const selectClasses = "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer";

  const mealTypeIcons = {
    Breakfast: "🌅", Lunch: "☀️", Dinner: "🌙", Snack: "🍎", "Pre-Workout": "⚡", "Post-Workout": "💪",
  };

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
            Diet <span className="gradient-text">Tracker</span>
          </h1>
          <p className="text-muted-foreground mt-1">Track your daily nutrition</p>
        </div>
        <Button variant="gradient" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Log Meal
        </Button>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Calories", value: dailyTotals.calories, goal: goals.calories, unit: "kcal", icon: Flame, color: "text-amber-400" },
          { label: "Protein", value: dailyTotals.protein, goal: goals.protein, unit: "g", icon: Beef, color: "text-red-400" },
          { label: "Carbs", value: dailyTotals.carbs, goal: goals.carbs, unit: "g", icon: Apple, color: "text-emerald-400" },
          { label: "Fats", value: dailyTotals.fats, goal: goals.fats, unit: "g", icon: Droplets, color: "text-sky-400" },
        ].map((macro, i) => (
          <Card key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className={`${macro.color}`}><macro.icon size={20} /></p>
                <span className="text-xs text-muted-foreground">{macro.goal} {macro.unit}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{macro.value}<span className="text-sm text-muted-foreground ml-1">{macro.unit}</span></p>
              <p className="text-sm text-muted-foreground mb-2">{macro.label}</p>
              <Progress value={Math.min(100, (macro.value / macro.goal) * 100)} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Meals */}
      <Card className="animate-fade-in-up stagger-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-primary" /> Today's Meals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayMeals.length > 0 ? (
            <div className="space-y-3">
              {todayMeals.map((meal, i) => (
                <div key={meal._id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="text-2xl">{mealTypeIcons[meal.mealType] || "🍽️"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{meal.foodName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <Badge variant="secondary">{meal.type}</Badge>
                      <span className="text-xs text-muted-foreground">{meal.calories} cal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>P:{meal.protein || 0}g</span>
                    <span>C:{meal.carbs || 0}g</span>
                    <span>F:{meal.fats || 0}g</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(meal._id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UtensilsCrossed size={40} className="mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">No meals logged today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Meal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 col-span-2">
              <Label>Meal Name</Label>
              <Input value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Grilled Chicken Salad" required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={selectClasses}>
                {["Breakfast", "Lunch", "Dinner", "Snack", "Pre-Workout", "Post-Workout"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Calories</Label>
              <Input type="number" value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })}
                placeholder="450" required />
            </div>
            <div className="space-y-2">
              <Label>Protein (g)</Label>
              <Input type="number" value={form.protein}
                onChange={(e) => setForm({ ...form, protein: e.target.value })}
                placeholder="30" />
            </div>
            <div className="space-y-2">
              <Label>Carbs (g)</Label>
              <Input type="number" value={form.carbs}
                onChange={(e) => setForm({ ...form, carbs: e.target.value })}
                placeholder="50" />
            </div>
            <div className="space-y-2">
              <Label>Fats (g)</Label>
              <Input type="number" value={form.fats}
                onChange={(e) => setForm({ ...form, fats: e.target.value })}
                placeholder="15" />
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
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="gradient" className="flex-1">Save Meal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DietTracker;