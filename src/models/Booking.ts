import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  room: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
