import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout"; // Import MainLayout component
import { Modal } from "antd";
import LoginForm from "./pages/LoginForm";
import RegistrationForm from "./pages/RegistrationForm";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import TeaLine from "./pages/TeaLine";
import LeafSupply from "./pages/LeafSupply";
import Plan from "./pages/Plan";
import SelectedUser from "./pages/SelectedUser";
import FieldOfficers from "./pages/FieldOfficers";
import SupplierLeafData from "./pages/SupplierLeafData";
import Splash from "./pages/Splash";
import Targets from "./pages/Targets";

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/fieldOfficers" element={<FieldOfficers />} />
          <Route path="/routes" element={<TeaLine />} />
          <Route path="/leafSupply" element={<LeafSupply />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/yearlyPlan" element={<Plan />} />
          <Route path="/targets" element={<Targets />} />
          
          <Route path="/user/:comNum" element={<SelectedUser />} />
          <Route path="/supplier/:Id" element={<SupplierLeafData />} />
        </Routes>
        <Modal
          title={modalData.title}
          open={isModalVisible}
          footer={null}
          centered
          onCancel={() => setIsModalVisible(false)}
          mask={false} // Removes background darkening effect
          style={{ textAlign: "center" }}
        >
          <p>{modalData.description}</p>
        </Modal>
      </MainLayout>
    </Router>
  );
};

export default App;
