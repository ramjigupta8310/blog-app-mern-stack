import axios from "axios";
import GlobalContext from "./GlobalContext";
import { useState } from "react";

export const GlobalState = ({ children }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // User Register
    const registerUser = async (formData) => {
        try {
            const response = await axios.post(`${BASE_URL}/user-register`, formData);
            return { success: response?.data?.message };
        } catch (error) {
            return { error: error.response?.data?.message };
        }
    };

    // User Login
    const loginUser = async (formData) => {
        try {
            const response = await axios.post(`${BASE_URL}/user-login`, formData);
            localStorage.setItem("token", response.data.token);
            return { success: response?.data?.message };
        } catch (error) {
            return { error: error.response?.data?.message };
        }
    };

    // Varify Email For PassWord Reset
    const varifyEmail = async (email) => {
        try {
            const response = await axios.post(`${BASE_URL}/varify-email`, { email });
            return { success: response?.data?.message };
        } catch (error) {
            return { error: error.response?.data?.message };
        }
    };

    // Reset Password
    const resetPassword = async (email, newPassword, confirmPassword) => {
        try {
            const response = await axios.post(`${BASE_URL}/reset-password`, { email, newPassword, confirmPassword });
            return { success: response?.data?.message };
        } catch (error) {
            return { error: error.response?.data?.message };
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                registerUser,
                loginUser,
                varifyEmail,
                resetPassword,
                isAuthenticated,
                setIsAuthenticated,
                user,
                setUser
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalState;
