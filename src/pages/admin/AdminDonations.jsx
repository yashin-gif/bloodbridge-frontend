import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AdminDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [editForm, setEditForm] = useState({
        status: "",
        donation_date: "",
        notes: "",
    });

    const fetchDonations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/donations/");

            setDonations(response.data || []);
        } catch (error) {
            console.error(error);

            const detail = error.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(
                    detail.map((item) => item.msg).join(", ")
                );
            } else {
                setError(
                    typeof detail === "string"
                        ? detail
                        : "Failed to load donations."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const startEdit = (donation) => {
        setEditingId(donation.id);
        setError("");
        setSuccess("");

        setEditForm({
            status: donation.status || "pending",

            donation_date: donation.donation_date
                ? donation.donation_date.slice(0, 16)
                : "",

            notes: donation.notes || "",
        });
    };

    const cancelEdit = () => {
        setEditingId(null);

        setEditForm({
            status: "",
            donation_date: "",
            notes: "",
        });
    };

    const handleChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        });
    };

    const updateDonation = async (donationId) => {
        try {
            setError("");
            setSuccess("");

            if (!editForm.status) {
                setError("Please select a donation status.");
                return;
            }

            const data = {
                status: editForm.status,

                donation_date: editForm.donation_date
                    ? new Date(
                        editForm.donation_date
                    ).toISOString()
                    : null,

                notes: editForm.notes || null,
            };

            const response = await api.put(
                `/donations/${donationId}`,
                data
            );

            setDonations((currentDonations) =>
                currentDonations.map((donation) =>
                    donation.id === donationId
                        ? response.data
                        : donation
                )
            );

            setSuccess(
                `Donation #${donationId} updated successfully! ❤️`
            );

            cancelEdit();
        } catch (error) {
            console.error(error);

            const detail = error.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(
                    detail.map((item) => item.msg).join(", ")
                );
            } else {
                setError(
                    typeof detail === "string"
                        ? detail
                        : "Failed to update donation."
                );
            }
        }
    };

    const getStatusClass = (status) => {
        const value = status?.toLowerCase();

        if (value === "completed") {
            return "bg-green-100 text-green-700";
        }

        if (
            value === "cancelled" ||
            value === "canceled"
        ) {
            return "bg-red-100 text-red-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    const formatDate = (date) => {
        if (!date) {
            return "Not set";
        }

        const formattedDate = new Date(date);

        if (Number.isNaN(formattedDate.getTime())) {
            return "Not set";
        }

        return formattedDate.toLocaleString();
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">

                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                                    Admin Donations 🩸
                                </h1>

                                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500">
                                    Manage all blood donations.
                                </p>
                            </div>

                            <div className="self-start sm:self-auto bg-red-50 text-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold">
                                {donations.length} Donation
                                {donations.length !== 1
                                    ? "s"
                                    : ""}
                            </div>

                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 sm:mt-5 bg-red-100 text-red-600 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="mt-4 sm:mt-5 bg-green-100 text-green-700 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm">
                            {success}
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-10 sm:py-12 text-sm sm:text-base text-gray-500">
                            Loading donations...
                        </div>
                    )}

                    {/* Empty */}
                    {!loading &&
                        !error &&
                        donations.length === 0 && (
                            <div className="mt-4 sm:mt-5 bg-white rounded-xl sm:rounded-2xl shadow-sm p-8 sm:p-10 text-center">

                                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
                                    🩸
                                </div>

                                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                                    No Donations Found
                                </h2>

                                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500">
                                    There are no blood donations yet.
                                </p>

                            </div>
                        )}

                    {/* Donation List */}
                    {!loading &&
                        !error &&
                        donations.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-4 sm:mt-5 lg:mt-6">

                                {donations.map((donation) => (
                                    <div
                                        key={donation.id}
                                        className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6"
                                    >

                                        {editingId === donation.id ? (

                                            /* Edit Form */
                                            <>
                                                <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">

                                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                                        Donation #
                                                        {donation.id}
                                                    </h2>

                                                    <span className="shrink-0 text-xs sm:text-sm text-gray-500">
                                                        Editing
                                                    </span>

                                                </div>

                                                {/* Status */}
                                                <div className="mb-4">

                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                        Status
                                                    </label>

                                                    <select
                                                        name="status"
                                                        value={
                                                            editForm.status
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                                                    >
                                                        <option value="">
                                                            Select Status
                                                        </option>

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
                                                <div className="mb-4">

                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                        Donation Date
                                                    </label>

                                                    <input
                                                        type="datetime-local"
                                                        name="donation_date"
                                                        value={
                                                            editForm.donation_date
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                                    />

                                                </div>

                                                {/* Notes */}
                                                <div className="mb-5">

                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                        Notes
                                                    </label>

                                                    <textarea
                                                        name="notes"
                                                        value={
                                                            editForm.notes
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        rows="3"
                                                        placeholder="Donation notes"
                                                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                                                    />

                                                </div>

                                                {/* Buttons */}
                                                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">

                                                    <button
                                                        onClick={() =>
                                                            updateDonation(
                                                                donation.id
                                                            )
                                                        }
                                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        onClick={
                                                            cancelEdit
                                                        }
                                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition"
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>
                                            </>

                                        ) : (

                                            /* Donation Card */
                                            <>
                                                <div className="flex items-start justify-between gap-3">

                                                    <h2 className="min-w-0 text-lg sm:text-xl font-bold text-gray-800">
                                                        Donation #
                                                        {donation.id}
                                                    </h2>

                                                    <span
                                                        className={`shrink-0 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusClass(
                                                            donation.status
                                                        )}`}
                                                    >
                                                        {donation.status ||
                                                            "Unknown"}
                                                    </span>

                                                </div>

                                                <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3 text-sm sm:text-base text-gray-600">

                                                    <p>
                                                        <strong>
                                                            Donor ID:
                                                        </strong>{" "}
                                                        {
                                                            donation.donor_id
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Blood Request ID:
                                                        </strong>{" "}
                                                        {
                                                            donation.blood_request_id
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Donation Date:
                                                        </strong>{" "}
                                                        {formatDate(
                                                            donation.donation_date
                                                        )}
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Created:
                                                        </strong>{" "}
                                                        {formatDate(
                                                            donation.created_at
                                                        )}
                                                    </p>

                                                    {donation.notes && (
                                                        <p>
                                                            <strong>
                                                                Notes:
                                                            </strong>{" "}
                                                            {
                                                                donation.notes
                                                            }
                                                        </p>
                                                    )}

                                                </div>

                                                {/* Edit Button */}
                                                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">

                                                    <button
                                                        onClick={() =>
                                                            startEdit(
                                                                donation
                                                            )
                                                        }
                                                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg text-sm transition"
                                                    >
                                                        Edit Donation
                                                    </button>

                                                </div>
                                            </>
                                        )}

                                    </div>
                                ))}

                            </div>
                        )}

                </div>
            </div>
        </>
    );
};

export default AdminDonations;