import React from "react";
import { Layout } from "antd";
import HeaderComponent from "./Header";
import background from "../images/background.jpg"; // Adjust the path accordingly
import { useLocation } from "react-router-dom"; // Import useLocation here

const { Content, Footer } = Layout;

const MainLayout = ({ children }) => {
  const location = useLocation(); // Hook to get the current location
  const isLoginPage = location.pathname === "/"; // Check if the route is the login page

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Layout className="layout" style={{ flex: 1, position: "relative" }}>
        {/* Render Header only if not on the login page */}
        {!isLoginPage && <HeaderComponent />}
        <div
          style={{
            flex: 1,
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Layout
            style={{
              padding: "0 50px",
              marginTop: 10,
              backgroundColor: "transparent",
              height: "100%",
            }}
          >
            <Content style={{ minHeight: 280 }}>
              {children}
            </Content>
          </Layout>
        </div>
      </Layout>
    </div>
  );
};

export default MainLayout;
