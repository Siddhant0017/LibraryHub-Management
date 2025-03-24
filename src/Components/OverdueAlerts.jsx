
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";

const OverdueAlerts = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      try {
        const userEmail = auth.currentUser.email;
        const q = query(
          collection(db, "borrowed_books"),
          where("user", "==", userEmail)
        );
        
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate?.toDate().toLocaleString()
        }));
        
        setOverdueBooks(books);
      } catch (error) {
        console.error("Error fetching overdue books:", error);
        setError("Failed to fetch overdue books");
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueBooks();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Overdue Books</h2>
      {overdueBooks.length === 0 ? (
        <p>No overdue books found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Book Title</th>
              <th className="border p-2">Due Date</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {overdueBooks.map((book) => (
              <tr key={book.id}>
                <td className="border p-2">{book.title}</td>
                <td className="border p-2">{book.dueDate}</td>
                <td className="border p-2 text-red-500">{book.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OverdueAlerts;