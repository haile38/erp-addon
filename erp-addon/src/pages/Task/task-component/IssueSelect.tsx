import { Select, TimePicker } from "antd";
import { BugOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import { ISSUE_OPTIONS, MI_VERSION_OPTIONS, DEVICE_OPTIONS } from "../../../constants/task.constants";

interface IssueSelectProps {
  selectedIssues: string[];
  isTerminalError: boolean;
  miVersion: string | undefined;
  device: string | undefined;
  disconnectTime: Dayjs | null;
  onIssuesChange: (val: string[]) => void;
  onMiVersionChange: (val: string) => void;
  onDeviceChange: (val: string) => void;
  onDisconnectTimeChange: (val: Dayjs | null, timeStr: string | undefined) => void;
}

const IssueSelect: React.FC<IssueSelectProps> = ({
  selectedIssues, isTerminalError,
  miVersion, device, disconnectTime,
  onIssuesChange, onMiVersionChange, onDeviceChange, onDisconnectTimeChange,
}) => (
  <div style={{ marginBottom: 20 }}>
    <div className="section-title">
      <BugOutlined style={{ color: "#f59e0b" }} /> Type of problem
    </div>

    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Select problem..."
      options={ISSUE_OPTIONS}
      value={selectedIssues}
      onChange={onIssuesChange}
      allowClear
    />

    {isTerminalError && (
      <div style={{ marginTop: 12, padding: 16, background: "#f8fafc", borderRadius: 12, border: "1px dashed #cbd5e1" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 12 }}>
          Terminal Disconnected Details
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Version M.I</div>
            <Select options={MI_VERSION_OPTIONS} value={miVersion} onChange={onMiVersionChange} placeholder="Select version" style={{ width: "100%" }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Device</div>
            <Select options={DEVICE_OPTIONS} value={device} onChange={onDeviceChange} placeholder="Select device" style={{ width: "100%" }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Disconnect Time</div>
            <TimePicker
              format="HH:mm"
              value={disconnectTime}
              onChange={(val) => onDisconnectTimeChange(val, val ? val.format("HH:mm") : undefined)}
              placeholder="Select time"
              use12Hours showNow
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    )}
  </div>
);

export default IssueSelect;