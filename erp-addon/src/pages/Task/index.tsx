import { useState, useRef } from "react";
import { Select, Spin, TimePicker, message } from "antd";
import { PlusOutlined, ShopOutlined, BugOutlined, PhoneOutlined, MenuOutlined } from "@ant-design/icons";
import { getListMerchant } from "../../api/task.api";
import TaskList from "./TaskList";

import "./task.scss";
import { CONTACT_METHOD_CONFIG, type Task, type TaskStatus, STATUS_CONFIG, ISSUE_OPTIONS, MI_VERSION_OPTIONS, DEVICE_OPTIONS } from "../../constants/task.constants";

interface Merchant {
  id: string;
  businessName: string;
  customerCode: string;
}

interface SelectOption {
  label: string;
  value: string;
}

const defaultFilter = {
  accountManager: null, from: null, isDemoAccount: null, license: null,
  page: 1, pageSize: 25, partnerCode: null, search: null,
  sortBy: "CreateAt", sortOrder: "desc", status: null, tabType: "All",
  to: null, workstationId: "1",
};

// ─── Main Component ──────────────────────────────────────────────────
const TaskPage = () => {
  const [filter] = useState(defaultFilter);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<string>();
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [miVersion, setMiVersion] = useState<string>();
  const [device, setDevice] = useState<string>();
  const [disconnectTime, setDisconnectTime] = useState<Dayjs | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("pending");


  const [tasks, setTasks] = useState<Task[]>([]);
  
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchMerchant = (value: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!value.trim()) {
      setOptions([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const searchParams = { ...filter, search: value };
        const response = await getListMerchant(searchParams);
        const merchants = response?.active?.data ?? [];

        setOptions(
          merchants.map((item: Merchant) => ({
            label: `${item.businessName} ${item.customerCode ? `(${item.customerCode})` : ""}`,
            value: item.id,
          }))
        );
      } catch (error) {
        console.error("Can not merchant:", error);
      } finally {
        setLoading(false);
      }
    }, 2100);
  };

  
  const handleToggleContact = (key: string) => {
    setSelectedContacts((prev) =>
      prev.includes(key) 
        ? prev.filter((item) => item !== key) 
        : [...prev, key]                      
    );
  };

  const handleAddTask = () => {
    if (!selectedMerchant) return message.warning("Please choose a salon first");
    if (selectedIssues.length === 0) return message.warning("Please select at least one issue type.");
    if (!selectedContacts.length) return message.warning("Please select a contact method."); 

    // (Tùy chọn) Bắt buộc điền chi tiết nếu chọn Terminal disconnected
    const isTerminalError = selectedIssues.includes("connection_error");
    if (isTerminalError) {
      if (!miVersion || !device || !disconnectTime) {
        return message.warning("Please fill in all Terminal details (Version, Device, Time).");
      }
    }

    const merchantName = options.find((o) => o.value === selectedMerchant)?.label ?? "";
    const newTask: Task = {
      id: Date.now().toString(),
      merchantId: selectedMerchant,
      merchantName,
      issueTypes: selectedIssues,
      contactMethods: selectedContacts, 
      status: selectedStatus,
      createdAt: new Date().toISOString(),
      // --- LƯU THÊM DỮ LIỆU ---
      miVersion: isTerminalError ? miVersion : undefined,
      device: isTerminalError ? device : undefined,
      disconnectTime: isTerminalError && disconnectTime ? disconnectTime.format("HH:mm") : undefined,
    };

    setTasks((prev) => [newTask, ...prev]);
    setSelectedMerchant(undefined);
    setSelectedIssues([]);
    setSelectedContacts([]);
    setSelectedStatus("pending");
    // --- RESET FORM ---
    setMiVersion(undefined);
    setDevice(undefined);
    setDisconnectTime(null);
    
    message.success("Add task successfully!");
  };

  return (
    <div className="task-page-container">
      {/* Header */}
      <div className="page-header">
        <div className="icon-box"><BugOutlined /></div>
        <div>
          <div className="title">Task Manager</div>
          <div className="subtitle">Add your note quickly</div>
        </div>
      </div>

      {/* Form Card */}
      <div className="card">
        {/* Chọn tiệm */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-title"><ShopOutlined style={{ color: "#6366f1" }} />Select Merchant</div>
          <Spin spinning={loading}>
            <Select
              style={{ width: "100%" }}
              placeholder="Enter Name or Phone Number of salon"
              showSearch allowClear
              value={selectedMerchant}
              options={options}
              onChange={(val) => setSelectedMerchant(val)}
              onSearch={handleSearchMerchant}
              filterOption={false}
              showArrow={false}
              notFoundContent={loading ? <Spin size="small" /> : "Can not find merchant"}
            />
          </Spin>
        </div>

        {/* Loại vấn đề */}
        {/* Loại vấn đề */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-title"><BugOutlined style={{ color: "#f59e0b" }} /> Type of problem</div>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select problem..."
              options={ISSUE_OPTIONS}
              value={selectedIssues}
              onChange={(val) => setSelectedIssues(val)}
              allowClear
            />

            {/* KIỂM TRA ĐIỀU KIỆN: HIỂN THỊ CHI TIẾT TERMINAL NẾU CHỌN "connection_error" */}
            {selectedIssues.includes("connection_error") && (
              <div style={{ 
                marginTop: 12, padding: 16, background: "#f8fafc", 
                borderRadius: 12, border: "1px dashed #cbd5e1" 
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 12 }}>
                  Terminal Disconnected Details
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Version M.I</div>
                    <Select 
                      options={MI_VERSION_OPTIONS} 
                      value={miVersion} 
                      onChange={setMiVersion} 
                      placeholder="Select version"
                      style={{ width: "100%" }} 
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Device</div>
                    <Select 
                      options={DEVICE_OPTIONS} 
                      value={device} 
                      onChange={setDevice} 
                      placeholder="Select device"
                      style={{ width: "100%" }} 
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Disconnect Time</div>
                    <TimePicker 
                      format="HH:mm" 
                      value={disconnectTime} 
                      onChange={setDisconnectTime} 
                      placeholder="Select time"
                      style={{ width: "100%" }} 
                    />
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Contact Method */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-title" style={{ marginBottom: 10 }}><PhoneOutlined style={{ color: "#f59e0b" }} />Contact Method</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {Object.entries(CONTACT_METHOD_CONFIG).map(([key, cfg]) => {
              const active = selectedContacts.includes(key); // <--- Kiểm tra xem key có trong mảng không
              return (
                <button
                  key={key}
                  onClick={() => handleToggleContact(key)} // <--- Gọi hàm Toggle thay vì Set trực tiếp
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: active ? cfg.activeBg : "#fff",
                    color: cfg.color,
                    border: `1px solid ${active ? cfg.color : cfg.border}`,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cfg.icon} {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trạng thái */}
        <div style={{ marginBottom: 16 }}>
          <div className="section-title" style={{ marginBottom: 10 }}><MenuOutlined style={{ color: "#f59e0b" }} />Implementation status</div>
          <div className="status-grid">
            {(Object.entries(STATUS_CONFIG) as [TaskStatus, typeof STATUS_CONFIG[TaskStatus]][]).map(([key, cfg]) => {
              const active = selectedStatus === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key)}
                  className={`status-btn ${active ? "active" : ""}`}
                  style={{
                    border: `1.5px solid ${active ? cfg.border : "#e5e7eb"}`,
                    background: active ? cfg.bg : "#fafafa",
                    color: active ? cfg.color : "#6b7280",
                  }}
                >
                  {cfg.icon} {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button onClick={handleAddTask} className="submit-btn">
          <PlusOutlined /> Add task
        </button>

      </div>

      {/* Gọi Component TaskList độc lập */}
      <TaskList tasks={tasks} />
      
    </div>
  
  );
};


export default TaskPage;