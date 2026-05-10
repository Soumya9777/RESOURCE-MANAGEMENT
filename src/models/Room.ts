import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  capacity: number;
  type: "classroom" | "hall" | "lab" | "seminar";
  building: string;
  floor: number;
  features: string[];
  isActive: boolean;
}

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    type: {
      type: String,
      enum: ["classroom", "hall", "lab", "seminar"],
      required: true,
    },
    building: { type: String, required: true },
    floor: { type: Number, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);
