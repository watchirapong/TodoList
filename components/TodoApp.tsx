"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Todo, TodoEditPayload, TodoStatus } from "@/lib/types";
import KanbanBoard from "./KanbanBoard";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to load todos");
      const data = await res.json();
      setTodos(data.todos);
    } catch {
      setError("Could not load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const stats = useMemo(() => {
    const notStarted = todos.filter((t) => t.status === "not_started").length;
    const inProgress = todos.filter((t) => t.status === "in_progress").length;
    const done = todos.filter((t) => t.status === "done").length;
    return { notStarted, inProgress, done, total: todos.length };
  }, [todos]);

  async function handleAdd(text: string, status: TodoStatus = "not_started") {
    setError(null);
    const tempId = `temp-${Date.now()}`;
    const optimistic: Todo = {
      _id: tempId,
      text,
      description: "",
      status,
      deadline: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos((prev) => [optimistic, ...prev]);

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, status }),
      });
      if (!res.ok) throw new Error("Failed to create todo");
      const data = await res.json();
      setTodos((prev) =>
        prev.map((t) => (t._id === tempId ? data.todo : t))
      );
    } catch {
      setTodos((prev) => prev.filter((t) => t._id !== tempId));
      setError("Could not add task. Please try again.");
    }
  }

  async function handleStatusChange(id: string, status: TodoStatus) {
    setError(null);
    const previous = todos;
    setTodos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status } : t))
    );

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      const data = await res.json();
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? data.todo : t))
      );
    } catch {
      setTodos(previous);
      setError("Could not move task. Please try again.");
    }
  }

  async function handleEdit(id: string, payload: TodoEditPayload) {
    setError(null);
    const previous = todos;
    setTodos((prev) =>
      prev.map((t) =>
        t._id === id
          ? {
              ...t,
              text: payload.text,
              description: payload.description,
              deadline: payload.deadline,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      const data = await res.json();
      setTodos((prev) => prev.map((t) => (t._id === id ? data.todo : t)));
    } catch {
      setTodos(previous);
      setError("Could not update task. Please try again.");
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    const previous = todos;
    setTodos((prev) => prev.filter((t) => t._id !== id));

    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete todo");
    } catch {
      setTodos(previous);
      setError("Could not delete task. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Drag cards between columns · double-click to edit
          </p>
        </div>
        <span className="text-sm text-slate-500">{stats.total} total</span>
      </header>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <KanbanBoard
          todos={todos}
          onAdd={handleAdd}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {todos.length > 0 && (
        <footer className="mt-6 flex gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
          <span>{stats.notStarted} not started</span>
          <span>{stats.inProgress} in progress</span>
          <span>{stats.done} done</span>
        </footer>
      )}
    </div>
  );
}
