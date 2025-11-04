import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";

function UserHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/history/${id}`,
          { withCredentials: true }
        );
        setHistory(res.data);
      } catch (error) {
        console.error("Error fetching user history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* 🔙 Fixed Back Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all shadow-md text-sm sm:text-base"
      >
        <FaArrowLeftLong className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="flex justify-center mb-10 mt-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center">
          🧍‍♂️ User Check-in History
        </h2>
      </div>

      {/* Table Section */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-600">No history found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Check-in Time</th>
                <th className="px-4 py-3 text-left">Check-out Time</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    {new Date(item.checkInTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {item.checkOutTime
                      ? new Date(item.checkOutTime).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {item.status || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserHistory;
