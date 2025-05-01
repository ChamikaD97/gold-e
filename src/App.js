import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Dashboard from "./pages/Dashboard";
import HeaderComponent from "./components/Header";
import MainLayout from "./components/MainLayout";
import EmployeeManagementPage from "./pages/Employees";

const LayoutWithHeader = () => (
  <>
    <HeaderComponent />
    <MainLayout />
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginForm />} />

        {/* Protected Routes inside layout */}
        <Route element={<LayoutWithHeader />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/employees" element={<EmployeeManagementPage />} />
          <Route path="/404" element={<div>404 - Page Not Found</div>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
