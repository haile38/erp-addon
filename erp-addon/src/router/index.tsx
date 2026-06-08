// src/router/index.tsx

import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../pages/Dashboard";
import TaskPage from "../pages/Task";
import KPIPage from "../pages/KPI";
import SettingPage from "../pages/Setting";
import LoginPage from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/tasks",
    element: <TaskPage />,
  },
  {
    path: "/kpi",
    element: <KPIPage />,
  },
  {
    path: "/settings",
    element: <SettingPage />,
  },
  {
    path: "/",
    element: <LoginPage />,
  },
    {
    path: "/login",
    element: <LoginPage />,
  },

]);