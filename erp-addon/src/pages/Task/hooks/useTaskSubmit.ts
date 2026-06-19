import { useState } from "react";
import { message } from "antd";
import { CreateOrUpdate } from "../../../api/task.api";
import { useAuth } from "../../../context/AuthContext";
import {
  ISSUE_OPTIONS, CONTACT_METHOD_CONFIG, MI_VERSION_OPTIONS,
  DEVICE_OPTIONS, RESOLVE_OPTIONS, TICKET_DIRECTION,
  TICKET_ATTRIBUTES, TICKET_PRIORITY, TICKET_TYPE,
  type Task,
} from "../../../constants/task.constants";
import type { TaskFormState } from "./useTaskForm";
import type { MerchantOption } from "./useMerchantSearch";

// ─── Fixed defaults ────────────────────────────────────────────────────────────
const DEFAULT_PRIORITY = TICKET_PRIORITY.find((p) => p.name === "Medium")!;
const DEFAULT_TICKET_TYPE = TICKET_TYPE.find((t) => t.name === "Support")!;
const DEFAULT_WORKSTATION = { id: "1", name: "Enrich Co Ltd" };

// Map issue value → category id (thêm vào đây khi có issue mới)
const ISSUE_DEFAULT_CATEGORY_ID: Record<string, string> = {
  connection_error: "28",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildTitle = (selectedIssues: string[]) =>
  selectedIssues.length > 0
    ? "Q_NOTE" + selectedIssues.map((v) => ISSUE_OPTIONS.find((o) => o.value === v)?.label ?? v).join(", ")
    : undefined;

const buildDescription = (form: TaskFormState, merchantLabel: string, isTerminalError: boolean) => {
  const lines: string[] = [];
  if (merchantLabel) lines.push(`Merchant: ${merchantLabel}`);

  const titleLabel = buildTitle(form.selectedIssues);
  if (titleLabel) lines.push(`Issue: ${titleLabel}`);

  if (form.selectedContacts.length) {
    const labels = form.selectedContacts.map((k) => CONTACT_METHOD_CONFIG[k]?.label ?? k);
    lines.push(`Contact: ${labels.join(", ")}`);
  }

  if (isTerminalError) {
    if (form.miVersion) {
      const v = MI_VERSION_OPTIONS.find((o) => o.value === form.miVersion)?.label ?? form.miVersion;
      lines.push(`M.I version: ${v}`);
    }
    if (form.device) {
      const d = DEVICE_OPTIONS.find((o) => o.value === form.device)?.label ?? form.device;
      lines.push(`Device: ${d}`);
    }
    if (form.disconnectTimeStr) lines.push(`Disconnect time: ${form.disconnectTimeStr}`);
    if (form.resolveKeys.length) {
      const labels = form.resolveKeys.map((k) => RESOLVE_OPTIONS.find((o) => o.key === k)?.label ?? k);
      lines.push(`Resolve: ${labels.join(", ")}`);
    }
  }

  return lines.join("<br/>");
};

const buildDirectionAttributes = (selectedContacts: string[]) =>
  selectedContacts
    .map((key) => TICKET_DIRECTION.find((d) => d.name === key))
    .filter((d): d is (typeof TICKET_DIRECTION)[number] => !!d)
    .map((d) => ({ id: "", refId: d.id, refName: d.name, refType: "Direction" }));

const buildCategoryAttributes = (selectedIssues: string[]) => {
  const categoryIds = new Set(
    selectedIssues
      .map((issue) => ISSUE_DEFAULT_CATEGORY_ID[issue])
      .filter((id): id is string => !!id)
  );

  return Array.from(categoryIds)
    .map((catId) => TICKET_ATTRIBUTES.find((a) => a.id === catId))
    .filter(Boolean)
    .map((cat) => ({ id: "", refId: cat!.id, refName: cat!.name, refType: "Categories" }));
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useTaskSubmit = () => {
  const { userInfo } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const validate = (form: TaskFormState, isTerminalError: boolean): boolean => {
    if (!form.selectedMerchant) { message.warning("Please choose a salon first"); return false; }
    if (!form.selectedIssues.length) { message.warning("Please select at least one issue type."); return false; }
    if (!form.selectedContacts.length) { message.warning("Please select a contact method."); return false; }
    if (isTerminalError && (!form.miVersion || !form.device || !form.disconnectTime)) {
      message.warning("Please fill in all Terminal details (Version, Device, Time).");
      return false;
    }
    return true;
  };

  const submit = async (
    form: TaskFormState,
    merchantLabel: string,
    isTerminalError: boolean,
    onSuccess: (task: Task) => void
  ) => {
    if (!validate(form, isTerminalError)) return;

    // Build attributes fresh each submission (fix: không dùng biến ngoài component)
    const ticketAssigns = [];
    const ticketAttributes = [];

    if (userInfo?.id) {
      ticketAssigns.push({
        id: "", refId: userInfo.id,
        refName: userInfo.userName ?? userInfo.name,
        refType: "user", role: "Primary", type: "Assign",
      });
    }

    ticketAttributes.push({ id: "", refId: DEFAULT_PRIORITY.id, refName: DEFAULT_PRIORITY.name, refType: "Priority" });
    ticketAttributes.push(...buildDirectionAttributes(form.selectedContacts));
    ticketAttributes.push(...buildCategoryAttributes(form.selectedIssues));

    const titleLabel = buildTitle(form.selectedIssues);

    const payload = {
      workstationId: DEFAULT_WORKSTATION.id,
      workstationName: DEFAULT_WORKSTATION.name,
      ticketAttributes,
      ticketAssigns,
      ticket: {
        ticketTypeName: DEFAULT_TICKET_TYPE.name,
        ticketTypeId: DEFAULT_TICKET_TYPE.id,
        templateName: null, template: false,
        stageName: null, stageId: null, sla: 24,
        name: titleLabel,
        merchantId: form.selectedMerchant,
        id: null,
        description: buildDescription(form, merchantLabel, isTerminalError),
        customerName: merchantLabel,
        customerId: form.selectedMerchant,
        attachment: null,
      },
    };

    try {
      setSubmitting(true);
      await CreateOrUpdate(payload);

      const newTask: Task = {
        id: Date.now().toString(),
        merchantId: form.selectedMerchant!,
        merchantName: merchantLabel,
        issueTypes: form.selectedIssues,
        contactMethods: form.selectedContacts,
        status: "pending",
        createdAt: new Date().toISOString(),
        miVersion: isTerminalError ? form.miVersion : undefined,
        device: isTerminalError ? form.device : undefined,
        disconnectTime: isTerminalError && form.disconnectTime
          ? form.disconnectTime.format("HH:mm") : undefined,
        resolveSteps: form.resolveKeys,
      };

      message.success("Task added!");
      onSuccess(newTask);
    } catch (err) {
      console.error("Cannot create ticket:", err);
      message.error("Failed to add task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, submit };
};