import React, { useContext, useState } from "react";
import { FaHome, FaPen, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user ,setIsAuthenticated } = useContext(GlobalContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
    };

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-lg">
            <div className="flex justify-between">
                {/* Logo / Brand */}
                <Link to="/" className="text-xl font-bold flex items-center gap-2">
                    BlogApp
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>

                {/* Navigation Links */}
                <div
                    className={`md:flex items-center gap-6 ${isOpen ? "block" : "hidden"
                        } absolute md:static top-14 left-0 w-full md:w-auto bg-gray-800 p-4 md:p-0`}
                >
                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:text-gray-300 transition-colors py-2 md:py-0"
                    >
                        <FaHome /> Home
                    </Link>
                    <Link
                        to="/create-blog"
                        className="flex items-center gap-2 hover:text-gray-300 transition-colors py-2 md:py-0"
                    >
                        <FaPen /> Create Blog
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:text-gray-300 transition-colors py-2 md:py-0"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                    <div className="flex items-center gap-2 py-2 md:py-0">
                        <FaUser /> {user.name.split(" ")[0] || "User"}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;