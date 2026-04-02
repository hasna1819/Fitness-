import React from "react";

function MealCard({ meal }) {
    return (
        <div className="bg-white shadow-md p-4 rounded-xl mb-3">
            <h2 className="font-bold text-lg">:{meal.foodName}</h2>
            <p>Type:{meal.mealType}</p>
            <p>Calories:{meal.calories}</p>
        </div>
    );
}


export default MealCard;