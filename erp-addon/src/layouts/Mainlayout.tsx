import React from "react";
import { Layout, Menu, Button, Typography, Spin, Flex } from "antd";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import  {menuItems} from "../layouts/MenuItem";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const Mainlayout: React.FC = () => {
  const {
  userInfo,
  loading,
  logout,
  isAuthenticated,
} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  // Redirect to login if not authenticated
    if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }



  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "16px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
          <Text strong style={{ fontSize: "18px", color: "#1677ff" }}>
            QNote ERP
          </Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, borderRight: 0, marginTop: "8px" }}
        />

        <div style={{ padding: "16px", borderTop: "1px solid #f0f0f0" }}>
          <Flex vertical align="center" gap="small" style={{ marginBottom: "16px" }}>
            <Text type="secondary" ellipsis style={{ maxWidth: "100%" }}>
              {userInfo?.name}
            </Text>
          </Flex>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={async () => { await logout(); }}
            block
          >
            Logout
          </Button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: 200 }}>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Mainlayout;
