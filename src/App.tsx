import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Footer from "./components/footer/Footer";

// import LoginPage from "./pages/login/LoginPage";
// import DashboardPage from "./pages/dahsboard/DashboardPage";
// import ProductPage from "./pages/product/ProductPage";
// import CategoryPage from "./pages/category/CategoryPage";
// import UserPage from "./pages/user/UserPage";

const AdminLayout: React.FC = () => {
  return (
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
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public route */}
      {/* <Route path="/login" element={<LoginPage />} /> */}

      {/* Admin layout routes (later you can wrap with auth protection) */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        {/* <Route path="/products" element={<ProductPage />} /> */}
        {/* <Route path="/categories" element={<CategoryPage />} /> */}
        {/* <Route path="/users" element={<UserPage />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;