import mongoose, { Schema, Document } from "mongoose";

export interface ISchedule extends Document {
  room: mongoose.Types.ObjectId;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string;
  endTime: string;
  subject: string;
  faculty: string;
  semester: string;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    dayOfWeek: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: String, required: true },
    faculty: { type: String, required: true },
    semester: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Schedule ||
  mongoose.model<ISchedule>("Schedule", ScheduleSchema);
