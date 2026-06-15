import { useState, useRef } from "react";
import type { Dayjs } from "dayjs";
import { Select, Spin, TimePicker, message } from "antd";
import {
  PlusOutlined, ShopOutlined, BugOutlined,
  PhoneOutlined, EditOutlined, CheckOutlined,
} from "@ant-design/icons";
import { getListMerchant } from "../../api/task.api";
import TaskList from "./TaskList";
import "./task.scss";
import {
  CONTACT_METHOD_CONFIG,
  type Task,
  ISSUE_OPTIONS,
  MI_VERSION_OPTIONS,
  DEVICE_OPTIONS,
  RESOLVE_OPTIONS
} from "../../constants/task.constants";

// ─── Types ────────────────────────────────────────────────────────────
interface Merchant {
  id: string;
  businessName: string;
  customerCode: string;
}

interface SelectOption {
  label: string;
  value: string;
}


// ─── Inline-editable field ────────────────────────────────────────────
interface EditableFieldProps {
  label: string;
  icon: React.ReactNode;
  value?: string;
  placeholder?: string;
  type?: "text" | "select" | "time";
  options?: { label: string; value: string }[];
  onChange: (val: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label, icon, value, placeholder = "—", type = "text", options = [], onChange,
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  const startEdit = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const stopEdit = () => setEditing(false);

  const displayValue = () => {
    if (!value) return <span style={{ color: "#94a3b8", fontStyle: "italic" }}>{placeholder}</span>;
    if (type === "time") {
      // Convert "HH:mm" → "5:08 PM"
      const [h, m] = value.split(":");
      const hh = parseInt(h, 10);
      return `${hh % 12 || 12}:${m} ${hh >= 12 ? "PM" : "AM"}`;
    }
    if (type === "select") {
      return options.find((o) => o.value === value)?.label ?? value;
    }
    return value;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "0.5px solid #f1f5f9",
        gap: 10,
      }}
    >
      {/* Key */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 130, fontSize: 13, color: "#64748b" }}>
        {icon} {label}
      </div>

      {/* Value / Edit control */}
      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#1e293b" }}>
        {editing ? (
          <>
            {type === "select" && (
              <select
                ref={inputRef as React.RefObject<HTMLSelectElement>}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                onBlur={stopEdit}
                style={{
                  fontSize: 13, fontFamily: "inherit", border: "none",
                  background: "transparent", outline: "none", color: "#1e293b",
                  fontWeight: 500, cursor: "pointer", width: "100%",
                }}
              >
                <option value="" disabled>Select...</option>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
            {type === "time" && (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="time"
                defaultValue={value ?? ""}
                onBlur={(e) => { onChange(e.target.value); stopEdit(); }}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                style={{
                  fontSize: 13, fontFamily: "inherit", border: "none",
                  background: "transparent", outline: "none",
                  color: "#1e293b", fontWeight: 500, cursor: "text",
                }}
              />
            )}
            {type === "text" && (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                defaultValue={value ?? ""}
                onBlur={(e) => { onChange(e.target.value); stopEdit(); }}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                placeholder="Type here..."
                style={{
                  fontSize: 13, fontFamily: "inherit", border: "none",
                  background: "transparent", outline: "none",
                  color: "#1e293b", fontWeight: 500, width: "100%",
                }}
              />
            )}
          </>
        ) : (
          <span
            onClick={startEdit}
            title="Click to edit"
            style={{
              display: "inline-block",
              borderRadius: 6,
              padding: "1px 6px",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {displayValue()}
          </span>
        )}
      </div>

      {/* Edit / Done icon */}
      <span
        onClick={editing ? stopEdit : startEdit}
        style={{ color: "#94a3b8", cursor: "pointer", fontSize: 13 }}
        title={editing ? "Done" : "Edit"}
      >
        {editing ? <CheckOutlined style={{ color: "#6366f1" }} /> : <EditOutlined />}
      </span>
    </div>
  );
};


// ─── Main Component ───────────────────────────────────────────────────
const defaultFilter = {
  accountManager: null, from: null, isDemoAccount: null, license: null,
  page: 1, pageSize: 25, partnerCode: null, search: null,
  sortBy: "CreateAt", sortOrder: "desc", status: null, tabType: "All",
  to: null, workstationId: "1",
};

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
  const [disconnectTimeStr, setDisconnectTimeStr] = useState<string>(); // "HH:mm" for preview
  const [resolveKeys, setResolveKeys] = useState<string[]>([]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Helpers ──
  const merchantLabel = options.find((o) => o.value === selectedMerchant)?.label ?? "";
  const isTerminalError = selectedIssues.includes("connection_error");
  const titleLabel = selectedIssues.length > 0
    ? "Q_" + selectedIssues.map((v) => ISSUE_OPTIONS.find((o) => o.value === v)?.label ?? v).join(", ")
    : undefined;

  const handleSearchMerchant = (value: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!value.trim()) { setOptions([]); return; }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await getListMerchant({ ...filter, search: value });
        const merchants = response?.active?.data ?? [];
        setOptions(
          merchants.map((item: Merchant) => ({
            label: `${item.businessName}${item.customerCode ? ` (${item.customerCode})` : ""}`,
            value: item.id,
          }))
        );
      } catch (err) {
        console.error("Cannot fetch merchant:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleToggleContact = (key: string) => {
    setSelectedContacts((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleToggleResolve = (key: string) => {
    setResolveKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleAddTask = () => {
    if (!selectedMerchant) return message.warning("Please choose a salon first");
    if (selectedIssues.length === 0) return message.warning("Please select at least one issue type.");
    if (!selectedContacts.length) return message.warning("Please select a contact method.");

    if (isTerminalError && (!miVersion || !device || !disconnectTime)) {
      return message.warning("Please fill in all Terminal details (Version, Device, Time).");
    }

    const newTask: Task = {
      id: Date.now().toString(),
      merchantId: selectedMerchant,
      merchantName: merchantLabel,
      issueTypes: selectedIssues,
      contactMethods: selectedContacts,
      status: "pending",
      createdAt: new Date().toISOString(),
      miVersion: isTerminalError ? miVersion : undefined,
      device: isTerminalError ? device : undefined,
      disconnectTime: isTerminalError && disconnectTime ? disconnectTime.format("HH:mm") : undefined,
      resolveSteps: resolveKeys,
    };

    setTasks((prev) => [newTask, ...prev]);

    // Reset
    setSelectedMerchant(undefined);
    setSelectedIssues([]);
    setSelectedContacts([]);
    setMiVersion(undefined);
    setDevice(undefined);
    setDisconnectTime(null);
    setDisconnectTimeStr(undefined);
    setResolveKeys([]);
    setOptions([]);

    message.success("Task added!");
  };

  // ── Render ──
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

      {/* Form + Preview side by side on wide screens */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

        {/* ── LEFT: Form ── */}
        <div className="card">

          {/* Select Merchant */}
          <div style={{ marginBottom: 20 }}>
            <div className="section-title"><ShopOutlined style={{ color: "#6366f1" }} /> Select Merchant</div>
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

          {/* Type of problem */}
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

            {/* Terminal details */}
            {isTerminalError && (
              <div style={{
                marginTop: 12, padding: 16, background: "#f8fafc",
                borderRadius: 12, border: "1px dashed #cbd5e1",
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
                      onChange={(val) => {
                        setDisconnectTime(val);
                        setDisconnectTimeStr(val ? val.format("HH:mm") : undefined);
                      }}
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
            <div className="section-title" style={{ marginBottom: 10 }}>
              <PhoneOutlined style={{ color: "#f59e0b" }} /> Contact Method
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {Object.entries(CONTACT_METHOD_CONFIG).map(([key, cfg]) => {
                const active = selectedContacts.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => handleToggleContact(key)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 14px", borderRadius: 20,
                      background: active ? cfg.activeBg : "#fff",
                      color: cfg.color,
                      border: `1px solid ${active ? cfg.color : cfg.border}`,
                      fontSize: 14, fontWeight: 500, cursor: "pointer",
                      transition: "all 0.2s ease",
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

        {/* ── RIGHT: Preview Card ── */}
        <div
          className="card"
          style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", position: "relative" }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div className="section-title" style={{ margin: 0 }}>
              <EditOutlined style={{ color: "#6366f1" }} /> Preview
            </div>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              <EditOutlined style={{ fontSize: 11 }} /> Hover to edit
            </span>
          </div>

          {/* Fields */}
          <EditableField
            label="Merchant"
            icon={<ShopOutlined style={{ fontSize: 13 }} />}
            value={merchantLabel || undefined}
            placeholder="No merchant selected"
            type="text"
            onChange={(val) => {
              // Update label in options list for display (merchant id unchanged)
              setOptions((prev) =>
                prev.map((o) => o.value === selectedMerchant ? { ...o, label: val } : o)
              );
            }}
          />

          <EditableField
            label="Title"
            icon={<BugOutlined style={{ fontSize: 13 }} />}
            value={titleLabel}
            placeholder="Select issue first"
            type="text"
            onChange={() => {/* title is derived — read-only override ignored */}}
          />

          {/* Terminal fields — only show when connection_error selected */}
          {isTerminalError && (
            <>
              <EditableField
                label="M.I version"
                icon={<span style={{ fontSize: 13 }}>⚙</span>}
                value={miVersion}
                placeholder="Not selected"
                type="select"
                options={MI_VERSION_OPTIONS}
                onChange={(val) => setMiVersion(val)}
              />
              <EditableField
                label="Device"
                icon={<span style={{ fontSize: 13 }}>📟</span>}
                value={device}
                placeholder="Not selected"
                type="select"
                options={DEVICE_OPTIONS}
                onChange={(val) => setDevice(val)}
              />
              <EditableField
                label="Time"
                icon={<span style={{ fontSize: 13 }}>🕐</span>}
                value={disconnectTimeStr}
                placeholder="Not set"
                type="time"
                onChange={(val) => {
                  setDisconnectTimeStr(val);
                  // Also sync the Dayjs state for form submission
                  if (val) {
                    import("dayjs").then(({ default: dayjs }) => {
                      setDisconnectTime(dayjs(val, "HH:mm"));
                    });
                  }
                }}
              />
            </>
          )}

          {/* Contact methods — badge display */}
          <div style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #f1f5f9", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 130, fontSize: 13, color: "#64748b" }}>
              <PhoneOutlined style={{ fontSize: 13 }} /> Contact
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, flex: 1 }}>
              {selectedContacts.length === 0
                ? <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 13 }}>None selected</span>
                : selectedContacts.map((key) => {
                    const cfg = CONTACT_METHOD_CONFIG[key];
                    if (!cfg) return null;
                    return (
                      <span
                        key={key}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "2px 10px", borderRadius: 20,
                          background: cfg.activeBg, color: cfg.color,
                          border: `1px solid ${cfg.color}`,
                          fontSize: 12, fontWeight: 600,
                        }}
                      >
                        {cfg.icon} {cfg.label}
                      </span>
                    );
                  })
              }
            </div>
          </div>

          {/* Resolve — shown for terminal error issues */}
          {isTerminalError && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>
                Resolve
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {RESOLVE_OPTIONS.map((opt) => {
                  const active = resolveKeys.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleToggleResolve(opt.key)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "4px 12px", borderRadius: 20,
                        background: active ? "#EEEDFE" : "#fff",
                        color: active ? "#3C3489" : "#64748b",
                        border: `0.5px solid ${active ? "#534AB7" : "#cbd5e1"}`,
                        fontSize: 12, cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!selectedMerchant && selectedIssues.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0 8px", color: "#94a3b8", fontSize: 13 }}>
              Fill in the form to see a preview here
            </div>
          )}
        </div>
      </div>

      {/* Task list */}
      <TaskList tasks={tasks} />
    </div>
  );
};

export default TaskPage;