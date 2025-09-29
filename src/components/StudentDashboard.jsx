import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const [bookings, setBookings] = useState([]);
  const studentId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`http://localhost:4000/api/bookings/student/${studentId}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching student bookings:", err));
  }, [studentId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎓 Student Dashboard</h2>
      <h3>📅 My Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              With tutor <strong>{b.tutor?.name}</strong> on{" "}
              {new Date(b.date).toLocaleString()} ({b.mode})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
