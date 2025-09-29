import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TutorDashboard() {
  const [bookings, setBookings] = useState([]);
  const tutorId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    if (!tutorId) return;

    axios
      .get(`http://localhost:4000/api/bookings/tutor/${tutorId}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching tutor bookings:", err));
  }, [tutorId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>👨‍🏫 Tutor Dashboard</h2>
      <h3>📅 Upcoming Sessions</h3>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              With student <strong>{b.student?.name}</strong> on{" "}
              {new Date(b.date).toLocaleString()} ({b.mode})
              <button style={{ marginLeft: "10px" }}>✅ Available</button>
              <button style={{ marginLeft: "10px" }}>❌ Not Available</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
