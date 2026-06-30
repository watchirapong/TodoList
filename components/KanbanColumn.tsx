"use client";

import { FormEvent, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Todo, TodoStatus } from "@/lib/types";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  status: TodoStatus;
  label: string;
  tagClass: string;
  todos: Todo[];
  onAdd: (text: string, status: TodoStatus) => void;
  onDelete: (id: string) => void;
  onOpenDetail: (todo: Todo) => void;
  disabled?: boolean;
}

export default function KanbanColumn({
  status,
  label,
  tagClass,
  todos,
  onAdd,
  onDelete,
  onOpenDetail,
  disabled,
}: KanbanColumnProps) {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");

  const { setNodeRef, isOver } = useDroppable({ id: status });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, status);
    setText("");
    setShowForm(false);
  }

  return (
    <div
      className={`flex min-h-[420px] flex-col rounded-xl bg-slate-50/80 transition-colors ${
        isOver ? "bg-indigo-50/60 ring-2 ring-indigo-300 ring-inset" : ""
      }`}
    >
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${tagClass}`}
          >
            {label}
          </span>
          <span className="text-xs text-slate-400">{todos.length}</span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 px-2 pb-2"
      >
        <SortableContext
          items={todos.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {todos.map((todo) => (
            <KanbanCard
              key={todo._id}
              todo={todo}
              onDelete={onDelete}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </SortableContext>

        {todos.length === 0 && !showForm && (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-xs text-slate-400">No tasks</p>
          </div>
        )}
      </div>

      <div className="px-2 pb-3">
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Task name..."
              disabled={disabled}
              maxLength={500}
              autoFocus
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={disabled || !text.trim()}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setText("");
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={disabled}
            className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-200/80 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            New
          </button>
        )}
      </div>
    </div>
  );
}
