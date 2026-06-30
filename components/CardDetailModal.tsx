"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Todo, TodoEditPayload } from "@/lib/types";
import { dateInputToISO, isoToDateInput } from "@/lib/todo-utils";

interface CardDetailModalProps {
  todo: Todo;
  onSave: (id: string, payload: TodoEditPayload) => void;
  onClose: () => void;
}

export default function CardDetailModal({
  todo,
  onSave,
  onClose,
}: CardDetailModalProps) {
  const [text, setText] = useState(todo.text);
  const [description, setDescription] = useState(todo.description);
  const [deadline, setDeadline] = useState(isoToDateInput(todo.deadline));

  useEffect(() => {
    setText(todo.text);
    setDescription(todo.description);
    setDeadline(isoToDateInput(todo.deadline));
  }, [todo]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSave(todo._id, {
      text: trimmed,
      description: description.trim(),
      deadline: dateInputToISO(deadline),
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60"
      >
        <h2
          id="card-detail-title"
          className="mb-4 text-lg font-semibold text-slate-900"
        >
          Edit task
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="card-title"
              className="mb-1 block text-xs font-medium text-slate-500"
            >
              Title
            </label>
            <input
              id="card-title"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              autoFocus
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="card-description"
              className="mb-1 block text-xs font-medium text-slate-500"
            >
              Description
            </label>
            <textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              rows={4}
              placeholder="Add details..."
              className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="card-deadline"
              className="mb-1 block text-xs font-medium text-slate-500"
            >
              Deadline
            </label>
            <input
              id="card-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!text.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
