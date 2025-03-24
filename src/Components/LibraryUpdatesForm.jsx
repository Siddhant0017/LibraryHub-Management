

import { useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const LibraryUpdatesForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Add to library_updates collection
      await addDoc(collection(db, "library_updates"), {
        title,
        description,
        date: serverTimestamp(),
      });

      // Add to borrowed_books collection
      await addDoc(collection(db, "borrowed_books"), {
        title,
        user: auth.currentUser.email,
        borrowDate: new Date(borrowDate),
        dueDate: new Date(dueDate),
        status: "borrowed"
      });

      setTitle("");
      setDescription("");
      setBorrowDate("");
      setDueDate("");
      alert("Book information added successfully!");
    } catch (error) {
      console.error("Error adding book info:", error);
      setError("Failed to add book information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-3">Add Borrowed Book Information</h2>
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
        <textarea
          placeholder="Book Description"
          className="w-full p-2 mb-3 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <div className="mb-3">
          <label className="block text-sm mb-1">Borrow Date:</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={borrowDate}
            onChange={(e) => setBorrowDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Due Date:</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Book Information"}
        </button>
      </form>
    </div>
  );
};

export default LibraryUpdatesForm;