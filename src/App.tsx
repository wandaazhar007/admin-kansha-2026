import React from "react";
import { Routes, Route } from "react-router-dom";

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
          <h1>test</h1>
          {/* Outlet will be used later when we add real pages */}
        </main>
        <Footer />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* For now, render AdminLayout for all paths */}
      <Route path="/*" element={<AdminLayout />} />
    </Routes>
  );
};

export default App;