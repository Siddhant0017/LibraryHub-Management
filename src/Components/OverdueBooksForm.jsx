import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const OverdueBooksForm = () => {
  const [title, setTitle] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "borrowed_books"), {
        title,
        user: userEmail,
        dueDate: new Date(dueDate),
        status: "overdue"
      });

      setTitle("");
      setUserEmail("");
      setDueDate("");
      alert("Overdue book added successfully!");
    } catch (error) {
      console.error("Error adding overdue book:", error);
      setError("Failed to add overdue book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-3">Add Overdue Book</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Book Title"
          className="w-full p-2 mb-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="User Email"
          className="w-full p-2 mb-3 border rounded"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full p-2 mb-3 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Overdue Book"}
        </button>
      </form>
    </div>
  );
};

export default OverdueBooksForm;