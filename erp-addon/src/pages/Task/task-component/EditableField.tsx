import { useState, useRef } from "react";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";

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
      const [h, m] = value.split(":");
      const hh = parseInt(h, 10);
      return `${hh % 12 || 12}:${m} ${hh >= 12 ? "PM" : "AM"}`;
    }
    if (type === "select") return options.find((o) => o.value === value)?.label ?? value;
    return value;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #f1f5f9", gap: 10 }}>
      {/* Label */}
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
                style={{ fontSize: 13, fontFamily: "inherit", border: "none", background: "transparent", outline: "none", color: "#1e293b", fontWeight: 500, cursor: "pointer", width: "100%" }}
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
                style={{ fontSize: 13, fontFamily: "inherit", border: "none", background: "transparent", outline: "none", color: "#1e293b", fontWeight: 500 }}
              />
            )}
            {type === "text" && (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                defaultValue={value ?? ""}
                onBlur={(e) => { onChange(e.target.value); stopEdit(); }}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                placeholder="Type here..."
                style={{ fontSize: 13, fontFamily: "inherit", border: "none", background: "transparent", outline: "none", color: "#1e293b", fontWeight: 500, width: "100%" }}
              />
            )}
          </>
        ) : (
          <span
            onClick={startEdit}
            title="Click to edit"
            style={{ display: "inline-block", borderRadius: 6, padding: "1px 6px", cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {displayValue()}
          </span>
        )}
      </div>

      {/* Edit / Done icon */}
      <span onClick={editing ? stopEdit : startEdit} style={{ color: "#94a3b8", cursor: "pointer", fontSize: 13 }} title={editing ? "Done" : "Edit"}>
        {editing ? <CheckOutlined style={{ color: "#6366f1" }} /> : <EditOutlined />}
      </span>
    </div>
  );
};

export default EditableField;