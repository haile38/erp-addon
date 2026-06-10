import React, { useState } from "react";
import { Table, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CalendarOutlined, BugOutlined, SearchOutlined } from "@ant-design/icons";
import { Resizable } from "react-resizable";
import { type Task, STATUS_CONFIG, ISSUE_OPTIONS, CONTACT_METHOD_CONFIG } from "../../constants/task.constants";
import { formatDate } from "../../utils/format";

interface TaskListProps {
  tasks: Task[];
}

// ─── COMPONENT HỖ TRỢ KÉO THẢ CỘT ─────────────────────────────────────────────
const ResizableTitle = (
  props: React.HTMLAttributes<unknown> & {
    onResize: (e: React.SyntheticEvent<Element>, data: { size: { width: number } }) => void;
    width: number;
  }
) => {
  const { onResize, width, ...restProps } = props;

  if (!width) return <th {...restProps} />;

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            right: -5,
            bottom: 0,
            zIndex: 1,
            width: 10,
            height: "100%",
            cursor: "col-resize", // Trỏ chuột biến thành mũi tên 2 chiều
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} style={{ ...restProps.style, position: "relative" }} />
    </Resizable>
  );
};
// ──────────────────────────────────────────────────────────────────────────────

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const [searchText, setSearchText] = useState("");

  // 1. Logic Tìm kiếm nhanh (Filter)
  const filteredTasks = tasks.filter((task) => {
    const keyword = searchText.toLowerCase();
    
    // Tìm theo tên Tiệm
    const matchStore = task.merchantName.toLowerCase().includes(keyword);
    
    // Tìm theo tên Issue (Ví dụ gõ "Lỗi" thì ra Lỗi thanh toán)
    const matchIssue = task.issueTypes.some((issueVal) => {
      const label = ISSUE_OPTIONS.find((o) => o.value === issueVal)?.label?.toLowerCase() || "";
      return label.includes(keyword);
    });

    return matchStore || matchIssue;
  });

  // 2. Định nghĩa cấu hình Cột (Có thêm state để lưu width khi kéo thả)
  // BẮT BUỘC phải cấp width mặc định cho TẤT CẢ các cột để tính năng kéo hoạt động
  const [columns, setColumns] = useState<ColumnsType<Task>>([
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_, __, index) => <span style={{ color: "#9ca3af", fontWeight: 500 }}>{index + 1}</span>,
    },
    {
      title: "Store",
      dataIndex: "merchantName",
      key: "merchantName",
      width: 200, // Cấp width mặc định
      render: (text) => <span style={{ color: "#1f2937", fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Issues",
      dataIndex: "issueTypes",
      key: "issueTypes",
      width: 250, // Cấp width mặc định
      render: (issueTypes: string[]) => {
        const issueLabels = issueTypes
          .map((v) => ISSUE_OPTIONS.find((o) => o.value === v)?.label ?? v)
          .join(", ");
        return <span style={{ color: "#6b7280" }}>{issueLabels}</span>;
      },
    },
    {
      title: "Method",
      dataIndex: "contactMethods",
      key: "contactMethods",
      width: 220,
      render: (methods: string[]) => {
        if (!methods || methods.length === 0) return <span style={{ color: "#9ca3af" }}>—</span>;
        return (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {methods.map((method) => {
              const cfg = CONTACT_METHOD_CONFIG[method];
              if (!cfg) return null;
              return (
                <span
                  key={method}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
                    borderRadius: 20, background: cfg.activeBg, color: cfg.color,
                    border: `1px solid ${cfg.color}`, fontSize: 12, fontWeight: 600,
                  }}
                >
                  {cfg.icon} {cfg.label}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: Task["status"]) => {
        const cfg = STATUS_CONFIG[status];
        return (
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
              borderRadius: 20, background: cfg.bg, color: cfg.color,
              border: `1px solid ${cfg.border}`, fontSize: 12, fontWeight: 600, width: "fit-content",
            }}
          >
            {cfg.icon} {cfg.label}
          </span>
        );
      },
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (createdAt: string) => {
        const time = new Date(createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
        return <span style={{ color: "#9ca3af", fontSize: 13 }}>{time}</span>;
      },
    },
  ]);

  // 3. Hàm xử lý khi user kéo thả viền cột
  const handleResize =
    (index: number) =>
    (_: React.SyntheticEvent<Element>, { size }: { size: { width: number } }) => {
      setColumns((prev) => {
        const nextCols = [...prev];
        nextCols[index] = {
          ...nextCols[index],
          width: size.width,
        };
        return nextCols;
      });
    };

  // Trộn columns với sự kiện onHeaderCell để truyền lệnh kéo
  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column: ColumnsType<Task>[number]) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  // State rỗng
  const emptyState = (
    <div className="empty-state">
      <BugOutlined style={{ fontSize: 24, color: "#d1d5db" }} />
      <div style={{ marginTop: 6, color: "#9ca3af", fontSize: 13 }}>No tasks logged today</div>
    </div>
  );

  return (
    <div className="card" style={{ marginTop: 24 }}>
      
      {/* HEADER TÍCH HỢP THANH SEARCH */}
      <div 
        className="list-header" 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", // Đẩy tiêu đề sang trái, search sang phải
          alignItems: "center", 
          marginBottom: 16 
        }}
      >
        <div>
          <CalendarOutlined style={{ color: "#6366f1", fontSize: 16, marginRight: 8 }} />
          <span className="title">Today's Tasks</span>
          <span className="date" style={{ marginLeft: 8 }}>— {formatDate(new Date())}</span>
        </div>
        
        {/* Nút Search nhỏ gọn */}
        <Input
          placeholder="Search store or issue..."
          prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250, borderRadius: 8 }}
        />
      </div>

      <Table
        components={{
          header: {
            cell: ResizableTitle, // Đẩy Component Custom vào để AntD hiểu
          },
        }}
        columns={mergedColumns}
        dataSource={filteredTasks} // Sử dụng mảng đã được Search/Filter
        rowKey="id"
        pagination={false}
        locale={{ emptyText: emptyState }}
        // Scroll giúp bảng không bị vỡ bố cục khi kéo cột quá to
        scroll={{ x: 800 }} 
      />
    </div>
  );
};

export default TaskList;