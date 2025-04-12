import mongoose, { Schema, Document } from "mongoose";

export interface ISchedule extends Document {
  trainerId: mongoose.Types.ObjectId;
  traineeId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      
    },
    traineeId: {
      type: Schema.Types.ObjectId,
      ref: "Trainee",
     
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
scheduleSchema.index({ trainerId: 1, date: 1 });
scheduleSchema.index({ traineeId: 1, date: 1 });

export const Schedule = mongoose.model<ISchedule>("Schedule", scheduleSchema);
