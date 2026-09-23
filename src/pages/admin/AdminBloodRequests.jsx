import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const initialForm = {
    units_required: 1,
    hospital_name: "",
    contact_phone: "",
    location: "",
    available_date: "",
    message: "",
    urgency: "",
    status: "pending",
};

const AdminBloodRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(initialForm);

    // =========================
    // Load Blood Requests
    // =========================
    const loadRequests = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await api.get("/blood-requests/");

            setRequests(res.data || []);
        } catch (err) {
            console.error(err);

            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setMessage(
                    detail.map((item) => item.msg).join(", ")
                );
            } else {
                setMessage(
                    typeof detail === "string"
                        ? detail
                        : "Failed to load blood requests."
                );
            }

            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    // =========================
    // Handle Input
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // Edit Request
    // =========================
    const handleEdit = (request) => {
        setEditingId(request.id);

        setForm({
            units_required: request.units_required ?? 1,
            hospital_name: request.hospital_name || "",
            contact_phone: request.contact_phone || "",
            location: request.location || "",

            available_date: request.required_date
                ? request.required_date.slice(0, 10)
                : "",

            message: request.reason || "",
            urgency: request.urgency || "",
            status: request.status || "pending",
        });

        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // Update Request
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editingId) {
            return;
        }

        try {
            setMessage("");

            const data = {
                units_required: Number(form.units_required),
                hospital_name: form.hospital_name,
                contact_phone: form.contact_phone,
                location: form.location,
                urgency: form.urgency,
                status: form.status,

                required_date: form.available_date
                    ? `${form.available_date}T00:00:00`
                    : null,

                reason: form.message,
            };

            await api.put(
                `/blood-requests/${editingId}`,
                data
            );

            setMessage(
                "Blood request updated successfully. ❤️"
            );
            setMessageType("success");

            setEditingId(null);
            setForm(initialForm);

            await loadRequests();
        } catch (err) {
            console.error(err);

            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setMessage(
                    detail.map((item) => item.msg).join(", ")
                );
            } else {
                setMessage(
                    typeof detail === "string"
                        ? detail
                        : "Failed to update blood request."
                );
            }

            setMessageType("error");
        }
    };

    // =========================
    // Delete Request
    // =========================
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this blood request?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            await api.delete(`/blood-requests/${id}`);

            setMessage(
                "Blood request deleted successfully."
            );
            setMessageType("success");

            if (editingId === id) {
                setEditingId(null);
                setForm(initialForm);
            }

            await loadRequests();
        } catch (err) {
            console.error(err);

            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setMessage(
                    detail.map((item) => item.msg).join(", ")
                );
            } else {
                setMessage(
                    typeof detail === "string"
                        ? detail
                        : "Failed to delete blood request."
                );
            }

            setMessageType("error");
        }
    };

    // =========================
    // Cancel Edit
    // =========================
    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(initialForm);
        setMessage("");
    };

    // =========================
    // Urgency Style
    // =========================
    const getUrgencyClass = (urgency) => {
        const value = urgency?.toLowerCase();

        if (value === "critical") {
            return "bg-red-100 text-red-700";
        }

        if (value === "urgent") {
            return "bg-orange-100 text-orange-700";
        }

        return "bg-green-100 text-green-700";
    };

    // =========================
    // Status Style
    // =========================
    const getStatusClass = (status) => {
        const value = status?.toLowerCase();

        if (value === "fulfilled") {
            return "bg-green-100 text-green-700";
        }

        if (
            value === "cancelled" ||
            value === "canceled"
        ) {
            return "bg-gray-200 text-gray-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-red-100 flex items-center justify-center text-xl sm:text-2xl">
                                🩸
                            </div>

                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                    Admin Blood Requests
                                </h1>

                                <p className="mt-1 text-sm sm:text-base text-gray-500">
                                    Review and manage all blood requests.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Edit Form */}
                    {editingId && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mt-4 sm:mt-6">

                            <div className="flex items-center justify-between mb-4 sm:mb-6">

                                <div>
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                                        Edit Blood Request ✏️
                                    </h2>

                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        Update request information and status.
                                    </p>
                                </div>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
                            >

                                {/* Units */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                        Units Required
                                    </label>

                                    <input
                                        type="number"
                                        name="units_required"
                                        min="1"
                                        value={form.units_required}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>

                                {/* Hospital */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                        Hospital Name
                                    </label>

                                    <input
                                        type="text"
                                        name="hospital_name"
                                        value={form.hospital_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>

                                {/* Contact */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                        Contact Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="contact_phone"
                                        value={form.contact_phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                        Required Date
                                    </label>

                                    <input
                                        type="date"
                                        name="available_date"
                                        value={form.available_date}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>

                                {/* Urgency */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                        Urgency
                                    </label>

                                    <select
                                        name="urgency"
                                        value={form.urgency}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    >
                                        <option value="">
                                            Select urgency
                                        </option>

                                        <option value="normal">
                                            Normal
                                        </option>

                                        <option value="urgent">
                                            Urgent
                                        </option>

                                        <option value="critical">
                                            Critical
                                        </option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="fulfilled">
                                            Fulfilled
                                        </option>

                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                        Reason / Message
                                    </label>

                                    <input
                                        type="text"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">

                                    <button
                                        type="submit"
                                        className="flex-1 bg-red-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-red-700 transition"
                                    >
                                        Update Blood Request
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="sm:px-8 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                            {/* Edit Message */}
                            {message && (
                                <div
                                    className={`mt-4 sm:mt-5 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm ${messageType === "error"
                                            ? "bg-red-50 text-red-700 border border-red-100"
                                            : "bg-green-50 text-green-700 border border-green-100"
                                        }`}
                                >
                                    {message}
                                </div>
                            )}

                        </div>
                    )}

                    {/* Global Message */}
                    {!editingId && message && (
                        <div
                            className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm font-medium ${messageType === "error"
                                    ? "bg-red-50 text-red-700 border border-red-100"
                                    : "bg-green-50 text-green-700 border border-green-100"
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    {/* Request List */}
                    <div className="mt-6 sm:mt-8">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">

                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                All Blood Requests
                            </h2>

                            <span className="self-start bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                {requests.length} Request
                                {requests.length !== 1
                                    ? "s"
                                    : ""}
                            </span>

                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-10 text-center shadow-sm">
                                <p className="text-sm sm:text-base text-gray-500">
                                    Loading blood requests...
                                </p>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-10 text-center shadow-sm">

                                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
                                    🩸
                                </div>

                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                    No Blood Requests
                                </h2>

                                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-500">
                                    There are currently no blood requests.
                                </p>

                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

                                {requests.map((r) => (
                                    <div
                                        key={r.id}
                                        className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition"
                                    >

                                        {/* Patient + Blood Group */}
                                        <div className="flex justify-between items-start gap-3">

                                            <div className="min-w-0">
                                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                                    {r.patient_name}
                                                </h2>

                                                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                                    Request ID: #{r.id}
                                                </p>
                                            </div>

                                            <span className="shrink-0 bg-red-100 text-red-600 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-sm font-bold">
                                                {r.blood_group}
                                            </span>

                                        </div>

                                        {/* Information */}
                                        <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-gray-600">

                                            <p>
                                                🏥 <b>Hospital:</b>{" "}
                                                {r.hospital_name}
                                            </p>

                                            <p>
                                                📍 <b>Location:</b>{" "}
                                                {r.location}
                                            </p>

                                            <p>
                                                🩸 <b>Units:</b>{" "}
                                                {r.units_required}
                                            </p>

                                            <p>
                                                📞 <b>Contact:</b>{" "}
                                                {r.contact_phone}
                                            </p>

                                            <p>
                                                📅 <b>Date:</b>{" "}
                                                {r.required_date
                                                    ? r.required_date.slice(
                                                        0,
                                                        10
                                                    )
                                                    : "Not set"}
                                            </p>

                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">

                                            {r.urgency && (
                                                <span
                                                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyClass(
                                                        r.urgency
                                                    )}`}
                                                >
                                                    {r.urgency}
                                                </span>
                                            )}

                                            {r.status && (
                                                <span
                                                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                        r.status
                                                    )}`}
                                                >
                                                    {r.status}
                                                </span>
                                            )}

                                        </div>

                                        {/* Message */}
                                        {r.reason && (
                                            <div className="mt-3 sm:mt-4 bg-gray-50 border border-gray-100 p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm text-gray-600">
                                                <b>Message:</b>{" "}
                                                {r.reason}
                                            </div>
                                        )}

                                        {/* Buttons */}
                                        <div className="mt-4 sm:mt-5 flex gap-2">

                                            <button
                                                onClick={() =>
                                                    handleEdit(r)
                                                }
                                                className="flex-1 bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-blue-700 transition"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(r.id)
                                                }
                                                className="flex-1 bg-red-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </div>
            </div>
        </>
    );
};

export default AdminBloodRequests;