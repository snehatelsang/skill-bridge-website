// backend/server.js (ESM)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// health
app.get("/", (req, res) => res.send("API running"));

// ----------------- SIGNUP -----------------
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, role, subject, rate, location, description } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
        subject: role === "TUTOR" ? subject : null,
        rate: role === "TUTOR" ? parseInt(rate) : null,  // ✅ ensure Int
        location,
        description,
      }
    });

    res.json(user);
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

// ----------------- SIGNIN -----------------
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    return res.json({ id: user.id, name: user.name, role: user.role });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Signin failed" });
  }
});

/* =============== LOGIN =============== */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});


/* =============== TUTORS =============== */
app.get("/tutors", async (req, res) => {
  const tutors = await prisma.user.findMany({
    where: { role: "TUTOR" }
  });
  res.json(tutors);
});

/* =============== BOOKINGS =============== */
app.post("/api/bookings", async (req, res) => {
  try {
    const { studentId, tutorId, date, mode } = req.body;

    // Ensure student exists
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== "STUDENT") {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    // Ensure tutor exists
    const tutor = await prisma.user.findUnique({ where: { id: tutorId } });
    if (!tutor || tutor.role !== "TUTOR") {
      return res.status(400).json({ error: "Invalid tutor ID" });
    }

    // Save booking
    const booking = await prisma.booking.create({
      data: {
        studentId,
        tutorId,
        date: new Date(date),
        mode,
      },
      include: {
        student: true,
        tutor: true,
      },
    });

    res.json(booking);
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ error: "Booking failed", details: err.message });
  }
});

// ✅ Fetch student bookings
app.get("/api/bookings/student/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);
  try {
    const bookings = await prisma.booking.findMany({
      where: { studentId },
      include: { tutor: true },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student bookings" });
  }
});

// ✅ Fetch tutor bookings
app.get("/api/bookings/tutor/:id", async (req, res) => {
  const tutorId = parseInt(req.params.id);
  try {
    const bookings = await prisma.booking.findMany({
      where: { tutorId },
      include: { student: true },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tutor bookings" });
  }
});


/* =============== MESSAGES =============== */
// Send a message
app.post("/messages", async (req, res) => {
  try {
    const { fromUserId, toUserId, content } = req.body;

    const message = await prisma.message.create({
      data: {
        fromUserId: parseInt(fromUserId),
        toUserId: parseInt(toUserId),
        content,
      },
    });

    res.json(message);
  } catch (err) {
    console.error("❌ Message error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/messages/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: parseInt(user1), toUserId: parseInt(user2) },
          { fromUserId: parseInt(user2), toUserId: parseInt(user1) },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (err) {
    console.error("❌ Fetch messages error:", err);
    res.status(500).json({ error: err.message });
  }
});



/* =============== START SERVER =============== */
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
app.get("/", (req, res) => res.send("✅ API is running"));


