"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Todo } from "@/lib/types";
import { formatDeadlineLabel, isNearDeadline } from "@/lib/todo-utils";

interface KanbanCardProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onOpenDetail?: (todo: Todo) => void;
}

export default function KanbanCard({
  todo,
  onDelete,
  onOpenDetail,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const urgent = isNearDeadline(todo.deadline);
  const hasDescription = Boolean(todo.description?.trim());

  function handleDoubleClick() {
    if (!onOpenDetail || isDragging) return;
    onOpenDetail(todo);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-lg border p-3 shadow-sm transition-shadow hover:shadow-md ${
        urgent
          ? "border-rose-400 bg-rose-50/70"
          : "border-slate-200 bg-white"
      } ${isDragging ? "opacity-40 shadow-lg ring-2 ring-indigo-400" : ""} ${
        todo.status === "done" ? "opacity-80" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 shrink-0 cursor-grab touch-none text-slate-300 hover:text-slate-500 active:cursor-grabbing"
          aria-label={`Drag "${todo.text}"`}
          {...attributes}
          {...listeners}
        >
          <svg
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </button>

        <div
          className="min-w-0 flex-1 cursor-text"
          onDoubleClick={handleDoubleClick}
          title={onOpenDetail ? "Double-click to edit" : undefined}
        >
          <div className="flex items-start gap-1.5">
            <span
              className={`block flex-1 text-sm leading-snug ${
                todo.status === "done"
                  ? "text-slate-400 line-through"
                  : "text-slate-800"
              }`}
            >
              {todo.text}
            </span>
            {hasDescription && (
              <span
                className="mt-0.5 shrink-0 text-indigo-400"
                title="Has description"
                aria-label="Has description"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </span>
            )}
          </div>
          {todo.deadline && (
            <span
              className={`mt-1 block text-xs ${
                urgent ? "font-medium text-rose-600" : "text-slate-400"
              }`}
            >
              Due {formatDeadlineLabel(todo.deadline)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDelete(todo._id)}
          aria-label={`Delete "${todo.text}"`}
          className="shrink-0 rounded-md p-1 text-slate-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100 focus:opacity-100"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
