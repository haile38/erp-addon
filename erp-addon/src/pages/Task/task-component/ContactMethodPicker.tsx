import { PhoneOutlined } from "@ant-design/icons";
import { CONTACT_METHOD_CONFIG } from "../../../constants/task.constants";

interface ContactMethodPickerProps {
  selected: string[];
  onToggle: (key: string) => void;
}

const ContactMethodPicker: React.FC<ContactMethodPickerProps> = ({ selected, onToggle }) => (
  <div style={{ marginBottom: 24 }}>
    <div className="section-title" style={{ marginBottom: 10 }}>
      <PhoneOutlined style={{ color: "#f59e0b" }} /> Contact Method
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {Object.entries(CONTACT_METHOD_CONFIG).map(([key, cfg]) => {
        const active = selected.includes(key);
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
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
);

export default ContactMethodPicker;