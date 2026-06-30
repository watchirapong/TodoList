export type TodoStatus = "not_started" | "in_progress" | "done";

export interface Todo {
  _id: string;
  text: string;
  description: string;
  status: TodoStatus;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TodoEditPayload {
  text: string;
  description: string;
  deadline: string | null;
}

export const COLUMNS: {
  id: TodoStatus;
  label: string;
  tagClass: string;
}[] = [
  {
    id: "not_started",
    label: "Not started",
    tagClass: "bg-slate-100 text-slate-600",
  },
  {
    id: "in_progress",
    label: "In progress",
    tagClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "done",
    label: "Done",
    tagClass: "bg-emerald-100 text-emerald-700",
  },
];
