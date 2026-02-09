// // services/api.js
// import axios from "axios";


// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// const api = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // Request interceptor - attach token from localStorage if available
// api.interceptors.request.use(
//     (config) => {
//         try {
//             if (typeof window !== "undefined") {
//                 const token = localStorage.getItem("token");
//                 if (token) {
//                     config.headers = config.headers || {};
//                     config.headers.Authorization = `Bearer ${token}`;
//                 }
//             }
//         } catch (err) {
//             // ignore (should not throw)
//             // console.warn("Failed to attach token:", err);
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Response interceptor - optional: handle 401 globally (auto logout)
// api.interceptors.response.use(
//     (response) => response,

//     (error) => {
//         // If 401 from API, remove token (user must re-login)
//         if (
//             error?.response?.status === 401 &&
//             typeof window !== "undefined"
//         ) {
//             try {
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("user");
//                 // Optionally: redirect to login here if you have access to router
//                 // window.location.href = "/login";
//             } catch (e) {
//                 // ignore
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;





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
