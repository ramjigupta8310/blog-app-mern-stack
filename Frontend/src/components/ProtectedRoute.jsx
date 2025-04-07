import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GlobalContext from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const ProtectedRoute = ({ children }) => {
    const { setIsAuthenticated, setUser, isAuthenticated } = useContext(GlobalContext)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Token verify karne ka function
    const verifyToken = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return navigate("/login");
        }

        try {
            const response = await axios.get(`${BASE_URL}/verify-token`, {
                headers: {
                    Authorization: token,
                }
            });
            setIsAuthenticated(true);
            setUser(response?.data?.user);
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            return navigate("/login");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        verifyToken();
    }, []);

    if (!isAuthenticated) return;
    if (loading) return <p>Loading...</p>;

    return children
};

export default ProtectedRoute;