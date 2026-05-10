"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Room {
  _id: string;
  name: string;
  capacity: number;
  type: string;
  building: string;
  floor: number;
  features: string[];
}

export default function AdminPanel({
  users: initialUsers,
  rooms: initialRooms,
}: {
  users: User[];
  rooms: Room[];
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [rooms, setRooms] = useState(initialRooms);
  const [activeTab, setActiveTab] = useState<"users" | "rooms">("users");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "users"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab("rooms")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "rooms"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Manage Rooms
        </button>
      </div>

      {activeTab === "users" ? (
        <UsersPanel users={users} setUsers={setUsers} />
      ) : (
        <RoomsPanel rooms={rooms} setRooms={setRooms} />
      )}
    </div>
  );
}

function UsersPanel({
  users,
  setUsers,
}: {
  users: User[];
  setUsers: (u: User[]) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("faculty");
  const [error, setError] = useState("");

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create user");
      return;
    }

    const newUser = await res.json();
    setUsers([newUser, ...users]);
    setName("");
    setEmail("");
    setPassword("");
    setRole("faculty");
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add User</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Add User
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Users</h2>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
            >
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full font-medium capitalize bg-indigo-50 text-indigo-700">
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoomsPanel({
  rooms,
  setRooms,
}: {
  rooms: Room[];
  setRooms: (r: Room[]) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("30");
  const [type, setType] = useState("classroom");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("1");
  const [features, setFeatures] = useState("");
  const [error, setError] = useState("");

  async function handleAddRoom(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        capacity: parseInt(capacity),
        type,
        building,
        floor: parseInt(floor),
        features: features.split(",").map((f) => f.trim()).filter(Boolean),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create room");
      return;
    }

    const newRoom = await res.json();
    setRooms([...rooms, newRoom]);
    setName("");
    setCapacity("30");
    setType("classroom");
    setBuilding("");
    setFloor("1");
    setFeatures("");
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Room</h2>
        <form onSubmit={handleAddRoom} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Room Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Capacity
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="classroom">Classroom</option>
              <option value="hall">Hall</option>
              <option value="lab">Lab</option>
              <option value="seminar">Seminar Room</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Building
              </label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Floor
              </label>
              <input
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Features (comma separated)
            </label>
            <input
              type="text"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="e.g. Projector, AC, Whiteboard"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Add Room
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rooms</h2>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{room.name}</p>
                  <p className="text-sm text-gray-500">
                    {room.type} &middot; Capacity: {room.capacity}
                  </p>
                  <p className="text-sm text-gray-400">
                    {room.building}, Floor {room.floor}
                  </p>
                </div>
              </div>
              {room.features.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
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
          ))}
        </div>
      </div>
    </div>
  );
}
