import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import { getAuthSession } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const roomId = searchParams.get("roomId");

  await connectDB();
  const filter: Record<string, unknown> = {};
  if (date) filter.date = new Date(date);
  if (roomId) filter.room = roomId;

  if (session.user?.role !== "admin") {
    filter.user = session.user?.id;
  }

  const bookings = await Booking.find(filter)
    .populate("room", "name type")
    .populate("user", "name email")
    .sort({ date: -1, startTime: 1 });

  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { roomId, title, date, startTime, endTime } = await req.json();

    await connectDB();

    const room = await Room.findById(roomId);
    if (!room || !room.isActive) {
      return NextResponse.json({ error: "Room not available" }, { status: 400 });
    }

    const conflict = await Booking.findOne({
      room: roomId,
      date: new Date(date),
      status: { $ne: "rejected" },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
      ],
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Room is already booked for this time slot" },
        { status: 409 }
      );
    }

    const booking = await Booking.create({
      room: roomId,
      user: session.user?.id,
      title,
      date: new Date(date),
      startTime,
      endTime,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
