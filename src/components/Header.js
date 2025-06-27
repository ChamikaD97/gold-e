import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  SolutionOutlined,
  TeamOutlined,
  FundOutlined,
  ShopOutlined,
  CoffeeOutlined,  // ✅ Replacing EmojiFoodBeverageOutlined
  CarOutlined
} from "@ant-design/icons";

// ✅ Replace this line: Archive icon from Ant Design, not MUI

import icon from "../images/logo.ico";
import { Archive } from "@mui/icons-material";

const { Header } = Layout;
const { SubMenu } = Menu;

const HeaderComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        zIndex: 1,
        width: "100%",
        padding: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* ✅ Logo and Name */}
      <div
        style={{
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <img
          src={icon}
          alt="SLMS"
          style={{ width: 24, height: 24, marginRight: 8 }}
        />
        <span style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
          SLMS
        </span>
      </div>

      {/* ✅ Menu */}
      <Menu theme="dark" mode="horizontal" style={{ flex: 1 }}>
        <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>

        <SubMenu key="suppliers" icon={<SolutionOutlined />} title="Suppliers">
          <Menu.Item key="supplier-info">
            <Link to="/supplier/info">Supplier Info</Link>
          </Menu.Item>
          <Menu.Item key="route-suppliers">
            <Link to="/suppliers/routes">Route Suppliers</Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="employees" icon={<TeamOutlined />}>
          <Link to="/employees">Employees</Link>
        </Menu.Item>

        <SubMenu key="factory-targets" icon={<Archive />} title="Targets & Achievements">
          <Menu.Item key="target-prediction">
            <Link to="/factory-targets/prediction">Target Prediction</Link>
          </Menu.Item>
          <Menu.Item key="officer-targets">
            <Link to="/factory-targets/officer">Officer Targets</Link>
          </Menu.Item>
          <Menu.Item key="line-targets">
            <Link to="/factory-targets/line">Line Targets</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="leaf" icon={<FundOutlined />} title="Leaf">
          <Menu.Item key="leaf-supply">
            <Link to="/leaf/supply">Leaf Supply</Link>
          </Menu.Item>
          <Menu.Item key="leaf-counts">
            <Link to="/leaf/count">Leaf Counts</Link>
          </Menu.Item>
          <Menu.Item key="missing-cards">
            <Link to="/leaf/missingCards">Missing Cards</Link>
          </Menu.Item>
          <Menu.Item key="missing-cards">
            <Link to="/leaf/dailyLeafSupply">Leaf Supply</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="store" icon={<ShopOutlined />}>
          <Link to="/store">Store</Link>
        </Menu.Item>

        <Menu.Item key="meal" icon={<CoffeeOutlined />}>
          <Link to="/meal">Meal Management</Link>
        </Menu.Item>

        <Menu.Item key="vehicles" icon={<CarOutlined />}>
          <Link to="/vehicles">Loan & Advance</Link>
        </Menu.Item>
      </Menu>

      {/* ✅ Logout Button */}
      <div style={{ padding: "0 16px" }}>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default HeaderComponent;
