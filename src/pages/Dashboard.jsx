import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Dashboard = () => {
    const { user } = useAuth();

    const [stats, setStats] = useState({
        bloodRequests: 0,
        myDonations: 0,
        availableDonors: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    requestsResponse,
                    donationsResponse,
                    donorsResponse,
                ] = await Promise.all([
                    api.get("/blood-requests/"),
                    api.get("/donations/me"),
                    api.get("/users/available-donors"),
                ]);

                const requests = requestsResponse.data || [];
                const donations = donationsResponse.data || [];
                const donors = donorsResponse.data || [];

                setStats({
                    bloodRequests: requests.length,
                    myDonations: donations.length,
                    availableDonors: donors.length,
                });
            } catch (error) {
                console.error("Dashboard data error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Welcome to BloodBridge ❤️
                        </h1>

                        <p className="mt-2 text-gray-500 text-sm sm:text-base">
                            Hello, {user?.first_name} {user?.last_name}
                        </p>
                    </div>

                    {/* User Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-5 sm:mt-6">

                        {/* Username */}
                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                            <p className="text-gray-500 text-sm">
                                Username
                            </p>

                          <h2 className="text-lg sm:text-xl font-semibold mt-2">
                                {user?.username}
                            </h2>
                        </div>

                        {/* Blood Group */}
                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                            <p className="text-gray-500 text-sm">
                                Blood Group
                            </p>

                            <h2 className="text-lg sm:text-xl font-semibold text-red-600 mt-2">
                                {user?.blood_group || "Not set"}
                            </h2>
                        </div>

                        {/* Availability */}
                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                            <p className="text-gray-500 text-sm">
                                Availability
                            </p>

                            <h2 className="text-lg sm:text-xl font-semibold mt-2">
                                {user?.is_available
                                    ? "Available"
                                    : "Not Available"}
                            </h2>
                        </div>

                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-5 sm:mt-6">

                        {/* Blood Requests */}
                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">

                            <div className="flex items-center justify-between gap-4">

                                <div className="min-w-0">
                                    <p className="text-gray-500 text-sm">
                                        Blood Requests
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                                        {loading
                                            ? "..."
                                            : stats.bloodRequests}
                                    </h2>
                                </div>

                                <div className="text-3xl sm:text-4xl shrink-0">
                                    🩸
                                </div>

                            </div>

                            <Link
                                to="/blood-requests"
                                className="block mt-5 text-red-600 font-semibold hover:text-red-700"
                            >
                                View Requests →
                            </Link>

                        </div>

                        {/* My Donations */}
                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">

                            <div className="flex items-center justify-between gap-4">

                                <div className="min-w-0">
                                    <p className="text-gray-500 text-sm">
                                        My Donations
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                                        {loading
                                            ? "..."
                                            : stats.myDonations}
                                    </h2>
                                </div>

                                <div className="text-3xl sm:text-4xl shrink-0">
                                    ❤️
                                </div>

                            </div>

                            <Link
                                to="/donations"
                                className="block mt-5 text-red-600 font-semibold hover:text-red-700"
                            >
                                View Donations →
                            </Link>

                        </div>

                        {/* Available Donors */}
                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">

                            <div className="flex items-center justify-between gap-4">

                                <div className="min-w-0">
                                    <p className="text-gray-500 text-sm">
                                        Available Donors
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                                        {loading
                                            ? "..."
                                            : stats.availableDonors}
                                    </h2>
                                </div>

                                <div className="text-3xl sm:text-4xl shrink-0">
                                    👥
                                </div>

                            </div>

                            <Link
                                to="/blood-donors"
                                className="block mt-5 text-red-600 font-semibold hover:text-red-700"
                            >
                                Find Donors →
                            </Link>

                        </div>

                    </div>

                    {/* Quick Actions */}
                    <div className="mt-7 sm:mt-8">

                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Quick Actions
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4">

                            {/* Blood Requests */}
                            <Link
                                to="/blood-requests"
                                className="bg-red-600 text-white rounded-2xl p-5 sm:p-6 shadow-sm hover:bg-red-700 transition"
                            >
                                <h3 className="text-lg sm:text-xl font-bold">
                                    Blood Requests 🩸
                                </h3>

                                <p className="mt-2 text-red-100 text-sm sm:text-base">
                                    Find people who need blood.
                                </p>
                            </Link>

                            {/* Donations */}
                            <Link
                                to="/donations"
                                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition"
                            >
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                    Donate Blood ❤️
                                </h3>

                                <p className="mt-2 text-gray-500 text-sm sm:text-base">
                                    Help someone in an emergency.
                                </p>
                            </Link>

                            {/* Profile */}
                            <Link
                                to="/profile"
                                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition"
                            >
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                    My Profile 👤
                                </h3>

                                <p className="mt-2 text-gray-500 text-sm sm:text-base">
                                    View and update your information.
                                </p>
                            </Link>

                        </div>

                    </div>

                </div>
            </div>
        </>
    );
};

export default Dashboard;