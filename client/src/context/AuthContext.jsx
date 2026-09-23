import React from "react";
import api from "../utils/axios";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            return data;
        } catch (error) {
            const errData = error.response?.data;
            // If account needs OTP verification, propagate that flag
            if (errData?.needsVerification) {
                throw { needsVerification: true, message: errData.message, email: errData.email };
            }
            throw new Error(errData?.message || "Login failed. Please try again.");
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post("/auth/register", { name, email, password });
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || "Registration failed. Please try again.";
            throw new Error(msg);
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post("/auth/verifyotp", { email, otp });
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || "OTP verification failed.";
            throw new Error(msg);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, verifyOTP, register }}>
            {children}
        </AuthContext.Provider>
    );
};