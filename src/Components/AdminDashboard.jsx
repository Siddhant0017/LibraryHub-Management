import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import OverdueBooksForm from "./OverdueBooksForm";  // Add this import

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [libraryUpdates, setLibraryUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUsers();
        await fetchBookings();
        await fetchOverdueBooks();
        await fetchLibraryUpdates();
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Users
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    const querySnapshot = await getDocs(collection(db, "study_room_reservations"));
    const bookingsData = await Promise.all(
      querySnapshot.docs.map(async (document) => {
        const data = document.data();
        let userName = data.userEmail || data.userName || "Anonymous";  // Changed to prioritize userEmail

        // Only try to fetch user details if we have a userId
        if (data.userId) {
          try {
            const userRef = doc(db, "users", data.userId);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              userName = userDoc.data().name || userName;
            }
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        }

        return {
          id: document.id,
          ...data,
          user: userName,
          date: data.date || "Invalid Date",
          startTime: data.startTime || "Invalid Time",
          endTime: data.endTime || "Invalid Time",
        };
      })
    );

    setBookings(bookingsData);
  };

  // Fetch Overdue Books
  const fetchOverdueBooks = async () => {
    const querySnapshot = await getDocs(collection(db, "borrowed_books"));
    setOverdueBooks(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate().toLocaleString(),
      }))
    );
  };

  // Fetch Library Updates
  const fetchLibraryUpdates = async () => {
    const querySnapshot = await getDocs(collection(db, "library_updates"));
    setLibraryUpdates(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate().toLocaleString(),
      }))
    );
  };

  // Delete Function
  const handleDelete = async (collectionName, id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === "study_room_reservations") await fetchBookings();
      if (collectionName === "borrowed_books") await fetchOverdueBooks();
      if (collectionName === "users") await fetchUsers();
      if (collectionName === "library_updates") await fetchLibraryUpdates();  // Added this line
    } catch (err) {
      setError("Failed to delete.");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h2>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Active Bookings</h3>
            <p className="text-2xl font-bold text-green-600">{bookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Overdue Books</h3>
            <p className="text-2xl font-bold text-red-600">{overdueBooks.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Library Updates</h3>
            <p className="text-2xl font-bold text-purple-600">{libraryUpdates.length}</p>
          </div>
        </div>

        {/* Add Overdue Books Form */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6">
            <OverdueBooksForm />
          </div>
        </div>

        {/* Data Tables */}
        <div className="space-y-8">
          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Users</h3>
              <table className="w-full border">
                <thead>
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="border p-2">{user.name}</td>
                      <td className="border p-2">{user.email}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleDelete("users", user.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Study Room Bookings</h3>
              <table className="w-full border">
                <thead>
                  <tr>
                    <th className="border p-2">User</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Start Time</th>
                    <th className="border p-2">End Time</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="border p-2">{booking.user}</td>
                      <td className="border p-2">{booking.date}</td>
                      <td className="border p-2">{booking.startTime}</td>
                      <td className="border p-2">{booking.endTime}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleDelete("study_room_reservations", booking.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Overdue Books Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Overdue Books</h3>
              <table className="w-full border">
                <thead>
                  <tr>
                    <th className="border p-2">Title</th>
                    <th className="border p-2">User</th>
                    <th className="border p-2">Due Date</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueBooks.map((book) => (
                    <tr key={book.id}>
                      <td className="border p-2">{book.title}</td>
                      <td className="border p-2">{book.user}</td>
                      <td className="border p-2">{book.dueDate}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleDelete("borrowed_books", book.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Library Updates Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Library Updates</h3>
              <table className="w-full border">
                <thead>
                  <tr>
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {libraryUpdates.map((update) => (
                    <tr key={update.id}>
                      <td className="border p-2">{update.title}</td>
                      <td className="border p-2">{update.date}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleDelete("library_updates", update.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;