import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Donations = () => {
    const [donations, setDonations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingDonation, setEditingDonation] = useState(null);

    const [editStatus, setEditStatus] = useState("pending");
    const [editDate, setEditDate] = useState("");
    const [editNotes, setEditNotes] = useState("");

    // Fetch my donations
    const fetchDonations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/donations/me");

            setDonations(response.data || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.detail ||
                "Failed to load donations."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    // Open edit form
    const handleEdit = (donation) => {
        setEditingDonation(donation);

        setEditStatus(donation.status || "pending");

        setEditDate(
            donation.donation_date
                ? donation.donation_date.slice(0, 10)
                : ""
        );

        setEditNotes(donation.notes || "");

        setError("");
        setSuccess("");
    };

    // Update donation
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editingDonation) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.put(
                `/donations/${editingDonation.id}`,
                {
                    status: editStatus,
                    donation_date: editDate || null,
                    notes: editNotes,
                }
            );

            setSuccess("Donation updated successfully! ❤️");

            setEditingDonation(null);

            await fetchDonations();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.detail ||
                "Failed to update donation."
            );
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Unknown";
        }

        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatDate = (date) => {
        if (!date) {
            return "Not set";
        }

        return new Date(date).toLocaleDateString();
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                                    My Donations 🩸
                                </h1>

                                <p className="mt-1 text-sm sm:text-base text-gray-500">
                                    View and manage your blood donation history.
                                </p>
                            </div>

                            <div className="self-start sm:self-auto bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold">
                                {donations.length} Donation
                                {donations.length !== 1 ? "s" : ""}
                            </div>

                        </div>

                    </div>

                    {/* Success */}
                    {success && (
                        <div className="mt-4 bg-green-100 text-green-700 p-3 sm:p-4 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-4 bg-red-100 text-red-600 p-3 sm:p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-10 text-sm text-gray-500">
                            Loading donations...
                        </div>
                    )}

                    {/* No Donations */}
                    {!loading &&
                        !error &&
                        donations.length === 0 && (

                            <div className="mt-4 bg-white rounded-xl shadow-sm p-8 sm:p-10 text-center">

                                <div className="text-4xl sm:text-5xl mb-3">
                                    🩸
                                </div>

                                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                                    No Donations Yet
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Your blood donation history will appear here.
                                </p>

                            </div>
                        )}

                    {/* Donation Cards */}
                    {!loading &&
                        !error &&
                        donations.length > 0 && (

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                                {donations.map((donation) => (

                                    <div
                                        key={donation.id}
                                        className="bg-white rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition"
                                    >

                                        {/* Top */}
                                        <div className="flex items-start justify-between gap-3">

                                            <div>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    Donation ID
                                                </p>

                                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                                    #{donation.id}
                                                </h2>
                                            </div>

                                            <span
                                                className={`shrink-0 px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusClass(
                                                    donation.status
                                                )}`}
                                            >
                                                {formatStatus(
                                                    donation.status
                                                )}
                                            </span>

                                        </div>

                                        {/* Details */}
                                        <div className="mt-4 space-y-2.5 text-sm text-gray-600">

                                            <div className="flex items-start gap-2">
                                                <span className="shrink-0">
                                                    🩸
                                                </span>

                                                <span>
                                                    Blood Request: #
                                                    {donation.blood_request_id}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <span className="shrink-0">
                                                    📅
                                                </span>

                                                <span>
                                                    Donation Date:{" "}
                                                    {formatDate(
                                                        donation.donation_date
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <span className="shrink-0">
                                                    📝
                                                </span>

                                                <span>
                                                    {donation.notes ||
                                                        "No notes added."}
                                                </span>
                                            </div>

                                        </div>

                                        {/* Created */}
                                        <div className="mt-4 pt-3 border-t border-gray-100">

                                            <p className="text-xs sm:text-sm text-gray-400">
                                                Created:{" "}
                                                {formatDate(
                                                    donation.created_at
                                                )}
                                            </p>

                                        </div>

                                        {/* Edit Button */}
                                        <button
                                            onClick={() =>
                                                handleEdit(donation)
                                            }
                                            className="mt-3 w-full bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                                        >
                                            Edit Donation
                                        </button>

                                    </div>

                                ))}

                            </div>
                        )}

                    {/* Edit Donation */}
                    {editingDonation && (
                        <div className="mt-6 bg-white rounded-xl shadow-sm p-4 sm:p-5">

                            <div className="flex items-center justify-between mb-4">

                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                    Edit Donation
                                </h2>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingDonation(null)
                                    }
                                    className="text-gray-500 hover:text-red-600 text-xl px-2"
                                >
                                    ✕
                                </button>

                            </div>

                            <form
                                onSubmit={handleUpdate}
                                className="space-y-4"
                            >

                                {/* Status */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>

                                    <select
                                        value={editStatus}
                                        onChange={(e) =>
                                            setEditStatus(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>

                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                </div>

                                {/* Donation Date */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Donation Date
                                    </label>

                                    <input
                                        type="date"
                                        value={editDate}
                                        onChange={(e) =>
                                            setEditDate(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>

                                    <textarea
                                        value={editNotes}
                                        onChange={(e) =>
                                            setEditNotes(e.target.value)
                                        }
                                        rows="4"
                                        placeholder="Add donation notes..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-2.5">

                                    <button
                                        type="submit"
                                        className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                                    >
                                        Update Donation
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditingDonation(null)
                                        }
                                        className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Donations;