import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/forgot-password", {
                email: email,
            });

            const resetToken = response.data.reset_token;

            if (!resetToken) {
                setError("Password reset failed. Please try again.");
                return;
            }

            navigate(
                `/reset-password?token=${encodeURIComponent(resetToken)}`
            );

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
                    Forgot Password
                </h1>

                <p className="text-center text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">
                    Enter your email to reset your password
                </p>

                {error && (
                    <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-5 sm:mt-6 space-y-4"
                >

                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mx-auto block bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                    >
                        {loading ? "Checking..." : "Reset Password"}
                    </button>

                </form>

                <div className="text-center mt-5">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-red-600 font-semibold hover:underline text-sm sm:text-base"
                    >
                        Back to Login
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;