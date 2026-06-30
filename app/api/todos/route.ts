import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { migrateTodos } from "@/lib/migrate-todos";
import {
  isValidStatus,
  parseDeadlineInput,
  parseDescriptionInput,
  serializeTodo,
} from "@/lib/todo-utils";
import { getOrCreateUserId } from "@/lib/user-id";
import Todo from "@/models/Todo";

export async function GET() {
  try {
    const userId = await getOrCreateUserId();
    await connectDB();
    await migrateTodos();
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({
      todos: todos.map(serializeTodo),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getOrCreateUserId();
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: "Text must be 500 characters or fewer" },
        { status: 400 }
      );
    }

    const status = body.status !== undefined ? body.status : "not_started";
    if (!isValidStatus(status)) {
      return NextResponse.json(
        { error: "status must be not_started, in_progress, or done" },
        { status: 400 }
      );
    }

    const deadlineResult = parseDeadlineInput(body.deadline);
    if (deadlineResult.error) {
      return NextResponse.json(
        { error: deadlineResult.error },
        { status: 400 }
      );
    }

    const descriptionResult = parseDescriptionInput(body.description);
    if (descriptionResult.error) {
      return NextResponse.json(
        { error: descriptionResult.error },
        { status: 400 }
      );
    }

    await connectDB();
    const todo = await Todo.create({
      userId,
      text,
      status,
      ...(descriptionResult.description !== undefined
        ? { description: descriptionResult.description }
        : {}),
      ...(deadlineResult.deadline !== undefined
        ? { deadline: deadlineResult.deadline }
        : {}),
    });
    return NextResponse.json({ todo: serializeTodo(todo) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
