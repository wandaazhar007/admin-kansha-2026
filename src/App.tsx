// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Footer from "./components/footer/Footer";
import ProtectedRoute from "./lib/ProtectedRoute";

import DashboardPage from "./pages/dahsboard/DashboardPage";
import LoginPage from "./pages/login/LoginPage";

const AdminLayout: React.FC = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Navbar />
        <main className="page-container">
          {/* Di sini semua halaman admin akan dirender */}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Halaman LOGIN – tidak pakai layout admin */}
      <Route path="/login" element={<LoginPage />} />

      {/* Layout admin – semua butuh login */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Default: kalau ke "/", redirect ke "/dashboard" */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Halaman dashboard utama */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Nanti di sini bisa ditambah:
            <Route path="product" element={<ProductPage />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="user" element={<UserPage />} />
        */}
      </Route>

      {/* Fallback: kalau path tidak dikenal, arahkan ke /dashboard (atau /login) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;