import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookingPage() {
  const { id } = useParams(); // tutorId from URL
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("Video Call");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentId = parseInt(localStorage.getItem("userId")); // logged-in student
    const tutorId = parseInt(id);

    if (!studentId || !tutorId) {
      alert("❌ Invalid IDs. Please log in again.");
      return;
    }

    // Merge date + time into ISO format
    const combinedDateTime = new Date(`${date}T${time}:00Z`).toISOString();

    try {
      await axios.post("http://localhost:4000/api/bookings", {
        studentId,
        tutorId,
        date: combinedDateTime,
        mode,
      });
      alert("✅ Booking confirmed!");
      setDate("");
      setTime("");
    } catch (err) {
      console.error("❌ Booking failed:", err.response?.data || err.message);
      alert("❌ Booking failed. Check backend logs.");
    }
  };

  return (
    <div className="booking-container" style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>📅 Book Session with Tutor</h2>
      <form className="booking-form" onSubmit={handleSubmit}>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <label>Mode</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option>In-Person</option>
          <option>Video Call</option>
        </select>

        <button type="submit" className="confirm-btn" style={{ marginTop: "10px" }}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
