import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    // =========================
    // Fetch Users
    // =========================
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users");

            setUsers(response.data);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Failed to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // =========================
    // Change User Status
    // =========================
    const handleStatusChange = async (user) => {
        // Prevent changing own account status
        if (Number(user.id) === Number(currentUser?.id)) {
            setError("You cannot change your own account status.");
            return;
        }

        try {
            setUpdatingId(user.id);
            setError("");

            await api.put(
                `/admin/users/${user.id}/status`,
                null,
                {
                    params: {
                        is_active: !user.is_active,
                    },
                }
            );

            await fetchUsers();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Failed to change user status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // =========================
    // Change User Role
    // =========================
    const handleRoleChange = async (user) => {
        // Prevent changing own role
        if (Number(user.id) === Number(currentUser?.id)) {
            setError("You cannot change your own role.");
            return;
        }

        try {
            setUpdatingId(user.id);
            setError("");

            const newRole =
                user.role === "admin"
                    ? "user"
                    : "admin";

            await api.put(
                `/admin/users/${user.id}/role`,
                null,
                {
                    params: {
                        role: newRole,
                    },
                }
            );

            await fetchUsers();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Failed to change user role."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                            Manage Users 👥
                        </h1>

                        <p className="text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">
                            View and manage all registered BloodBridge users.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 sm:mt-6 bg-red-50 border border-red-200 text-red-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Loading */}
                    {loading ? (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 mt-4 sm:mt-6 text-center">
                            <p className="text-sm sm:text-base text-gray-500">
                                Loading users...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* User Count */}
                            <div className="mt-4 sm:mt-6 mb-3 sm:mb-4">
                                <p className="text-sm sm:text-base text-gray-600">
                                    <span className="font-semibold">
                                        {users.length}
                                    </span>{" "}
                                    Users Found
                                </p>
                            </div>

                            {/* Empty */}
                            {users.length === 0 ? (
                                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center">
                                    <p className="text-sm sm:text-base text-gray-500">
                                        No users found.
                                    </p>
                                </div>
                            ) : (

                                /* User Cards */
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

                                    {users.map((user) => {
                                        const isCurrentUser =
                                            Number(user.id) === Number(currentUser?.id);

                                        return (
                                            <div
                                                key={user.id}
                                                className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6"
                                            >

                                                {/* Name + Role */}
                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="min-w-0">
                                                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                                            {user.first_name}{" "}
                                                            {user.last_name}
                                                        </h2>

                                                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                                            @{user.username}
                                                        </p>

                                                        {isCurrentUser && (
                                                            <span className="inline-block mt-2 text-xs font-semibold text-red-600">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>

                                                    <span
                                                        className={`shrink-0 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : "bg-blue-100 text-blue-700"
                                                            }`}
                                                    >
                                                        {user.role}
                                                    </span>

                                                </div>

                                                {/* User Information */}
                                                <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">

                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Email
                                                        </p>

                                                        <p className="text-sm sm:text-base text-gray-700 mt-0.5">
                                                            {user.email}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Phone
                                                        </p>

                                                        <p className="text-sm sm:text-base text-gray-700 mt-0.5">
                                                            {user.phone || "Not set"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Blood Group
                                                        </p>

                                                        <p className="text-sm sm:text-base text-gray-700 font-semibold mt-0.5">
                                                            {user.blood_group || "Not set"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Location
                                                        </p>

                                                        <p className="text-sm sm:text-base text-gray-700 mt-0.5">
                                                            {user.location || "Not set"}
                                                        </p>
                                                    </div>

                                                </div>

                                                {/* Status + Availability */}
                                                <div className="border-t mt-4 sm:mt-5 pt-4 sm:pt-5 grid grid-cols-2 gap-3 sm:gap-4">

                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Account Status
                                                        </p>

                                                        <span
                                                            className={`inline-block mt-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${user.is_active
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {user.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Availability
                                                        </p>

                                                        <span
                                                            className={`inline-block mt-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${user.is_available
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-gray-100 text-gray-600"
                                                                }`}
                                                        >
                                                            {user.is_available
                                                                ? "Available"
                                                                : "Unavailable"}
                                                        </span>
                                                    </div>

                                                </div>

                                                {/* Actions */}
                                                <div className="border-t mt-4 sm:mt-5 pt-4 sm:pt-5 space-y-2.5 sm:space-y-3">

                                                    {/* Status Button */}
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(user)
                                                        }
                                                        disabled={
                                                            updatingId === user.id ||
                                                            isCurrentUser
                                                        }
                                                        className={`w-full px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${user.is_active
                                                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                                : "bg-green-100 text-green-700 hover:bg-green-200"
                                                            } disabled:opacity-50`}
                                                    >
                                                        {isCurrentUser
                                                            ? "Your Account"
                                                            : updatingId === user.id
                                                                ? "Updating..."
                                                                : user.is_active
                                                                    ? "Deactivate User"
                                                                    : "Activate User"}
                                                    </button>

                                                    {/* Role Button */}
                                                    <button
                                                        onClick={() =>
                                                            handleRoleChange(user)
                                                        }
                                                        disabled={
                                                            updatingId === user.id ||
                                                            isCurrentUser
                                                        }
                                                        className="w-full bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-200 transition disabled:opacity-50"
                                                    >
                                                        {isCurrentUser
                                                            ? "Your Role"
                                                            : updatingId === user.id
                                                                ? "Updating..."
                                                                : user.role === "admin"
                                                                    ? "Make User"
                                                                    : "Make Admin"}
                                                    </button>

                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </>
    );
};

export default AdminUsers;