// src/pages/CheckinHistory.jsx
import React, { useContext, useEffect, useState } from "react";
import { checkinDataContext } from "../context/CheckinContext";

function CheckinHistory() {
  const { fetchHistory } = useContext(checkinDataContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-6 md:px-12 lg:px-20 py-6">
      {/* Header */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
        🕒 Your Check-in History
      </h2>

      {loading ? (
        <p className="text-center text-gray-600 text-sm sm:text-base">Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-600 text-sm sm:text-base">
          No history found.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap">
                  Name
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap">
                  Email
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap">
                  Check-in Time
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap">
                  Check-out Time
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800 font-medium break-words max-w-[150px] sm:max-w-none">
                    {item.name || "-"}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 break-words max-w-[180px] sm:max-w-none">
                    {item.email || "-"}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(item.checkInTime)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(item.checkOutTime)}
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-2 sm:py-3 font-semibold ${
                      item.status === "Active"
                        ? "text-green-600"
                        : item.status === "Auto Finished"
                        ? "text-orange-500"
                        : "text-blue-600"
                    }`}
                  >
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

export default CheckinHistory;
