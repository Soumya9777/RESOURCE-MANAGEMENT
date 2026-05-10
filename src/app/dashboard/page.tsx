import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import WeeklyChart from "@/components/WeeklyChart";

export default async function DashboardPage() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {session.user?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Rooms"
            value={data.timetable?.length || 0}
            color="indigo"
          />
          <StatCard
            title="Time Slots"
            value={data.timeSlots?.length || 0}
            color="emerald"
          />
          <StatCard
            title="Days Tracked"
            value={data.days?.length || 0}
            color="amber"
          />
        </div>

        <WeeklyChart
          timetable={data.timetable || []}
          timeSlots={data.timeSlots || []}
        />
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <div
      className={`rounded-xl border p-6 ${colors[color] || colors.indigo}`}
    >
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
