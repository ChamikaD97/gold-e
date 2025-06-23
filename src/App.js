import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Dashboard from "./pages/Dashboard";
import HeaderComponent from "./components/Header";
import MainLayout from "./components/MainLayout";
import EmployeeManagementPage from "./pages/Employees";
import FactoryTargetAchievemenets from "./pages/FactoryTargetAchievemenets";
import LeafCountChart from "./pages/LeafCountChart";
import RegisterPage from "./pages/RegistrationForm";
import MealManagement from "./pages/MealManagement";
import Suppliers from "./pages/Suppliers"; // Assuming this is the correct import for the Suppliers page
import Vehicles from "./pages/Vehicles";
import SupplierInfo from "./pages/SupplierInfo";

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

        {/* ✅ Public Routes without header */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ Protected Routes with header */}
        <Route element={<LayoutWithHeader />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/factory-targets" element={<FactoryTargetAchievemenets />} />
          <Route path="/employees" element={<EmployeeManagementPage />} />
          <Route path="/leaf-count" element={<LeafCountChart />} />

          <Route path="/meal" element={<MealManagement />} />
          
          <Route path="/suppliers" element={<Suppliers />} />


          <Route path="/vehicles" element={<Vehicles />} />

          {/* 404 Route */}
          <Route path="/supplier/:supplierId" element={<SupplierInfo />} />

          <Route path="/404" element={<div>404 - Page Not Found</div>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
