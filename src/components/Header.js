import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  TeamOutlined,
  ShopOutlined,
  SolutionOutlined,
  FundOutlined,
  HighlightOutlined,
  WalletOutlined
} from "@ant-design/icons";
import { Archive } from "@mui/icons-material";

const { Header } = Layout;
const { SubMenu } = Menu;

const HeaderComponent = () => {
  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        zIndex: 1,
        width: "100%",
        padding: 0,
        lineHeight: "64px",
        background: "#001529"
      }}
    >
      <Menu theme="dark" mode="horizontal" style={{ lineHeight: "64px" }}>
        <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="suppliers" icon={<SolutionOutlined />}>
          <Link to="/leaf-count">Suppliers</Link>
        </Menu.Item>

        <Menu.Item key="employees" icon={<TeamOutlined />}>
          <Link to="/employees">Employees</Link>
        </Menu.Item>

        <Menu.Item key="factory-targets" icon={<Archive />}>
          <Link to="/factory-targets">Factory Targets</Link>
        </Menu.Item>

        <Menu.Item key="leaf-count" icon={<FundOutlined />}>
          <Link to="/leaf-count">Leaf Count</Link>
        </Menu.Item>

        <Menu.Item key="white-board" icon={<HighlightOutlined />}>
          <Link to="/white-board">White Board</Link>
        </Menu.Item>

        <Menu.Item key="store" icon={<ShopOutlined />}><Link to="/store">Store</Link></Menu.Item>
        <Menu.Item key="advance" icon={<WalletOutlined />}>
          <Link to="/advance">Advance</Link>
        </Menu.Item>
        <Menu.Item key="loan-management" icon={<SettingOutlined />}><Link to="/loan-management">Loan Management</Link></Menu.Item>
      </Menu>
    </Header>
  );
};

export default HeaderComponent;
