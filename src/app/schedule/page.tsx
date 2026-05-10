import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import ScheduleTable from "./ScheduleTable";

export default async function SchedulePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/schedule`, {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={session.user?.role} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Weekly Schedule
        </h1>
        <p className="text-gray-500 mb-6">
          Full weekly overview of room-wise class schedule. Green = free, Red =
          busy.
        </p>
        <ScheduleTable
          timetable={data.timetable || []}
          days={data.days || []}
          timeSlots={data.timeSlots || []}
        />
      </main>
    </div>
  );
}
