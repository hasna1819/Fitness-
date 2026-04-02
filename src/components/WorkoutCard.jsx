import React from "react";
function WorkoutCard({ workout}) {
    return (
        <div className="bg-white shadow-md p-4 rounded-xl mb-3">
            <h2 className="font-bold text-lg">{workout.workoutName}</h2>
            <p>Duration:{workout.duration}min</p>
            <p>Burned: {workout.caloriesBurned}cal</p>
        </div>
    );
}

export default WorkoutCard;