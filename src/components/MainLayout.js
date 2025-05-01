import React from "react";
import { Layout, Typography } from "antd";
import { useLocation, Outlet } from "react-router-dom";
import background from "../images/background.jpg";

const { Content } = Layout;
const { Title, Text } = Typography;

const MainLayout = () => {
  const location = useLocation();
  const isNotFound = location.pathname === "/404";

  const NotFoundTextOnly = () => (
    <div
      style={{
        textAlign: "center",
        color: "#fff",
        textShadow: "0 0 10px rgba(0,0,0,0.7)",
        animation: "fadeIn 1s ease-in-out"
      }}
    >
      <Title
        style={{
          fontSize: "140px",
          marginBottom: 0,
          fontWeight: "900",
          color: "#ffffff",
        }}
      >
        404
      </Title>
      <Text
        style={{
          fontSize: "20px",
          color: "rgba(255, 255, 255, 0.85)",
          letterSpacing: "1px"
        }}
      >
        Sorry, the page you visited does not exist.
      </Text>
    </div>
  );

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <Content
        style={{
          padding: "0 50px",
          minHeight: "100vh",
          paddingTop: "50px"
        }}
      >
        <div
          style={{
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          {isNotFound ? <NotFoundTextOnly /> : <Outlet />}
        </div>
      </Content>
    </Layout>
  );
};

export default MainLayout;
