import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout, Modal } from "antd";
import MainLayout from "./components/MainLayout";
import LoginForm from "./pages/LoginForm";
import RegistrationForm from "./pages/RegistrationForm";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import TeaLine from "./pages/TeaLine";
import LeafSupply from "./pages/LeafSupply";
import Plan from "./pages/Plan";
import SelectedUser from "./pages/SelectedUser";
import SupplierLeafData from "./pages/SupplierLeafData";
import Splash from "./pages/Splash";
import Targets from "./pages/Targets";
import FieldOfficerReports from "./pages/FieldOfficerReports";
import Employees from "./pages/Employees.js"; // New common employee page
import EmployeeCategory from "./pages/EmployeeCategory"; // For executive/non-executive
import NotFound from "./pages/NotFound"; // For 404 handling

const { Content } = Layout;

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  return (
    <Router>  <MainLayout>
      <Routes>



        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/splash" element={<Splash />} />

        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />


          <Route path="/employees" element={<Employees />}>
            <Route path="executive" element={<EmployeeCategory type="executive" />} />
            <Route path="non-executive" element={<EmployeeCategory type="non-executive" />} />
            <Route path=":category/:id" element={<SelectedUser />} />
          </Route>


          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/fieldOfficers" element={<FieldOfficerReports />} />
          <Route path="/fieldOfficers/:Id" element={<FieldOfficerReports />} />
          <Route path="/routes" element={<TeaLine />} />
          <Route path="/leafSupply" element={<LeafSupply />} />
          <Route path="/yearlyPlan" element={<Plan />} />
          <Route path="/targets" element={<Targets />} />
          <Route path="/user/:comNum" element={<SelectedUser />} />

          {/* Store/Finance */}
          <Route path="/store" element={<div>Store Management</div>} />
          <Route path="/advance" element={<div>Advance Management</div>} />
          <Route path="/loan-management" element={<div>Loan Management</div>} />

          {/* Fallback routes */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>

      <Modal
        title={modalData.title}
        open={isModalVisible}
        footer={null}
        centered
        onCancel={() => setIsModalVisible(false)}
        mask={false}
        style={{ textAlign: "center" }}
      >
        <p>{modalData.description}</p>
      </Modal>
    </MainLayout>
    </Router>
  );
};

export default App;