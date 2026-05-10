"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Room {
  _id: string;
  name: string;
  type: string;
}

interface Booking {
  _id: string;
  room: { _id: string; name: string; type: string };
  user: { _id: string; name: string; email: string };
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function BookingsClient({
  rooms,
  bookings,
}: {
  rooms: Room[];
  bookings: Booking[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [roomId, setRoomId] = useState(rooms[0]?._id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, title, date, startTime, endTime }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to book room");
      return;
    }

    setSuccess("Room booked successfully!");
    setTitle("");
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Book a Room</h2>
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Club Meeting"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Room
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name} ({room.type})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Start
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                End
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          {success && (
            <p className="text-emerald-600 text-sm bg-emerald-50 px-3 py-2 rounded-lg">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Book Room
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Bookings
        </h2>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {bookings.length === 0 && (
            <p className="text-gray-500 text-center py-8">No bookings yet.</p>
          )}
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{booking.title}</p>
                  <p className="text-sm text-gray-500">
                    {booking.room?.name || "Unknown Room"}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    booking.status === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : booking.status === "rejected"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(booking.date).toLocaleDateString()} &middot;{" "}
                {booking.startTime} - {booking.endTime}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
