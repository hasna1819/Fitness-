import React from "react";
import {Link} from "react-router-dom";


function Navbar() {
    return (
        <nav className="bg-green p-4 text-white flex justify-between">
            <h1 className="text-xl font-bold">fitfuel</h1>
            <div className="space-x-4">
                <Link to="/dashboard">Dashboard</Link>

                {/* <Link to="/diet">Diet</Link>
                <Link to="/workout">Workout</Link>
                <Link to="/">Logout</Link> */}
                
            </div>
        </nav>
    );
}
 export default Navbar;