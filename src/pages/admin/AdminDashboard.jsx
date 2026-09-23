import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        bloodRequests: 0,
        donations: 0,
        availableDonors: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [usersResponse, requestsResponse, donationsResponse] =
                await Promise.all([
                    api.get("/admin/users"),
                    api.get("/blood-requests/"),
                    api.get("/donations/"),
                ]);

            const users = usersResponse.data || [];
            const bloodRequests = requestsResponse.data || [];
            const donations = donationsResponse.data || [];

            const availableDonors = users.filter(
                (user) =>
                    user.role === "user" &&
                    user.is_available === true
            );

            setStats({
                users: users.length,
                bloodRequests: bloodRequests.length,
                donations: donations.length,
                availableDonors: availableDonors.length,
            });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                            Admin Dashboard 🛡️
                        </h1>

                        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-500">
                            Manage BloodBridge users, requests and donations.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 sm:mt-6 bg-red-50 border border-red-200 text-red-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-4 sm:mt-6">

                        {/* Total Users */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Total Users
                                    </p>

                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1.5 sm:mt-2">
                                        {loading ? "..." : stats.users}
                                    </h2>
                                </div>

                                <div className="text-3xl sm:text-4xl">
                                    👥
                                </div>
                            </div>

                            <Link
                                to="/admin/users"
                                className="block mt-4 sm:mt-5 text-sm sm:text-base text-red-600 font-semibold hover:text-red-700"
                            >
                                Manage Users →
                            </Link>
                        </div>

                        {/* Blood Requests */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Blood Requests
                                    </p>

                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1.5 sm:mt-2">
                                        {loading ? "..." : stats.bloodRequests}
                                    </h2>
                                </div>

                                <div className="text-3xl sm:text-4xl">
                                    🩸
                                </div>
                            </div>

                            <Link
                                to="/admin/blood-requests"
                                className="block mt-4 sm:mt-5 text-sm sm:text-base text-red-600 font-semibold hover:text-red-700"
                            >
                                Manage Requests →
                            </Link>
                        </div>

                        {/* Donations */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Total Donations
                                    </p>

                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1.5 sm:mt-2">
                                        {loading ? "..." : stats.donations}
                                    </h2>
                                </div>

                                <div className="text-3xl sm:text-4xl">
                                    ❤️
                                </div>
                            </div>

                            <Link
                                to="/admin/donations"
                                className="block mt-4 sm:mt-5 text-sm sm:text-base text-red-600 font-semibold hover:text-red-700"
                            >
                                Manage Donations →
                            </Link>
                        </div>

                        {/* Available Donors */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Available Donors
                                    </p>

                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1.5 sm:mt-2">
                                        {loading ? "..." : stats.availableDonors}
                                    </h2>
                                </div>

                                <div className="text-3xl sm:text-4xl">
                                    🩸
                                </div>
                            </div>

                            <Link
                                to="/admin/users"
                                className="block mt-4 sm:mt-5 text-sm sm:text-base text-red-600 font-semibold hover:text-red-700"
                            >
                                View Donors →
                            </Link>
                        </div>

                    </div>

                    {/* Management Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-4 sm:mt-6">

                        <Link
                            to="/admin/users"
                            className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition"
                        >
                            <div className="text-3xl sm:text-4xl">
                                👥
                            </div>

                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-3 sm:mt-4">
                                Manage Users
                            </h2>

                            <p className="text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">
                                View and manage registered users.
                            </p>

                            <div className="mt-4 sm:mt-5 text-sm sm:text-base text-red-600 font-semibold">
                                View Users →
                            </div>
                        </Link>

                        <Link
                            to="/admin/blood-requests"
                            className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition"
                        >
                            <div className="text-3xl sm:text-4xl">
                                🩸
                            </div>

                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-3 sm:mt-4">
                                Blood Requests
                            </h2>

                            <p className="text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">
                                Review and manage blood requests.
                            </p>

                            <div className="mt-4 sm:mt-5 text-sm sm:text-base text-red-600 font-semibold">
                                Manage Requests →
                            </div>
                        </Link>

                        <Link
                            to="/admin/donations"
                            className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition"
                        >
                            <div className="text-3xl sm:text-4xl">
                                ❤️
                            </div>

                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-3 sm:mt-4">
                                Donations
                            </h2>

                            <p className="text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">
                                View and manage blood donations.
                            </p>

                            <div className="mt-4 sm:mt-5 text-sm sm:text-base text-red-600 font-semibold">
                                Manage Donations →
                            </div>
                        </Link>

                    </div>

                    {/* Admin Panel */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mt-4 sm:mt-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                            Admin Panel
                        </h2>

                        <p className="text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">
                            Use the options above to manage the BloodBridge
                            platform.
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default AdminDashboard;