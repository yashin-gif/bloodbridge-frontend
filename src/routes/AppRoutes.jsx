import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import BloodRequests from "../pages/BloodRequests";
import Donations from "../pages/Donations";
import Profile from "../pages/Profile";
import BloodDonors from "../pages/BloodDonors";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminBloodRequests from "../pages/admin/AdminBloodRequests";
import AdminDonations from "../pages/admin/AdminDonations";

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Home */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* Public */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* User Protected */}
            <Route element={<ProtectedRoute />}>

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/blood-requests"
                    element={<BloodRequests />}
                />

                <Route
                    path="/blood-donors"
                    element={<BloodDonors />}
                />

                <Route
                    path="/donations"
                    element={<Donations />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute />}>

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/users"
                    element={<AdminUsers />}
                />

                <Route
                    path="/admin/blood-requests"
                    element={<AdminBloodRequests />}
                />

                <Route
                    path="/admin/donations"
                    element={<AdminDonations />}
                />

            </Route>

            {/* Unknown URL */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
};

export default AppRoutes;