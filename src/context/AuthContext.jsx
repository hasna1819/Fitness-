import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore user on app load
    useEffect(() => {
        const saved = localStorage.getItem("fitpulse_user");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setUser(parsed);
                // Ensure token is also stored separately for the interceptor
                if (parsed?.token) {
                    localStorage.setItem("fitpulse_token", parsed.token);
                }
            } catch (error) {
                console.error("Failed to parse saved user:", error);
                localStorage.removeItem("fitpulse_user");
                localStorage.removeItem("fitpulse_token");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await API.post("/auth/login", { email, password });
            const userData = res.data;
            // Store user data and token separately
            localStorage.setItem("fitpulse_user", JSON.stringify(userData));
            if (userData.token) {
                localStorage.setItem("fitpulse_token", userData.token);
            }
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.message || "Login failed";
        } finally {
            setLoading(false);
        }
    };

    const register = async (data) => {
        setLoading(true);
        try {
            const res = await API.post("/auth/register", data);
            const userData = res.data;
            // Store user data and token separately
            localStorage.setItem("fitpulse_user", JSON.stringify(userData));
            if (userData.token) {
                localStorage.setItem("fitpulse_token", userData.token);
            }
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.message || "Registration failed";
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("fitpulse_user");
        localStorage.removeItem("fitpulse_token");
        setUser(null);
    };

    const updateUser = (data) => {
        const updated = { ...user, ...data };
        localStorage.setItem("fitpulse_user", JSON.stringify(updated));
        setUser(updated);
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, updateUser, loading, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
};
