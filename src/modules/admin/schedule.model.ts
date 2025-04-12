import mongoose, { Document, Schema } from "mongoose";

export interface ISchedule extends Document {
  trainer: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  trainees: mongoose.Types.ObjectId[];
  day: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "pending" | "confirmed" | "cancelled";
  notes?: string;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    trainer: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User"},
    trainees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["scheduled", "pending", "confirmed", "cancelled"],
      default: "scheduled",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ISchedule>("Schedule", scheduleSchema);
