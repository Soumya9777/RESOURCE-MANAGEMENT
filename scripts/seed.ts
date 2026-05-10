const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/resource-management";

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();

  const existingAdmin = await db.collection("users").findOne({ email: "admin@college.edu" });
  if (existingAdmin) {
    console.log("Admin user already exists, skipping seed.");
    await client.close();
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  await db.collection("users").insertOne({
    name: "Admin",
    email: "admin@college.edu",
    password: hashedPassword,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Seeded admin user:");
  console.log("  Email: admin@college.edu");
  console.log("  Password: admin123");

  const rooms = [
    { name: "Room 101", capacity: 40, type: "classroom", building: "Main Building", floor: 1, features: ["Projector", "AC"], isActive: true },
    { name: "Room 102", capacity: 35, type: "classroom", building: "Main Building", floor: 1, features: ["Whiteboard"], isActive: true },
    { name: "Room 201", capacity: 30, type: "lab", building: "Science Block", floor: 2, features: ["Computers", "Projector"], isActive: true },
    { name: "Auditorium", capacity: 200, type: "hall", building: "Main Building", floor: 0, features: ["Stage", "AC", "Sound System"], isActive: true },
    { name: "Seminar Hall", capacity: 80, type: "seminar", building: "Admin Block", floor: 1, features: ["Projector", "AC", "Conference Mic"], isActive: true },
  ];

  for (const room of rooms) {
    const existing = await db.collection("rooms").findOne({ name: room.name });
    if (!existing) {
      await db.collection("rooms").insertOne(room);
    }
  }

  console.log(`Seeded ${rooms.length} rooms.`);
  await client.close();
}

seed().catch(console.error);
