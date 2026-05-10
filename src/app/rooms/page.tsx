import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import FreeRoomsClient from "./FreeRoomsClient";

export default async function RoomsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/rooms`, {
    cache: "no-store",
  });
  const rooms = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={session.user?.role} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Rooms</h1>
        <FreeRoomsClient rooms={rooms} />
      </main>
    </div>
  );
}
