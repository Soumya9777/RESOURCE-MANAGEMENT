import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { isAdmin } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, password, role } = await req.json();
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "faculty",
    });

    return NextResponse.json(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
