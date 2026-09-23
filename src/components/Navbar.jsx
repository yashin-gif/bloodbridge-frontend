import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

                {/* Top Navbar */}
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/dashboard"
                        onClick={closeMenu}
                        className="text-xl sm:text-2xl font-bold text-red-600"
                    >
                        BloodBridge ❤️
                    </Link>

                    {/* Desktop / Tablet Navigation */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-6">

                        <Link
                            to="/dashboard"
                            className="text-gray-700 hover:text-red-600 transition"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/blood-requests"
                            className="text-gray-700 hover:text-red-600 transition"
                        >
                            Blood Requests
                        </Link>

                        <Link
                            to="/donations"
                            className="text-gray-700 hover:text-red-600 transition"
                        >
                            Donations
                        </Link>

                        <Link
                            to="/profile"
                            className="text-gray-700 hover:text-red-600 transition"
                        >
                            Profile
                        </Link>

                        {/* Admin */}
                        {user?.role === "admin" && (
                            <Link
                                to="/admin"
                                className="text-red-600 font-semibold hover:text-red-700 transition"
                            >
                                🛡️ Admin
                            </Link>
                        )}

                        {/* User */}
                        <span className="text-sm text-gray-500 max-w-24 lg:max-w-none truncate">
                            {user?.username}
                        </span>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Logout
                        </button>

                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-gray-700 text-2xl px-2 py-1"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>

                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t">

                        <div className="flex flex-col gap-2">

                            <Link
                                to="/dashboard"
                                onClick={closeMenu}
                                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/blood-requests"
                                onClick={closeMenu}
                                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                            >
                                Blood Requests
                            </Link>

                            <Link
                                to="/donations"
                                onClick={closeMenu}
                                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                            >
                                Donations
                            </Link>

                            <Link
                                to="/profile"
                                onClick={closeMenu}
                                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                            >
                                Profile
                            </Link>

                            {/* Admin */}
                            {user?.role === "admin" && (
                                <Link
                                    to="/admin"
                                    onClick={closeMenu}
                                    className="text-red-600 font-semibold hover:bg-red-50 px-3 py-2 rounded-lg transition"
                                >
                                    🛡️ Admin
                                </Link>
                            )}

                            {/* User */}
                            <div className="px-3 py-2 text-sm text-gray-500 border-t mt-2 pt-3">
                                Logged in as:{" "}
                                <span className="font-semibold text-gray-700">
                                    {user?.username}
                                </span>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mt-1"
                            >
                                Logout
                            </button>

                        </div>

                    </div>
                )}

            </div>
        </nav>
    );
};

export default Navbar;