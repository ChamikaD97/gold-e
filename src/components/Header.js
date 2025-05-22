import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  SolutionOutlined,
  TeamOutlined,
  FundOutlined,
  HighlightOutlined,
  ShopOutlined,
  WalletOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Archive, EmojiFoodBeverageOutlined, FoodBankOutlined, FoodBankSharp, MedicalInformation } from "@mui/icons-material";
import icon from "../images/logo.ico";

const { Header } = Layout;

const HeaderComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <Header style={{ position: "fixed", top: 0, zIndex: 1, width: "100%", padding: 0, display: "flex", alignItems: "center" }}>
      {/* ✅ Logo and Name */}
      <div style={{ color: "white", display: "flex", alignItems: "center", padding: "0 16px" }}>
        <img
          src={icon}
          alt="SLMS"
          style={{ width: 24, height: 24, marginRight: 8 }}
        />
        <span style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
          SLMS
        </span>
      </div>

      {/* Menu */}
      <Menu theme="dark" mode="horizontal" style={{ flex: 1 }}>
        <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="suppliers" icon={<SolutionOutlined />}>
          <Link to="/suppliers">Suppliers</Link>
        </Menu.Item>
        <Menu.Item key="employees" icon={<TeamOutlined />}>
          <Link to="/employees">Employees</Link>
        </Menu.Item>
        <Menu.Item key="factory-targets" icon={<Archive />}>
          <Link to="/factory-targets">Targets & Achievements</Link>
        </Menu.Item>
        <Menu.Item key="leaf-count" icon={<FundOutlined />}>
          <Link to="/leaf-count">Leaf Count</Link>
        </Menu.Item>
        {/* <Menu.Item key="white-board" icon={<HighlightOutlined />}>
          <Link to="/white-board">White Board</Link>
        </Menu.Item> */}
        <Menu.Item key="store" icon={<ShopOutlined />}>
          <Link to="/store">Store</Link>
        </Menu.Item>
         <Menu.Item key="meal" icon={<EmojiFoodBeverageOutlined />}>
          <Link to="/meal">Meal Management</Link>
        </Menu.Item>
        <Menu.Item key="advance" icon={<WalletOutlined />}>
          <Link to="/advance">Loan & Advance</Link>
        </Menu.Item>
        {/* <Menu.Item key="loan-management" icon={<SettingOutlined />}>
          <Link to="/loan-management">Loan Management</Link>
        </Menu.Item> */}
      </Menu>

      {/* Logout Button */}
      <div style={{ padding: "0 16px" }}>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default HeaderComponent;
