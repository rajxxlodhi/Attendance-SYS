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
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🕒 Your Check-in History
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-600">No history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Check-in Time</th>
                <th className="px-4 py-2 text-left">Check-out Time</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.email}</td>
                  <td className="px-4 py-2">{formatDate(item.checkInTime)}</td>
                  <td className="px-4 py-2">{formatDate(item.checkOutTime)}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      item.status === "Active"
                        ? "text-green-600"
                        : item.status === "Auto Finished"
                        ? "text-orange-500"
                        : "text-blue-600"
                    }`}
                  >
                    {item.status}
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
