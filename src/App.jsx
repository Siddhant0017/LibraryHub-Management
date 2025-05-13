import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebaseConfig"; // Ensure Firebase is configured
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import RegistrationForm from "./Components/RegistrationForm";
import LibraryUpdatesForm from "./Components/LibraryUpdatesForm";
import LibraryUpdatesList from "./Components/LibraryUpdatesList";
import StudyRoomReservation from "./Components/StudyRoomReservation";
import AdminDashboard from "./Components/AdminDashboard";
import OverdueAlerts from "./Components/OverdueAlerts";

import AdminRegister from "./Components/AdminRegister";
import OverdueBooksForm from "./Components/OverdueBooksForm";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <Router>
      {user && <Navbar user={user} />}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={user ? <Navigate to="/library-updates" /> : <Login />}
        />
        <Route path="/register" element={<RegistrationForm />} />

        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Protected Routes */}
        <Route
          path="/overdue-alerts"
          element={user ? <OverdueAlerts /> : <Navigate to="/" />}
        />
        <Route
          path="/library-updates"
          element={user ? <LibraryUpdatesForm /> : <Navigate to="/" />}
        />
        <Route
          path="/update-list"
          element={user ? <LibraryUpdatesList /> : <Navigate to="/" />}
        />
        <Route
          path="/study-room"
          element={user ? <StudyRoomReservation /> : <Navigate to="/" />}
        />
        <Route path="/overdue-books" element={<OverdueBooksForm />} />

        {/* Only Admin Access */}
        <Route
          path="/admin-dashboard"
          element={
            user && user.email === "admin@example.com" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
