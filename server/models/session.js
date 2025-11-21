import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "escalated", "closed"],
      default: "open",
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
