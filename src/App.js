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
import LeafSupply from "./pages/LeafCountChart";
import { App as AntdApp } from 'antd';
import MissingCards from "./pages/Missing Cards";
import LeafSupplyByDateRange from "./pages/LeafSupplyByDateRange";
import Prediction from "./pages/Prediction";

const LayoutWithHeader = () => (
  <>
    <HeaderComponent />
    <MainLayout />
  </>
);

const App = () => {
  return (
    <AntdApp> {/* ✅ Wrap with Ant Design context provider */}


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
            <Route path="/leaf/supply" element={<LeafSupply />} />

            <Route path="/leaf/dailyLeafSupply" element={<LeafSupplyByDateRange
            />} />
            <Route path="/leaf/missingCards" element={<MissingCards />} />

            <Route path="/meal" element={<MealManagement />} />

            <Route path="/suppliers/routes" element={<Suppliers />} />
   <Route path="/factory-targets/prediction" element={<Prediction />} />


            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/supplier/info" element={<SupplierInfo />} />
            {/* 404 Route */}

            <Route path="/404" element={<div>404 - Page Not Found</div>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>

        </Routes>
      </Router>
    </AntdApp>

  );
};

export default App;
