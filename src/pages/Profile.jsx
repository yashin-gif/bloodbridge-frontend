import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Profile = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        blood_group: "",
        location: "",
        is_available: false,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/users/me");

                setFormData({
                    first_name: response.data.first_name ?? "",
                    last_name: response.data.last_name ?? "",
                    phone: response.data.phone ?? "",
                    blood_group: response.data.blood_group ?? "",
                    location: response.data.location ?? "",
                    is_available: response.data.is_available ?? false,
                });
            } catch (error) {
                console.error("Profile loading error:", error);

                setError(
                    error.response?.data?.detail ||
                    "Failed to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await api.put(
                "/users/me",
                formData
            );

            setFormData({
                first_name: response.data.first_name ?? "",
                last_name: response.data.last_name ?? "",
                phone: response.data.phone ?? "",
                blood_group: response.data.blood_group ?? "",
                location: response.data.location ?? "",
                is_available: response.data.is_available ?? false,
            });

            setSuccess(
                "Profile updated successfully! ❤️"
            );
        } catch (error) {
            console.error("Profile update error:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                    <p className="text-sm sm:text-base text-gray-500">
                        Loading profile...
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                <div className="max-w-4xl mx-auto">

                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">

                        {/* Header */}
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            My Profile 👤
                        </h1>

                        <p className="mt-1 text-sm sm:text-base text-gray-500">
                            View and update your BloodBridge profile.
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 bg-red-100 border border-red-200 text-red-600 p-3 sm:p-4 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="mt-4 bg-green-100 border border-green-200 text-green-600 p-3 sm:p-4 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-4 sm:space-y-5"
                        >

                            {/* First Name + Last Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>

                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            {/* Blood Group */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Blood Group
                                </label>

                                <select
                                    name="blood_group"
                                    value={formData.blood_group}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">
                                        Select Blood Group
                                    </option>

                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Example: Jamalpur"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            {/* Availability */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">

                                <label className="flex items-start gap-3 cursor-pointer">

                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={formData.is_available}
                                        onChange={handleChange}
                                        className="w-5 h-5 mt-0.5 shrink-0 accent-red-600"
                                    />

                                    <div>
                                        <p className="text-sm sm:text-base text-gray-800 font-semibold">
                                            I am available to donate blood
                                        </p>

                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                            Other users can find you as an available donor.
                                        </p>
                                    </div>

                                </label>

                            </div>

                            {/* Update Button */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm sm:text-base font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving
                                    ? "Updating Profile..."
                                    : "Update Profile"}
                            </button>

                        </form>

                    </div>

                </div>
            </div>
        </>
    );
};

export default Profile;