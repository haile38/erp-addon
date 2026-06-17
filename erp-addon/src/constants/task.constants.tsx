import React from "react";
import {
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EllipsisOutlined,
  ExportOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export type TaskStatus = "pending" | "inprogress" | "done" | "cancelled";

export interface Task {
  id: string;
  merchantId: string;
  merchantName: string;
  issueTypes: string[];
  contactMethods: string[];
  status: TaskStatus;
  createdAt: string;
  miVersion?: string;
  device?: string;
  disconnectTime?: string;
}

export const ISSUE_OPTIONS = [
  // { label: "Payment error", value: "payment_error" },
  { label: "Printer error", value: "print_error" },
  { label: "Terminal disconnected", value: "connection_error" },
  // { label: "Out of lincese", value: "software_update" },
  // { label: "POS error", value: "device_support" },
];

export const CONTACT_METHOD_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; border: string; activeBg: string }> = {
  Inbox: { label: "Inbox", icon: <MailOutlined />, color: "#8b5cf6", border: "#8b5cf6", activeBg: "#f3e8ff" },
  Inbound: { label: "Call", icon: <PhoneOutlined />, color: "#10b981", border: "#10b981", activeBg: "#d1fae5" },
  Facetime: { label: "Facetime", icon: <VideoCameraOutlined />, color: "#6b7280", border: "#d1d5db", activeBg: "#f3f4f6" },
  Crisp: { label: "Crisp", icon: <MessageOutlined />, color: "#f59e0b", border: "#f59e0b", activeBg: "#fef3c7" },
  Other: { label: "Other", icon: <EllipsisOutlined />, color: "#6b7280", border: "#d1d5db", activeBg: "#f3f4f6" },
  Outbound: { label: "Outbound", icon: <ExportOutlined />, color: "#64748b", border: "#cbd5e1", activeBg: "#f1f5f9" },
};

export const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  pending: { label: "Pending", icon: <ClockCircleOutlined />, color: "#d97706", bg: "#fffbeb", border: "#fbbf24" },
  inprogress: { label: "Processing", icon: <SyncOutlined />, color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
  done: { label: "Completed", icon: <CheckCircleOutlined />, color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
  cancelled: { label: "Cancelled", icon: <StopOutlined />, color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
};

export const MI_VERSION_OPTIONS = [
  { label: "0.0.3.3", value: "0.0.3.3" },
  { label: "2.4.2.0", value: "2.4.2.0" },
  { label: "2.2.2.0", value: "2.2.2.0" },
   { label: "2.4.5.0", value: "2.4.5.0" },
  { label: "2.4.16.0", value: "2.4.16.0" },
  { label: "2.4.18.0", value: "2.4.18.0" },


];

export const DEVICE_OPTIONS = [
  { label: "Clover Mini", value: "clover_mini" },
  { label: "Clover Flex", value: "clover_flex" },
  { label: "Clover Compact", value: "clover_compact" },
  { label: "Pax A920", value: "pax_a920" },
  { label: "Pax A80", value: "pax_a80" },
  { label: "Pax Aries 8", value: "pax_aries8" },
  { label: "Dejavoo Z11", value: "dejavoo Z11" },
];


export const RESOLVE_OPTIONS = [
  { key: "restart_app", label: "Restart app" },
  { key: "reset_network", label: "Reset network" },
  { key: "reconnect_terminal", label: "Reconnect terminal" },
  { key: "update_config", label: "Update config" },
  { key: "escalate_l2", label: "Escalate to L2" },
  { key: "resolved", label: "Resolved" },
];


export const TICKET_ATTRIBUTES = [
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "32", "name": "Training Deployment", "color": "#0d5415" },
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "31", "name": "Transfer Social/MKT", "color": "#f59e0b" },
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "30", "name": "Escalate UAT/DEV", "color": "#f59e0b" },
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "29", "name": "Transfer Sale/RM", "color": "#6366f1" },
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "28", "name": "Payment Processing", "color": "#6366f1" },
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "27", "name": "System Performance", "color": "#ec4899" },
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "26", "name": "Configuration", "color": "#06b6d4" },
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "25", "name": "Hardware", "color": "#10b981" },
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "24", "name": "Account & Billing", "color": "#8b5cf6" },
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "23", "name": "Network/MI", "color": "#3b82f6" },
  { "type": "ticket.support", "metaType": "Categories", "order": 10, "id": "22", "name": "Bug/Issue", "color": "#ef4444" },
  { "type": "ticket.support", "metaType": "Categories", "order": null, "id": "cc901e844c958c7a9f66019e23dbd828", "name": "At Risk/Request Cancel", "color": "#dc0909" }
];

export const TICKET_PRIORITY = [
  { color: "#fd7e14", id: "3", metaType: "Priority", name: "High", order: null, type: "ticket" },
  { color: "#fd7e14", id: "2", metaType: "Priority", name: "Medium", order: null, type: "ticket" },
  { color: "#fd7e14", id: "1", metaType: "Priority", name: "Low", order: null, type: "ticket" },
];

export const TICKET_TYPE = [
  { id: "4", name: "Onboarding", color: null },
  { id: "2", name: "Support", color: null },
  { id: "5", name: "Merchant Marketing", color: null },
  { id: "3", name: "Development", color: null },
  { id: "1", name: "General", color: null },
];

export const TICKET_DIRECTION = [
  { "type": "ticket.support", "metaType": "Direction", "order": 10, "id": "38", "name": "Others", "color": "#ec4899" },
  { "type": "ticket.support", "metaType": "Direction", "order": 10, "id": "37", "name": "Facetime", "color": "#8b5cf6" },
  { "type": "ticket.support", "metaType": "Direction", "order": 10, "id": "36", "name": "Inbox", "color": "#ef4444" },
  { "type": "ticket.support", "metaType": "Direction", "order": 10, "id": "35", "name": "Crisp", "color": "#f59e0b" },
  { "type": "ticket.support", "metaType": "Direction", "order": 10, "id": "34", "name": "Inbound", "color": "#10b981" },
  { "type": "ticket.support", "metaType": "Direction", "order": 10, "id": "33", "name": "Outbound", "color": "#6366f1" }
];