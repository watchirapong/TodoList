import type { TodoStatus } from "@/lib/types";

const VALID_STATUSES: TodoStatus[] = ["not_started", "in_progress", "done"];

/** Near deadline = within 3 calendar days of now OR already overdue */
export const NEAR_DEADLINE_MS = 3 * 24 * 60 * 60 * 1000;

export function isValidStatus(value: unknown): value is TodoStatus {
  return (
    typeof value === "string" &&
    VALID_STATUSES.includes(value as TodoStatus)
  );
}

export function parseDeadlineInput(
  value: unknown
): { error?: string; deadline?: Date | null } {
  if (value === undefined) return {};
  if (value === null) return { deadline: null };
  if (typeof value !== "string") {
    return { error: "deadline must be an ISO date string or null" };
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { error: "deadline must be a valid ISO date string" };
  }
  return { deadline: date };
}

export function isNearDeadline(deadline: string | null): boolean {
  if (!deadline) return false;
  const deadlineTime = new Date(deadline).getTime();
  if (Number.isNaN(deadlineTime)) return false;
  return deadlineTime - Date.now() <= NEAR_DEADLINE_MS;
}

export function formatDeadlineLabel(deadline: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(deadline));
}

export function isoToDateInput(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function dateInputToISO(dateStr: string): string | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
}

export function parseDescriptionInput(
  value: unknown
): { error?: string; description?: string } {
  if (value === undefined) return {};
  if (typeof value !== "string") {
    return { error: "description must be a string" };
  }
  if (value.length > 5000) {
    return { error: "description must be 5000 characters or fewer" };
  }
  return { description: value.trim() };
}

export function serializeTodo(todo: {
  _id: { toString(): string };
  text: string;
  description?: string;
  status?: TodoStatus;
  completed?: boolean;
  deadline?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  let status: TodoStatus = "not_started";
  if (todo.status && isValidStatus(todo.status)) {
    status = todo.status;
  } else if (todo.completed === true) {
    status = "done";
  }

  return {
    _id: todo._id.toString(),
    text: todo.text,
    description: todo.description ?? "",
    status,
    deadline: todo.deadline ? todo.deadline.toISOString() : null,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}
