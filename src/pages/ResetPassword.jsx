import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [token] = useState(searchParams.get("token") || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!token) {
            setError("Invalid or missing reset link.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/auth/reset-password", {
                token: token,
                new_password: newPassword,
            });

            setMessage(response.data.message);

            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Password reset failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 py-6 sm:px-4">

            <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-7">

                <h1 className="text-2xl sm:text-3xl font-bold text-center text-red-600">
                    Reset Password
                </h1>

                <p className="text-center text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">
                    Enter your new password
                </p>

                {message && (
                    <div className="mt-5 bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                {!message && (
                    <form
                        onSubmit={handleSubmit}
                        className="mt-5 sm:mt-6 space-y-4"
                    >

                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-1">
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter your new password"
                                autoComplete="new-password"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-1">
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                autoComplete="new-password"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mx-auto block bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                    </form>
                )}

                {!message && (
                    <div className="text-center mt-5">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-red-600 font-semibold hover:underline text-sm sm:text-base"
                        >
                            Back to Login
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ResetPassword;