import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">Library Management</Link>
          </div>

          {/* Hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/library-updates" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Add Books</Link>
            <Link to="/update-list" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Book List</Link>
            <Link to="/study-room" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Study Room</Link>
            <Link to="/overdue-alerts" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Overdue Alerts</Link>
            {user?.email === "admin@example.com" && (
              <Link to="/admin-dashboard" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Admin Dashboard</Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden pb-4`}>
          <div className="flex flex-col space-y-2">
            <Link to="/library-updates" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Add Books</Link>
            <Link to="/update-list" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Book List</Link>
            <Link to="/study-room" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Study Room</Link>
            <Link to="/overdue-alerts" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Overdue Alerts</Link>
            {user?.email === "admin@example.com" && (
              <Link to="/admin-dashboard" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Admin Dashboard</Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;