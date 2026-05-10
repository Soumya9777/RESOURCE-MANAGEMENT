import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Schedule from "@/models/Schedule";
import Room from "@/models/Room";
import { getAuthSession } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export async function GET() {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const rooms = await Room.find({ isActive: true }).sort({ name: 1 });
  const schedules = await Schedule.find({}).populate("room", "name");

  const timetable = rooms.map((room) => {
    const roomSchedules = schedules.filter(
      (s) => s.room._id.toString() === room._id.toString()
    );

    const weekData = DAYS.map((day, dayIndex) => {
      const daySchedules = roomSchedules.filter((s) => s.dayOfWeek === dayIndex);
      const slots = TIME_SLOTS.map((time) => {
        const slot = daySchedules.find(
          (s) => s.startTime === time
        );
        return {
          time,
          isBusy: !!slot,
          subject: slot?.subject || null,
          faculty: slot?.faculty || null,
          semester: slot?.semester || null,
        };
      });
      return { day, slots };
    });

    return {
      roomId: room._id,
      roomName: room.name,
      roomType: room.type,
      weekData,
    };
  });

  return NextResponse.json({
    timetable,
    timeSlots: TIME_SLOTS,
    days: DAYS,
  });
}
