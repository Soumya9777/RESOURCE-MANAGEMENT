"use client";

interface TimetableRoom {
  roomName: string;
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

export default function ScheduleTable({
  timetable,
  days,
  timeSlots,
}: {
  timetable: TimetableRoom[];
  days: string[];
  timeSlots: string[];
}) {
  return (
    <div className="overflow-x-auto">
      {timetable.map((room) => (
        <div
          key={room.roomName}
          className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {room.roomName}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-2 font-medium text-gray-500 w-20">
                  Time
                </th>
                {days
                  .filter((_, i) => i !== 0 && i !== 6)
                  .map((day) => (
                    <th
                      key={day}
                      className="py-2 px-2 font-medium text-gray-500 text-center"
                    >
                      {day.slice(0, 3)}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="border-t border-gray-100">
                  <td className="py-2 px-2 text-gray-500 text-xs">{time}</td>
                  {room.weekData
                    .filter((_, i) => i !== 0 && i !== 6)
                    .map((dayData, di) => {
                      const slot = dayData.slots.find(
                        (s) => s.time === time
                      );
                      return (
                        <td
                          key={di}
                          className={`py-2 px-2 text-center text-xs rounded ${
                            slot?.isBusy
                              ? "bg-red-100 text-red-800"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {slot?.isBusy ? (
                            <span className="font-medium">
                              {slot.subject}
                              <br />
                              <span className="text-[10px] opacity-75">
                                {slot.faculty}
                              </span>
                            </span>
                          ) : (
                            <span className="text-[10px]">Free</span>
                          )}
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
