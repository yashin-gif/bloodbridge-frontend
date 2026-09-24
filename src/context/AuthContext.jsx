import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check logged-in user
    const getCurrentUser = async () => {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setUser(null);
                return null;
            }

            const response = await api.get("/users/me");

            setUser(response.data);

            return response.data;

        } catch (error) {
            console.error("Get current user error:", error);

            localStorage.removeItem("access_token");
            setUser(null);

            throw error;

        } finally {
            setLoading(false);
        }
    };

    // Run when app starts
    useEffect(() => {
        getCurrentUser().catch(() => {});
    }, []);

    // Login
    const login = async (username, password) => {
        const formData = new URLSearchParams();

        formData.append("username", username);
        formData.append("password", password);

        const response = await api.post("/auth/login", formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const token = response.data.access_token;

        localStorage.setItem("access_token", token);

        await getCurrentUser();

        return response.data;
    };

    // Register
    const register = async (userData) => {
        const response = await api.post("/auth/register", userData);

        return response.data;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                getCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};