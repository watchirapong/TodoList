"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { COLUMNS, type Todo, type TodoEditPayload, type TodoStatus } from "@/lib/types";
import CardDetailModal from "./CardDetailModal";
import KanbanCard from "./KanbanCard";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  todos: Todo[];
  onAdd: (text: string, status: TodoStatus) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, payload: TodoEditPayload) => void;
  disabled?: boolean;
}

function getTargetStatus(
  overId: string,
  todos: Todo[]
): TodoStatus | null {
  if (COLUMNS.some((col) => col.id === overId)) {
    return overId as TodoStatus;
  }
  const overTodo = todos.find((t) => t._id === overId);
  return overTodo?.status ?? null;
}

export default function KanbanBoard({
  todos,
  onAdd,
  onStatusChange,
  onDelete,
  onEdit,
  disabled,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detailTodo, setDetailTodo] = useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const todosByStatus = useMemo(() => {
    const grouped: Record<TodoStatus, Todo[]> = {
      not_started: [],
      in_progress: [],
      done: [],
    };
    for (const todo of todos) {
      grouped[todo.status]?.push(todo);
    }
    return grouped;
  }, [todos]);

  const activeTodo = activeId
    ? todos.find((t) => t._id === activeId)
    : null;

  const detailTodoLive = detailTodo
    ? todos.find((t) => t._id === detailTodo._id) ?? detailTodo
    : null;

  function handleOpenDetail(todo: Todo) {
    setDetailTodo(todo);
  }

  function handleCloseDetail() {
    setDetailTodo(null);
  }

  function handleSaveDetail(id: string, payload: TodoEditPayload) {
    onEdit(id, payload);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const todoId = String(active.id);
    const targetStatus = getTargetStatus(String(over.id), todos);
    if (!targetStatus) return;

    const todo = todos.find((t) => t._id === todoId);
    if (!todo || todo.status === targetStatus) return;

    onStatusChange(todoId, targetStatus);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            status={col.id}
            label={col.label}
            tagClass={col.tagClass}
            todos={todosByStatus[col.id]}
            onAdd={onAdd}
            onDelete={onDelete}
            onOpenDetail={handleOpenDetail}
            disabled={disabled}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTodo ? (
          <div className="rotate-2 scale-105 cursor-grabbing">
            <KanbanCard todo={activeTodo} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>

      {detailTodoLive && (
        <CardDetailModal
          todo={detailTodoLive}
          onSave={handleSaveDetail}
          onClose={handleCloseDetail}
        />
      )}
    </DndContext>
  );
}
