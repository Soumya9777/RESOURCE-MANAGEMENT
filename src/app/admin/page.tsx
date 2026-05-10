import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import AdminPanel from "./AdminPanel";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user?.role !== "admin") redirect("/dashboard");

  const [usersRes, roomsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/users`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/rooms`, {
      cache: "no-store",
    }),
  ]);

  const users = await usersRes.json();
  const rooms = await roomsRes.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={session.user?.role} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        <AdminPanel users={users} rooms={rooms} />
      </main>
    </div>
  );
}
