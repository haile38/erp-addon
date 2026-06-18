import { useState } from "react";
import type { Dayjs } from "dayjs";

export interface TaskFormState {
  selectedMerchant: string | undefined;
  selectedIssues: string[];
  selectedContacts: string[];
  miVersion: string | undefined;
  device: string | undefined;
  disconnectTime: Dayjs | null;
  disconnectTimeStr: string | undefined;
  resolveKeys: string[];
}

const INITIAL_STATE: TaskFormState = {
  selectedMerchant: undefined,
  selectedIssues: [],
  selectedContacts: [],
  miVersion: undefined,
  device: undefined,
  disconnectTime: null,
  disconnectTimeStr: undefined,
  resolveKeys: [],
};

export const useTaskForm = () => {
  const [form, setForm] = useState<TaskFormState>(INITIAL_STATE);

  const setField = <K extends keyof TaskFormState>(key: K, value: TaskFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleContact = (key: string) => {
    setForm((prev) => ({
      ...prev,
      selectedContacts: prev.selectedContacts.includes(key)
        ? prev.selectedContacts.filter((k) => k !== key)
        : [...prev.selectedContacts, key],
    }));
  };

  const toggleResolve = (key: string) => {
    setForm((prev) => ({
      ...prev,
      resolveKeys: prev.resolveKeys.includes(key)
        ? prev.resolveKeys.filter((k) => k !== key)
        : [...prev.resolveKeys, key],
    }));
  };

  const reset = () => setForm(INITIAL_STATE);

  // Derived values
  const isTerminalError = form.selectedIssues.includes("connection_error");

  return {
    form,
    setField,
    toggleContact,
    toggleResolve,
    reset,
    isTerminalError,
  };
};