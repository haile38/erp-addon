import { EditOutlined, ShopOutlined, BugOutlined, PhoneOutlined } from "@ant-design/icons";
import EditableField from "./EditableField";
import { CONTACT_METHOD_CONFIG, MI_VERSION_OPTIONS, DEVICE_OPTIONS, RESOLVE_OPTIONS } from "../../../constants/task.constants";
import type { TaskFormState } from "../hooks/useTaskForm";
import type { MerchantOption } from "../hooks/useMerchantSearch";

interface TaskPreviewCardProps {
  form: TaskFormState;
  isTerminalError: boolean;
  merchantLabel: string;
  titleLabel: string | undefined;
  merchantOptions: MerchantOption[];
  onMerchantLabelChange: (val: string) => void;
  onMiVersionChange: (val: string) => void;
  onDeviceChange: (val: string) => void;
  onDisconnectTimeChange: (val: string) => void;
  onToggleResolve: (key: string) => void;
}

const TaskPreviewCard: React.FC<TaskPreviewCardProps> = ({
  form, isTerminalError, merchantLabel, titleLabel,
  onMerchantLabelChange, onMiVersionChange, onDeviceChange,
  onDisconnectTimeChange, onToggleResolve,
}) => (
  <div className="card" style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", position: "relative" }}>
    {/* Header */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div className="section-title" style={{ margin: 0 }}>
        <EditOutlined style={{ color: "#6366f1" }} /> Preview
      </div>
      <span style={{ fontSize: 11, color: "#94a3b8" }}>
        <EditOutlined style={{ fontSize: 11 }} /> Hover to edit
      </span>
    </div>

    {/* Merchant */}
    <EditableField
      label="Merchant"
      icon={<ShopOutlined style={{ fontSize: 13 }} />}
      value={merchantLabel || undefined}
      placeholder="No merchant selected"
      type="text"
      onChange={onMerchantLabelChange}
    />

    {/* Title */}
    <EditableField
      label="Title"
      icon={<BugOutlined style={{ fontSize: 13 }} />}
      value={titleLabel}
      placeholder="Select issue first"
      type="text"
      onChange={() => {/* derived — read-only */}}
    />

    {/* Terminal fields */}
    {isTerminalError && (
      <>
        <EditableField
          label="M.I version"
          icon={<span style={{ fontSize: 13 }}>⚙</span>}
          value={form.miVersion}
          placeholder="Not selected"
          type="select"
          options={MI_VERSION_OPTIONS}
          onChange={onMiVersionChange}
        />
        <EditableField
          label="Device"
          icon={<span style={{ fontSize: 13 }}>📟</span>}
          value={form.device}
          placeholder="Not selected"
          type="select"
          options={DEVICE_OPTIONS}
          onChange={onDeviceChange}
        />
        <EditableField
          label="Time"
          icon={<span style={{ fontSize: 13 }}>🕐</span>}
          value={form.disconnectTimeStr}
          placeholder="Not set"
          type="time"
          onChange={onDisconnectTimeChange}
        />
      </>
    )}

    {/* Contact badges */}
    <div style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #f1f5f9", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 130, fontSize: 13, color: "#64748b" }}>
        <PhoneOutlined style={{ fontSize: 13 }} /> Contact
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, flex: 1 }}>
        {form.selectedContacts.length === 0
          ? <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 13 }}>None selected</span>
          : form.selectedContacts.map((key) => {
              const cfg = CONTACT_METHOD_CONFIG[key];
              if (!cfg) return null;
              return (
                <span
                  key={key}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "2px 10px", borderRadius: 20,
                    background: cfg.activeBg, color: cfg.color,
                    border: `1px solid ${cfg.color}`, fontSize: 12, fontWeight: 600,
                  }}
                >
                  {cfg.icon} {cfg.label}
                </span>
              );
            })
        }
      </div>
    </div>

    {/* Resolve options */}
    {isTerminalError && (
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>Resolve</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {RESOLVE_OPTIONS.map((opt) => {
            const active = form.resolveKeys.includes(opt.key);
            return (
              <button
                key={opt.key}
                onClick={() => onToggleResolve(opt.key)}
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
    {!form.selectedMerchant && form.selectedIssues.length === 0 && (
      <div style={{ textAlign: "center", padding: "20px 0 8px", color: "#94a3b8", fontSize: 13 }}>
        Fill in the form to see a preview here
      </div>
    )}
  </div>
);

export default TaskPreviewCard;