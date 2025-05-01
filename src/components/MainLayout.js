import React from "react";
import { Layout, Typography } from "antd";
import { useLocation, Outlet } from "react-router-dom";
import background from "../images/background.jpg";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const MainLayout = () => {
  const location = useLocation();
  const isNotFound = location.pathname === "/404";

  const NotFoundTextOnly = () => (
    <div style={{ textAlign: "center", color: "#fff" ,animation: "fadeIn 1s ease-in-out"}}>
      <Title style={{ fontSize: "120px", marginBottom: 0, color: "#fff" }}>404</Title>
      <Text style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)" }}>
        Sorry, the page you visited does not exist
      </Text>
    </div>
  );

  return (
    <Layout
      style={{
        display: "grid",
        gridTemplateRows: "64px 1fr",
        minHeight: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <Header style={{ background: "rgba(0,0,0,0.6)", padding: "0 24px" }}>
        <Title level={4} style={{ color: "#fff", margin: 0, lineHeight: "64px" }}>
          🌿 Company Portal
        </Title>
      </Header>

      <Content style={{ padding: "24px", overflowY: "auto" }}>
        <div
          style={{
            minHeight: "100%",
            display: "flex",
            alignItems: isNotFound ? "center" : "flex-start",
            width: "100%",
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
