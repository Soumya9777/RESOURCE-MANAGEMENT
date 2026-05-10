"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TimetableRoom {
  roomId: string;
  roomName: string;
  roomType: string;
  weekData: {
    day: string;
    slots: {
      time: string;
      isBusy: boolean;
      subject: string | null;
      faculty: string | null;
      semester: string | null;
    }[];
  }[];
}

export default function WeeklyChart({
  timetable,
  timeSlots,
}: {
  timetable: TimetableRoom[];
  timeSlots: string[];
}) {
  const usageData = timeSlots.map((slot) => {
    const row: Record<string, string | number> = { time: slot };
    timetable.forEach((room) => {
      const busyCount = room.weekData.filter((day) =>
        day.slots.find((s) => s.time === slot && s.isBusy)
      ).length;
      row[room.roomName] = busyCount;
    });
    return row;
  });

  const roomNames = timetable.map((r) => r.roomName);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Weekly Room Utilization
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={usageData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {roomNames.map((name, i) => (
            <Bar
              key={name}
              dataKey={name}
              name={name}
              fill={`hsl(${i * 45 + 200}, 60%, 60%)`}
              stackId="a"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
