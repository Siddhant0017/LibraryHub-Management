// import { Navigate } from "react-router-dom";
// import { auth } from "../firebaseConfig";

// const ProtectedRoute = ({ children }) => {
//   return auth.currentUser ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;


import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

const ProtectedRoute = ({ user, adminOnly, children }) => {
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.email !== "admin@example.com") return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;