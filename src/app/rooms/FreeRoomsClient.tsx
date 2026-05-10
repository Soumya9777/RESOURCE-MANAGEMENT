"use client";

import { useState, useMemo } from "react";

interface Room {
  _id: string;
  name: string;
  capacity: number;
  type: string;
  building: string;
  floor: number;
  features: string[];
}

const TIME_SLOTS = [
  "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
  "16:00-17:00",
];

export default function FreeRoomsClient({ rooms }: { rooms: Room[] }) {
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);

  const busyRoomIds = useMemo(() => {
    return new Set<string>();
  }, [selectedDay, selectedTime]);

  const freeRooms = rooms.filter((r) => !busyRoomIds.has(r._id));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Check Free Rooms
        </h2>
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date
            </label>
            <input
              type="date"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Time Slot
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-3 text-sm text-emerald-600 font-medium">
          {freeRooms.length} room{freeRooms.length !== 1 ? "s" : ""} free
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {freeRooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">{room.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-500">
              <p>
                {room.type} &middot; Capacity: {room.capacity}
              </p>
              <p>
                {room.building}, Floor {room.floor}
              </p>
              {room.features.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {room.features.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {freeRooms.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-12">
            No free rooms available for this time slot.
          </p>
        )}
      </div>
    </div>
  );
}
