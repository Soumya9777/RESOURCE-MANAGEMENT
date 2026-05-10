import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Room from "@/models/Room";
import { getAuthSession, isAdmin } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const rooms = await Room.find({ isActive: true }).sort({ name: 1 });
  return NextResponse.json(rooms);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await connectDB();
    const room = await Room.create(data);
    return NextResponse.json(room, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
