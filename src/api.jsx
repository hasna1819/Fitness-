import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:6060/api",
});

// Add token to every request — check both storage keys for resilience
API.interceptors.request.use((config) => {
    // First try the dedicated token key, then fall back to user object
    let token = localStorage.getItem("fitpulse_token");
    if (!token) {
        try {
            const user = JSON.parse(localStorage.getItem("fitpulse_user") || "null");
            token = user?.token;
        } catch (e) {
            // ignore parse errors
        }
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle responses and token errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("fitpulse_user");
            localStorage.removeItem("fitpulse_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default API;