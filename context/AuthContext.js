"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getStoredUser, logout as authLogout, isAuthenticated } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getStoredUser());
        const onAuthChanged = () => setUser(getStoredUser());
        window.addEventListener("authChanged", onAuthChanged);
        return () => window.removeEventListener("authChanged", onAuthChanged);
    }, []);

    const logout = () => {
        authLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, isAuthenticated: isAuthenticated() }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
