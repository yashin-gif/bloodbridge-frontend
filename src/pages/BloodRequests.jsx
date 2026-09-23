import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const initialForm = {
    patient_name: "",
    blood_group: "",
    units_required: 1,
    hospital_name: "",
    contact_phone: "",
    location: "",
    available_date: "",
    message: "",
    urgency: "",
    status: "pending",
};

const Input = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    required = true,
}) => (
    <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            {label}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            min={type === "number" ? 1 : undefined}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
        />
    </div>
);

const BloodRequests = () => {
    const { user } = useAuth();

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(initialForm);

    const [donatingId, setDonatingId] = useState(null);
    const [donationNotes, setDonationNotes] = useState("");
    const [donating, setDonating] = useState(false);

    const [search, setSearch] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");

    const loadRequests = async () => {
        try {
            setLoading(true);

            const res = await api.get("/blood-requests/");
            const data = res.data || [];

            setRequests(data);
            setFilteredRequests(data);
        } catch (err) {
            const detail = err.response?.data?.detail;

            setMessage(
                typeof detail === "string"
                    ? detail
                    : "Failed to load blood requests."
            );

            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    useEffect(() => {
        let result = [...requests];

        const searchText = search.trim().toLowerCase();

        if (searchText) {
            result = result.filter((request) => {
                const patientName =
                    request.patient_name?.toLowerCase() || "";

                const hospitalName =
                    request.hospital_name?.toLowerCase() || "";

                const requestLocation =
                    request.location?.toLowerCase() || "";

                const blood =
                    request.blood_group?.toLowerCase() || "";

                return (
                    patientName.includes(searchText) ||
                    hospitalName.includes(searchText) ||
                    requestLocation.includes(searchText) ||
                    blood.includes(searchText)
                );
            });
        }

        if (bloodGroup) {
            result = result.filter(
                (request) => request.blood_group === bloodGroup
            );
        }

        if (location) {
            result = result.filter((request) =>
                request.location
                    ?.toLowerCase()
                    .includes(location.toLowerCase())
            );
        }

        if (status) {
            result = result.filter(
                (request) => request.status === status
            );
        }

        setFilteredRequests(result);
    }, [requests, search, bloodGroup, location, status]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleEdit = (r) => {
        setEditingId(r.id);

        setForm({
            patient_name: r.patient_name || "",
            blood_group: r.blood_group || "",
            units_required: r.units_required ?? 1,
            hospital_name: r.hospital_name || "",
            contact_phone: r.contact_phone || "",
            location: r.location || "",
            available_date: r.required_date
                ? r.required_date.split("T")[0]
                : "",
            message: r.reason || "",
            urgency: r.urgency || "",
            status: r.status || "pending",
        });

        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this blood request?"
            )
        ) {
            return;
        }

        try {
            await api.delete(`/blood-requests/${id}`);

            setMessage("Blood request deleted successfully.");
            setMessageType("success");

            await loadRequests();
        } catch (err) {
            const detail = err.response?.data?.detail;

            setMessage(
                typeof detail === "string"
                    ? detail
                    : "Failed to delete blood request."
            );

            setMessageType("error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (editingId) {
                await api.put(`/blood-requests/${editingId}`, {
                    units_required: Number(form.units_required),
                    hospital_name: form.hospital_name,
                    location: form.location,
                    contact_phone: form.contact_phone,
                    urgency: form.urgency,
                    required_date: form.available_date
                        ? `${form.available_date}T00:00:00`
                        : null,
                    reason: form.message,
                    status: form.status,
                });

                setMessage(
                    "Blood request updated successfully. ❤️"
                );
                setMessageType("success");
            } else {
                await api.post("/blood-requests/", {
                    ...form,
                    units_required: Number(form.units_required),
                });

                setMessage(
                    "Blood request created successfully! ❤️"
                );
                setMessageType("success");
            }

            setEditingId(null);
            setForm(initialForm);

            await loadRequests();
        } catch (err) {
            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setMessage(
                    detail.map((item) => item.msg).join(", ")
                );
            } else {
                setMessage(
                    typeof detail === "string"
                        ? detail
                        : "Please check your information."
                );
            }

            setMessageType("error");
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(initialForm);
        setMessage("");
    };

    const handleDonateClick = (requestId) => {
        setDonatingId(requestId);
        setDonationNotes("");
        setMessage("");
    };

    const handleCancelDonate = () => {
        setDonatingId(null);
        setDonationNotes("");
    };

    const handleDonate = async (requestId) => {
        try {
            setDonating(true);
            setMessage("");

            await api.post("/donations/", {
                blood_request_id: requestId,
                notes: donationNotes,
            });

            setMessage(
                "Donation request submitted successfully! ❤️"
            );

            setMessageType("success");

            setDonatingId(null);
            setDonationNotes("");
        } catch (err) {
            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setMessage(
                    detail.map((item) => item.msg).join(", ")
                );
            } else {
                setMessage(
                    typeof detail === "string"
                        ? detail
                        : "Failed to submit donation."
                );
            }

            setMessageType("error");
        } finally {
            setDonating(false);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setBloodGroup("");
        setLocation("");
        setStatus("");
    };

    const getUrgencyClass = (urgency) => {
        if (urgency === "critical") {
            return "bg-red-100 text-red-700";
        }

        if (urgency === "urgent") {
            return "bg-orange-100 text-orange-700";
        }

        return "bg-green-100 text-green-700";
    };

    const getStatusClass = (status) => {
        if (status === "fulfilled") {
            return "bg-green-100 text-green-700";
        }

        if (status === "cancelled") {
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-100 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                                🩸
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                                    Blood Requests
                                </h1>

                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    Find people who need blood.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Create / Edit Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 mt-5">

                        <div className="flex items-center justify-between gap-3 mb-5">
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                    {editingId
                                        ? "Edit Blood Request"
                                        : "Create Blood Request"}
                                </h2>

                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {editingId
                                        ? "Update the blood request information."
                                        : "Fill in the information to request blood."}
                                </p>
                            </div>

                            <div className="text-2xl sm:text-3xl shrink-0">
                                {editingId ? "✏️" : "🩸"}
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            <Input
                                label="Patient Name"
                                name="patient_name"
                                value={form.patient_name}
                                onChange={handleChange}
                                placeholder="Enter patient name"
                            />

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    Blood Group
                                </label>

                                <select
                                    name="blood_group"
                                    value={form.blood_group}
                                    onChange={handleChange}
                                    required
                                    disabled={editingId}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-gray-100"
                                >
                                    <option value="">
                                        Select blood group
                                    </option>

                                    {[
                                        "A+",
                                        "A-",
                                        "B+",
                                        "B-",
                                        "AB+",
                                        "AB-",
                                        "O+",
                                        "O-",
                                    ].map((group) => (
                                        <option key={group} value={group}>
                                            {group}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label="Units Required"
                                name="units_required"
                                value={form.units_required}
                                onChange={handleChange}
                                placeholder="Number of units"
                                type="number"
                            />

                            <Input
                                label="Hospital Name"
                                name="hospital_name"
                                value={form.hospital_name}
                                onChange={handleChange}
                                placeholder="Enter hospital name"
                            />

                            <Input
                                label="Contact Phone"
                                name="contact_phone"
                                value={form.contact_phone}
                                onChange={handleChange}
                                placeholder="Enter contact number"
                            />

                            <Input
                                label="Location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Enter location"
                            />

                            <Input
                                label="Required Date"
                                name="available_date"
                                value={form.available_date}
                                onChange={handleChange}
                                type="date"
                                placeholder="Select date"
                            />

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    Urgency
                                </label>

                                <select
                                    name="urgency"
                                    value={form.urgency}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="">
                                        Select urgency
                                    </option>

                                    <option value="normal">Normal</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="fulfilled">Fulfilled</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    Reason / Message
                                </label>

                                <input
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Enter a short message"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2.5 pt-1">
                                <button
                                    type="submit"
                                    className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition shadow-sm"
                                >
                                    {editingId
                                        ? "Update Blood Request"
                                        : "Create Blood Request"}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="sm:px-7 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>

                        {message && (
                            <div
                                className={`mt-4 p-3 rounded-lg text-sm font-medium ${messageType === "error"
                                        ? "bg-red-50 text-red-700 border border-red-100"
                                        : "bg-green-50 text-green-700 border border-green-100"
                                    }`}
                            >
                                {message}
                            </div>
                        )}
                    </div>

                    {/* Search + Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 mt-5">

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    Search & Filter
                                </h2>

                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    Find the blood request you need.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="self-start sm:self-auto text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700"
                            >
                                Clear Filters
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    Search
                                </label>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Patient, hospital..."
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    Blood Group
                                </label>

                                <select
                                    value={bloodGroup}
                                    onChange={(e) =>
                                        setBloodGroup(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="">
                                        All Blood Groups
                                    </option>

                                    {[
                                        "A+",
                                        "A-",
                                        "B+",
                                        "B-",
                                        "AB+",
                                        "AB-",
                                        "O+",
                                        "O-",
                                    ].map((group) => (
                                        <option key={group} value={group}>
                                            {group}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    placeholder="Example: Jamalpur"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="">
                                        All Status
                                    </option>

                                    <option value="pending">Pending</option>
                                    <option value="fulfilled">Fulfilled</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Request List */}
                    <div className="mt-6">

                        <div className="flex items-center justify-between gap-3 mb-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                Blood Requests
                            </h2>

                            <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                                {filteredRequests.length} Request
                                {filteredRequests.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {loading ? (
                            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                <p className="text-sm text-gray-500">
                                    Loading blood requests...
                                </p>
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                <div className="text-4xl mb-3">🩸</div>

                                <h2 className="text-lg font-semibold text-gray-800">
                                    No Blood Requests Found
                                </h2>

                                <p className="mt-1.5 text-sm text-gray-500">
                                    Try changing your search or filters.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                {filteredRequests.map((r) => {
                                    const isMyRequest =
                                        Number(r.requested_by) ===
                                        Number(user?.id);

                                    const isPending =
                                        r.status === "pending";

                                    return (
                                        <div
                                            key={r.id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition"
                                        >
                                            {/* Patient */}
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    <h2 className="text-lg font-bold text-gray-800 ">
                                                        {r.patient_name}
                                                    </h2>

                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        Blood Request #{r.id}
                                                    </p>
                                                </div>

                                                <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-sm font-bold shrink-0">
                                                    {r.blood_group}
                                                </span>
                                            </div>

                                            {/* Information */}
                                            <div className="mt-4 grid grid-cols-1 gap-2 text-xs sm:text-sm text-gray-600">
                                                <p className="">
                                                    🏥 <b>Hospital:</b>{" "}
                                                    {r.hospital_name}
                                                </p>

                                                <p className="">
                                                    📍 <b>Location:</b>{" "}
                                                    {r.location}
                                                </p>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <p>
                                                        🩸 <b>Units:</b>{" "}
                                                        {r.units_required}
                                                    </p>

                                                    <p className="">
                                                        📅 <b>Date:</b>{" "}
                                                        {r.required_date
                                                            ? r.required_date.slice(0, 10)
                                                            : r.available_date ||
                                                            "Not set"}
                                                    </p>
                                                </div>

                                                <p className="">
                                                    📞 <b>Contact:</b>{" "}
                                                    {r.contact_phone}
                                                </p>
                                            </div>

                                            {/* Badges */}
                                            <div className="flex flex-wrap gap-1.5 mt-4">
                                                {r.urgency && (
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getUrgencyClass(
                                                            r.urgency
                                                        )}`}
                                                    >
                                                        {r.urgency}
                                                    </span>
                                                )}

                                                {r.status && (
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusClass(
                                                            r.status
                                                        )}`}
                                                    >
                                                        {r.status}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Reason */}
                                            {r.reason && (
                                                <div className="mt-3 bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-xs sm:text-sm text-gray-600">
                                                    <b>Message:</b>{" "}
                                                    {r.reason}
                                                </div>
                                            )}

                                            {/* Donate Form */}
                                            {donatingId === r.id && (
                                                <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-3">
                                                    <h3 className="text-sm font-semibold text-gray-800">
                                                        Donate Blood 🩸
                                                    </h3>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Add a note for the requester.
                                                    </p>

                                                    <textarea
                                                        value={donationNotes}
                                                        onChange={(e) =>
                                                            setDonationNotes(
                                                                e.target.value
                                                            )
                                                        }
                                                        rows="3"
                                                        placeholder="Example: I can donate blood."
                                                        className="w-full mt-2.5 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                                    />

                                                    <div className="flex flex-col sm:flex-row gap-2 mt-2.5">
                                                        <button
                                                            type="button"
                                                            disabled={donating}
                                                            onClick={() =>
                                                                handleDonate(r.id)
                                                            }
                                                            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                                                        >
                                                            {donating
                                                                ? "Submitting..."
                                                                : "Confirm Donation"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleCancelDonate
                                                            }
                                                            className="sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Buttons */}
                                            {isMyRequest ? (
                                                <div className="mt-4 flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(r)
                                                        }
                                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(r.id)
                                                        }
                                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ) : (
                                                isPending &&
                                                donatingId !== r.id && (
                                                    <button
                                                        onClick={() =>
                                                            handleDonateClick(
                                                                r.id
                                                            )
                                                        }
                                                        className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                                                    >
                                                        🩸 Donate Blood
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BloodRequests;