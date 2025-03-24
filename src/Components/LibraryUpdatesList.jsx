import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const LibraryUpdatesList = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "library_updates"));
        const updatesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUpdates(updatesData);
      } catch (error) {
        console.error("Error fetching updates:", error);
        setError("Failed to fetch updates.");
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-5 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-3">Library Updates</h2>
      {updates.length === 0 ? (
        <p>No updates available.</p>
      ) : (
        updates.map((update) => (
          <div key={update.id} className="mb-3 p-3 border rounded">
            <h3 className="font-bold">{update.title}</h3>
            <p>{update.description}</p>
            <small className="text-gray-500">
              {update.date ? new Date(update.date.seconds * 1000).toLocaleDateString() : "Unknown date"}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default LibraryUpdatesList;