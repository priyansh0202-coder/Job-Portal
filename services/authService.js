import apiInstance from "./apiInstance";


/**
 * Helper: store token & user in localStorage and set apiInstance default header
 */

function notifyAuthChanged() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("authChanged"));
    }
}

export function setToken(token) {
    if (typeof window === "undefined") return;
    if (token) {
        localStorage.setItem("token", token);
        apiInstance.defaults.headers.common = apiInstance.defaults.headers.common || {};
        apiInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
}

export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

export function removeToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (apiInstance.defaults.headers.common) {
        delete apiInstance.defaults.headers.common.Authorization;
    }
}

/**
 * Auth apiInstance calls - each returns response.data, or throws axios error to be handled by caller.
 *
 * registerPayload = { name, email, password }  // for user
 * or { name, email, password, role: "admin", adminCode: "..." } // for admin
 */
export async function register(registerPayload) {
    const res = await apiInstance.post("/api/auth/register", registerPayload);
    // Backend returns { user, token }
    if (res?.data?.token) {
        setToken(res.data.token);
        if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        notifyAuthChanged();
    }
    return res.data;
}

export async function login(loginPayload) {
    const res = await apiInstance.post("/api/auth/login", loginPayload);
    if (res?.data?.token) {
        setToken(res.data.token);
        if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        notifyAuthChanged();
    }
    return res.data;
}

export async function getMe() {
    // GET /api/auth/me (protected)
    const res = await apiInstance.get("/api/auth/me");
    if (res?.data?.user && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        notifyAuthChanged();
    }
    return res.data;
}

export function logout() {
    removeToken();
    // Optionally notify backend if you implement token blacklist or logout endpoint
    // return apiInstance.post("/apiInstance/auth/logout");
}

/**
 * Convenience:
 */
export function isAuthenticated() {
    return Boolean(getToken());
}

export function getStoredUser() {
    if (typeof window === "undefined") return null;
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
}


