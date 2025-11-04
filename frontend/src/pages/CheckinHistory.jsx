// src/pages/CheckinHistory.jsx
import React, { useContext, useEffect, useState } from "react";
import { checkinDataContext } from "../context/CheckinContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function CheckinHistory() {
  const { fetchHistory } = useContext(checkinDataContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        setHistory(data);
      } catch (error) {
        console.error("History load failed:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [fetchHistory]);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d)) return "-";
    return d.toLocaleString();
  };

  const getStatusStyle = (status) => {
    const lower = (status || "").toLowerCase();
    if (lower === "active") return "text-green-600";
    if (lower === "auto-finished") return "text-black";
    if (lower === "checked-out") return "text-blue-600";
    return "text-gray-600";
  };

  const formatStatus = (status) => {
    if (!status) return "-";
    return status
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-6 md:px-12 lg:px-20 py-6 relative">
      {/* ✅ Visible Back Button (fixed on screen, always on top) */}
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
          🕒 Your Check-in History
        </h2>
      </div>

      {/* Table Section */}
      {loading ? (
        <p className="text-center text-gray-600 text-sm sm:text-base">
          Loading...
        </p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-600 text-sm sm:text-base">
          No history found.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
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
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {item.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.email || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(item.checkInTime)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(item.checkOutTime)}
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {formatStatus(item.status)}
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

export default CheckinHistory;
