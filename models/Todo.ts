import mongoose, { Schema, models } from "mongoose";

const TodoSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "done"],
      default: "not_started",
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },
    deadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

TodoSchema.index({ createdAt: -1 });
TodoSchema.index({ status: 1, createdAt: -1 });

export default models.Todo || mongoose.model("Todo", TodoSchema);
