import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(formData.username, formData.password);

            navigate("/dashboard");
        } catch (error) {
            console.error(error);

            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else {
                setError(
                    "Login failed. Please check your username and password."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 py-6 sm:px-4">

            <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-7">

                <h1 className="text-2xl sm:text-3xl font-bold text-center text-red-600">
                    BloodBridge
                </h1>

                <p className="text-center text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">
                    Login to your account
                </p>

                {error && (
                    <div className="mt-4 sm:mt-5 bg-red-100 text-red-600 p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-4">

                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div className="text-right">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-red-600 text-sm font-medium hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="text-center text-sm sm:text-base text-gray-600 mt-5 sm:mt-6">
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate("/register")}
                        className="text-red-600 font-semibold hover:underline"
                    >
                        Register
                    </button>
                </p>

            </div>
        </div>
    );
};

export default Login;