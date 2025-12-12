// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Footer from "./components/footer/Footer";
import ProtectedRoute from "./lib/ProtectedRoute";

import DashboardPage from "./pages/dahsboard/DashboardPage";
import LoginPage from "./pages/login/LoginPage";
import ProductPage from "./pages/product/ProductPage";
import CategoryPage from "./pages/category/CategoryPage";
// import ProductPage from "./pages/product/ProductPage";
// import CategoryPage from "./pages/category/CategoryPage";
// import UserPage from "./pages/user/UserPage";

const AdminLayout: React.FC = () => {
  return (
    <div className="app-root">
      <div className="app-shell">
        <Sidebar />
        <div className="app-shell__main">
          <Navbar />
          <main className="page-container">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected admin layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {/* Nanti: */}
        <Route path="product" element={<ProductPage />} />
        <Route path="category" element={<CategoryPage />} />
        {/* <Route path="user" element={<UserPage />} /> */}

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;