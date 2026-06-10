import {
  DashboardOutlined,
  CheckSquareOutlined,
  LineChartOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

export const menuItems = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/tasks",     icon: <CheckSquareOutlined />, label: "Tasks" },
  { key: "/kpi",       icon: <LineChartOutlined />,   label: "KPI" },
  { key: "/settings",  icon: <SettingOutlined />,     label: "Settings" },
  { key: "/logout",    icon: <LogoutOutlined />,      label: "Logout" } 
];