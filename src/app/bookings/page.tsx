import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import BookingsClient from "./BookingsClient";

export default async function BookingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [roomsRes, bookingsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/rooms`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/bookings`, {
      cache: "no-store",
    }),
  ]);

  const rooms = await roomsRes.json();
  const bookings = await bookingsRes.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={session.user?.role} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Bookings</h1>
        <BookingsClient rooms={rooms} bookings={bookings} />
      </main>
    </div>
  );
}
