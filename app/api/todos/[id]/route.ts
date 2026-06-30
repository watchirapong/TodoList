import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  isValidStatus,
  parseDeadlineInput,
  parseDescriptionInput,
  serializeTodo,
} from "@/lib/todo-utils";
import { getOrCreateUserId } from "@/lib/user-id";
import Todo from "@/models/Todo";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getOrCreateUserId();
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const body = await request.json();
    const updates: {
      status?: string;
      text?: string;
      description?: string;
      deadline?: Date | null;
    } = {};

    if (body.status !== undefined) {
      if (!isValidStatus(body.status)) {
        return NextResponse.json(
          { error: "status must be not_started, in_progress, or done" },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (body.text !== undefined) {
      if (typeof body.text !== "string") {
        return NextResponse.json(
          { error: "text must be a string" },
          { status: 400 }
        );
      }
      const text = body.text.trim();
      if (!text) {
        return NextResponse.json(
          { error: "Text cannot be empty" },
          { status: 400 }
        );
      }
      if (text.length > 500) {
        return NextResponse.json(
          { error: "Text must be 500 characters or fewer" },
          { status: 400 }
        );
      }
      updates.text = text;
    }

    if (body.description !== undefined) {
      const descriptionResult = parseDescriptionInput(body.description);
      if (descriptionResult.error) {
        return NextResponse.json(
          { error: descriptionResult.error },
          { status: 400 }
        );
      }
      updates.description = descriptionResult.description ?? "";
    }

    if (body.deadline !== undefined) {
      const deadlineResult = parseDeadlineInput(body.deadline);
      if (deadlineResult.error) {
        return NextResponse.json(
          { error: deadlineResult.error },
          { status: 400 }
        );
      }
      updates.deadline = deadlineResult.deadline ?? null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    await connectDB();
    const todo = await Todo.findOneAndUpdate({ _id: id, userId }, updates, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ todo: serializeTodo(todo) });
  } catch {
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getOrCreateUserId();
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    await connectDB();
    const todo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
