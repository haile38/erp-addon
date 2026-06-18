import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardPage from "../pages/Dashboard";
import TaskPage from "../pages/Task/TaskPage";
import KPIPage from "../pages/KPI";
import SettingPage from "../pages/Setting";
import LoginPage from "../pages/Login";
import Mainlayout from "../layouts/Mainlayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "tasks",
        element: <TaskPage />,
      },
      {
        path: "kpi",
        element: <KPIPage />,
      },
      {
        path: "settings",
        element: <SettingPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);