import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Room from "@/models/Room";
import { isAdmin } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const data = await req.json();
    await connectDB();
    const room = await Room.findByIdAndUpdate(id, data, { new: true });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await connectDB();
    const room = await Room.findByIdAndUpdate(id, { isActive: false });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Room deactivated" });
  } catch {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
