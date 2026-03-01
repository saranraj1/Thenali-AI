"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/authService";

type User = {
    name: string;
    email: string;
    user_id?: string;
    rank?: string;
};

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("ai_bharat_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, pass: string) => {
        const data = await authService.login(email, pass);
        // Normalise backend response → local User shape
        const loggedUser: User = {
            name: data.username ?? data.name ?? email,
            email: data.email ?? email,
            user_id: data.user_id,
            rank: data.rank,
        };
        setUser(loggedUser);
        localStorage.setItem("ai_bharat_user", JSON.stringify(loggedUser));
        return loggedUser;
    };

    const signup = async (name: string, email: string, pass: string) => {
        const data = await authService.signup(name, email, pass);
        const newUser: User = {
            name: data.username ?? data.name ?? name,
            email: data.email ?? email,
            user_id: data.user_id,
            rank: data.rank,
        };
        setUser(newUser);
        localStorage.setItem("ai_bharat_user", JSON.stringify(newUser));
        return newUser;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        localStorage.removeItem("ai_bharat_user");
        // token is cleared inside authService.logout()
    };

    return {
        user,
        login,
        signup,
        logout,
    };
}