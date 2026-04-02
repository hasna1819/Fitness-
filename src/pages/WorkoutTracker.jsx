import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api";
import WorkoutCard from "../components/WorkoutCard";

function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const res = await API.get("/workouts/userId_here");
      setWorkouts(res.data);
    };

    fetchWorkouts();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Workout Tracker 💪</h1>

        {workouts.map((workout) => (
          <WorkoutCard key={workout._id} workout={workout} />
        ))}
      </div>
    </div>
  );
}

export default WorkoutTracker;