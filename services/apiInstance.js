// services/api.js
import axios from "axios";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // ⭐ required for cookies
});

// Global response error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error?.response?.status === 401 &&
            typeof window !== "undefined"
        ) {
            // Clear only frontend state
            localStorage.removeItem("user");

            // Optional redirect
            // window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
