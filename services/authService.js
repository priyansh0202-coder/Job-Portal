
import apiInstance from "./apiInstance";

/**
 * Notify app when auth state changes
 */
function notifyAuthChanged() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("authChanged"));
    }
}

//   Register user/admin
//  Backend sets HttpOnly cookie

export async function register(registerPayload) {
    const res = await apiInstance.post(
        "/api/auth/register",
        registerPayload
    );

    if (res?.data?.user && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        notifyAuthChanged();
    }

    return res.data;
}

/**
 * Login
 * Backend sets HttpOnly cookie
 */
export async function login(loginPayload) {
    const res = await apiInstance.post(
        "/api/auth/login",
        loginPayload
    );

    if (res?.data?.user && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        notifyAuthChanged();
    }

    return res.data;
}

/**
 * Logout
 * Backend clears cookie
 */
export async function logout() {
    try {
        await apiInstance.post("/api/auth/logout");
    } finally {
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            notifyAuthChanged();
        }
    }
}

/**
 * =========================
 * HELPERS
 * =========================
 */

export function getStoredUser() {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

/**
 * Cookie-based auth:
 * We can't read token on frontend
 */
export function isAuthenticated() {
    return Boolean(getStoredUser());
}
