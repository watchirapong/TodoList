import Todo from "@/models/Todo";

let migrated = false;

export async function migrateTodos(): Promise<void> {
  if (migrated) return;

  await Todo.updateMany(
    { completed: { $exists: true } },
    [
      {
        $set: {
          status: {
            $cond: [{ $eq: ["$completed", true] }, "done", "not_started"],
          },
        },
      },
      { $unset: "completed" },
    ],
    { updatePipeline: true }
  );

  migrated = true;
}
