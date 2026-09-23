import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const BloodDonors = () => {
    const [donors, setDonors] = useState([]);
    const [filteredDonors, setFilteredDonors] = useState([]);

    const [search, setSearch] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [location, setLocation] = useState("");
    const [availableOnly, setAvailableOnly] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDonors = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/users/donors");

            const users = response.data || [];

            setDonors(users);
            setFilteredDonors(users);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.detail ||
                "Failed to load blood donors."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    useEffect(() => {
        let result = [...donors];

        // Search
        if (search.trim()) {
            const searchText = search.toLowerCase();

            result = result.filter((donor) => {
                const fullName =
                    `${donor.first_name || ""} ${donor.last_name || ""}`
                        .toLowerCase();

                return (
                    fullName.includes(searchText) ||
                    donor.username?.toLowerCase().includes(searchText) ||
                    donor.location?.toLowerCase().includes(searchText)
                );
            });
        }

        // Blood Group
        if (bloodGroup) {
            result = result.filter(
                (donor) => donor.blood_group === bloodGroup
            );
        }

        // Location
        if (location.trim()) {
            result = result.filter((donor) =>
                donor.location
                    ?.toLowerCase()
                    .includes(location.toLowerCase())
            );
        }

        // Available Only
        if (availableOnly) {
            result = result.filter(
                (donor) => donor.is_available === true
            );
        }

        setFilteredDonors(result);
    }, [
        search,
        bloodGroup,
        location,
        availableOnly,
        donors
    ]);

    const getFullName = (donor) => {
        const name =
            `${donor.first_name || ""} ${donor.last_name || ""}`.trim();

        return name || donor.username;
    };

    const getAvailabilityClass = (isAvailable) => {
        return isAvailable
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600";
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
                                    Blood Donors 🩸
                                </h1>

                                <p className="mt-1 text-sm sm:text-base text-gray-500">
                                    Find available blood donors near you.
                                </p>
                            </div>

                            <div className="self-start sm:self-auto bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold">
                                {filteredDonors.length} Donor
                                {filteredDonors.length !== 1
                                    ? "s"
                                    : ""}
                            </div>

                        </div>

                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 mt-4">

                        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                            Search & Filter
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                            {/* Search */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Name, username or location"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>

                            {/* Blood Group */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Blood Group
                                </label>

                                <select
                                    value={bloodGroup}
                                    onChange={(e) =>
                                        setBloodGroup(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <option value="">
                                        All Blood Groups
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
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    placeholder="e.g. Jamalpur"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>

                            {/* Available Only */}
                            <div className="flex items-end">

                                <label className="w-full flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gray-50">

                                    <input
                                        type="checkbox"
                                        checked={availableOnly}
                                        onChange={(e) =>
                                            setAvailableOnly(
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 shrink-0"
                                    />

                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                        Available donors only
                                    </span>

                                </label>

                            </div>

                        </div>

                        {/* Clear Filters */}
                        {(search ||
                            bloodGroup ||
                            location ||
                            availableOnly) && (

                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setBloodGroup("");
                                        setLocation("");
                                        setAvailableOnly(false);
                                    }}
                                    className="mt-3 text-sm text-red-600 font-semibold hover:underline"
                                >
                                    Clear all filters
                                </button>

                            )}

                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-10 text-sm text-gray-500">
                            Loading blood donors...
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-4 bg-red-100 text-red-600 p-3 sm:p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* No Donors */}
                    {!loading &&
                        !error &&
                        filteredDonors.length === 0 && (

                            <div className="mt-4 bg-white rounded-xl shadow-sm p-8 sm:p-10 text-center">

                                <div className="text-4xl sm:text-5xl mb-3">
                                    🩸
                                </div>

                                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                                    No Donors Found
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Try changing your search or filters.
                                </p>

                            </div>

                        )}

                    {/* Donor Cards */}
                    {!loading &&
                        !error &&
                        filteredDonors.length > 0 && (

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                                {filteredDonors.map((donor) => (

                                    <div
                                        key={donor.id}
                                        className="bg-white rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition"
                                    >

                                        {/* Top */}
                                        <div className="flex items-start justify-between gap-3">

                                            <div className="flex items-center gap-3 min-w-0">

                                                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full bg-red-100 flex items-center justify-center text-xl sm:text-2xl">
                                                    🩸
                                                </div>

                                                <div className="min-w-0">
                                                    <h2 className="text-base sm:text-lg font-bold text-gray-800">
                                                        {getFullName(donor)}
                                                    </h2>

                                                    <p className="text-xs sm:text-sm text-gray-500">
                                                        @{donor.username}
                                                    </p>
                                                </div>

                                            </div>

                                            <span className="shrink-0 bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold">
                                                {donor.blood_group || "N/A"}
                                            </span>

                                        </div>

                                        {/* Details */}
                                        <div className="mt-4 space-y-2.5 text-sm text-gray-600">

                                            <div className="flex items-start gap-2">
                                                <span className="shrink-0">
                                                    📍
                                                </span>

                                                <span>
                                                    {donor.location ||
                                                        "Location not set"}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <span className="shrink-0">
                                                    📞
                                                </span>

                                                <span>
                                                    {donor.phone ||
                                                        "Phone not available"}
                                                </span>
                                            </div>

                                        </div>

                                        {/* Availability */}
                                        <div className="mt-4 pt-3 border-t border-gray-100">

                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold ${getAvailabilityClass(
                                                    donor.is_available
                                                )}`}
                                            >
                                                {donor.is_available
                                                    ? "● Available to Donate"
                                                    : "● Currently Unavailable"}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                </div>
            </div>
        </>
    );
};

export default BloodDonors;