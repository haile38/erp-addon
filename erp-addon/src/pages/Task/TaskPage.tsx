import { useState } from "react";
import { BugOutlined, PlusOutlined } from "@ant-design/icons";
import { useTaskForm } from "./hooks/useTaskForm";
import { useMerchantSearch } from "./hooks/useMerchantSearch";
import { useTaskSubmit } from "./hooks/useTaskSubmit";
import MerchantSelect from "./task-component/MerchantSelect";
import IssueSelect from "./task-component/IssueSelect";
import ContactMethodPicker from "./task-component/ContactMethodPicker";
import TaskPreviewCard from "./task-component/TaskPreviewCard";
import { ISSUE_OPTIONS, type Task } from "../../constants/task.constants";
import "./task.scss";

const TaskPage = () => {
  const { form, setField, toggleContact, toggleResolve, reset, isTerminalError } = useTaskForm();
  const { options, setOptions, loading, search, reset: resetSearch } = useMerchantSearch();
  const { submitting, submit } = useTaskSubmit();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Derived
  const merchantLabel = options.find((o) => o.value === form.selectedMerchant)?.label ?? "";
  const titleLabel = form.selectedIssues.length > 0
    ? "Q_Note" + form.selectedIssues.map((v) => ISSUE_OPTIONS.find((o) => o.value === v)?.label ?? v).join(", ")
    : undefined;

  const handleAddTask = () =>
    submit(form, merchantLabel, isTerminalError, (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
      reset();
      resetSearch();
    });

  const handleDisconnectTimeChange = (val: string | null, timeStr?: string) => {
    setField("disconnectTimeStr", timeStr);
    if (timeStr) {
      import("dayjs").then(({ default: dayjs }) => setField("disconnectTime", dayjs(timeStr, "HH:mm")));
    } else {
      setField("disconnectTime", null);
    }
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        {/* ── LEFT: Form ── */}
        <div className="card">
          <MerchantSelect
            value={form.selectedMerchant}
            options={options}
            loading={loading}
            onChange={(val) => setField("selectedMerchant", val)}
            onSearch={search}
          />
          <IssueSelect
            selectedIssues={form.selectedIssues}
            isTerminalError={isTerminalError}
            miVersion={form.miVersion}
            device={form.device}
            disconnectTime={form.disconnectTime}
            onIssuesChange={(val) => setField("selectedIssues", val)}
            onMiVersionChange={(val) => setField("miVersion", val)}
            onDeviceChange={(val) => setField("device", val)}
            onDisconnectTimeChange={(val, timeStr) => handleDisconnectTimeChange(val ? val.format("HH:mm") : null, timeStr)}
          />
          <ContactMethodPicker selected={form.selectedContacts} onToggle={toggleContact} />

          <button onClick={handleAddTask} className="submit-btn" disabled={submitting}>
            <PlusOutlined /> {submitting ? "Adding..." : "Add Q_note"}
          </button>
        </div>

        {/* ── RIGHT: Preview ── */}
        <TaskPreviewCard
          form={form}
          isTerminalError={isTerminalError}
          merchantLabel={merchantLabel}
          titleLabel={titleLabel}
          merchantOptions={options}
          onMerchantLabelChange={(val) =>
            setOptions((prev) => prev.map((o) => o.value === form.selectedMerchant ? { ...o, label: val } : o))
          }
          onMiVersionChange={(val) => setField("miVersion", val)}
          onDeviceChange={(val) => setField("device", val)}
          onDisconnectTimeChange={(val) => handleDisconnectTimeChange(val, val || undefined)}
          onToggleResolve={toggleResolve}
        />
      </div>

      {/* <TaskList tasks={tasks} /> */}
    </div>
  );
};

export default TaskPage;