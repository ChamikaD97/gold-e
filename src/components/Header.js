import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  HomeSharp,
  TrainRounded,
  TrainSharp,
  Warning,
  Notifications,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, setSelectedKey, userToken } from "../redux/authSlice"; // Adjust path if needed

const { Header } = Layout;

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const { selectedKey } = useSelector((state) => state.auth);
  const location = useLocation();

  // Sync menu selection with the current route on mount
  React.useEffect(() => {
    const pathToKey = {
      "/dashboard": "1",
      "/suppliers": "2",
      "/lines": "3",
      "/fieldOfficers": "4",
      "/leafSupply": "5",
      "/users": "6",
      "/yearlyPlan":'7'
    };
    dispatch(setSelectedKey(pathToKey[location.pathname] || "0"));
  }, [location.pathname, dispatch]);

  // Handle logout
  const handleLogout = () => {
    dispatch(login());
    dispatch(userToken());
    dispatch(setSelectedKey("0")); // Reset selected key or perform any other logout actions
    navigate("/"); // Redirect to login page
  
    
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={(e) => dispatch(setSelectedKey(e.key))}
        style={{ lineHeight: "64px" }} // Aligning items vertically
      >
        <Menu.Item key="1" >
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        {/* <Menu.Item key="2" >
          <Link to="/suppliers">Suppliers</Link>
        </Menu.Item> */}
        {/* <Menu.Item key="3" >
          <Link to="/routes">Routes</Link>
        </Menu.Item> */}
        <Menu.Item key="4">
          <Link to="/fieldOfficers">Field Officers</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/targets">Annual Targets</Link>
        </Menu.Item>
        <Menu.Item key="7">
          <Link to="/yearlyPlan">2025 Yearly Plan</Link>
        </Menu.Item>
        {/* <Menu.Item key="4" icon={<Warning fontSize="35" />}>
          <Link to="/failures">Failures</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<Warning fontSize="35" />}>
          <Link to="/trips">Trips</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<VerifiedUserOutlined fontSize="35" />}>
          <Link to="/users">Drivers</Link>
        </Menu.Item>  */}
      
        {/* Logout Menu Item - Floating to the right */}
        <Menu.Item
          key="8"
          icon={<Notifications />}
          onClick={handleLogout}
          style={{
            position: "absolute",
            right: 0, // Float it to the right
            top: "50%", // Vertically center it
            transform: "translateY(-50%)", // Adjust for perfect centering
          }}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default HeaderComponent;
