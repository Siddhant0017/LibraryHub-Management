
import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth } from "../firebaseConfig";


const StudyRoomReservation = () => {
  const [roomName, setRoomName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReservation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!auth.currentUser) {
      setMessage("❌ Please login to make a reservation");
      setLoading(false);
      return;
    }

    try {
      const reservationsRef = collection(db, "study_room_reservations");
      const q = query(
        reservationsRef,
        where("roomName", "==", roomName),
        where("date", "==", date)
      );

      const existingReservations = await getDocs(q);
      if (!existingReservations.empty) {
        setMessage("❌ Room is already booked for this time slot.");
        return;
      }

      await addDoc(reservationsRef, {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        userName: auth.currentUser.displayName || "Anonymous",
        roomName,
        date,
        startTime,
        endTime,
        createdAt: new Date().toISOString(),
      });

      setMessage("✅ Room booked successfully!");
      setRoomName("");
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Reservation error:", error);
      setMessage("❌ Error booking room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-3">Book a Study Room</h2>
      <form onSubmit={handleReservation}>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Booking..." : "Reserve Room"}
        </button>
      </form>
      {message && <p className="mt-3 text-red-500">{message}</p>}
    </div>
  );
};

export default StudyRoomReservation;