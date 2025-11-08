import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { socketDataContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ToDayCheckOut() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useContext(socketDataContext);
  const navigate = useNavigate();

  const fetchToday = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/checkouts/today", {
        withCredentials: true,
      });

      const data = res.data || [];
      setList(data);
      data.forEach((item) => convertLatLongToAddress(item));
    } catch (err) {
      console.error("fetchToday error:", err);
    } finally {
      setLoading(false);
    }
  };

  const convertLatLongToAddress = async (item) => {
    const loc = item.location;
    if (!loc) return;
    if (loc.address) return;

    const lat = loc.lat || loc.latitude;
    const lng = loc.lng || loc.longitude;
    if (!lat || !lng) return;

    try {
      const apiKey = import.meta.env.VITE_GEOAPIKEY || "19e7a87a11564e6ba859a020238937c9";
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );
      const address = res.data.results?.[0]?.formatted;

      if (address) {
        setList((prev) =>
          prev.map((c) =>
            c._id === item._id ? { ...c, location: { ...c.location, address } } : c
          )
        );
      }
    } catch (err) {
      console.error("Address fetch error:", err);
    }
  };

  const renderLocation = (loc) => {
    if (!loc) return "-";
    if (loc.address) return loc.address;
    const lat = loc.lat || loc.latitude;
    const lng = loc.lng || loc.longitude;
    if (lat && lng) return `Lat: ${lat}, Long: ${lng}`;
    return "-";
  };

  useEffect(() => {
    fetchToday();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (data) => {
      if (!data?.checkOutTime) return;

      const today = new Date().toDateString();
      const checkOutDate = new Date(data.checkOutTime).toDateString();
      if (today !== checkOutDate) return;

      setList((prev) => {
        const exists = prev.find((i) => i._id === data._id);
        if (exists) {
          return prev.map((i) => (i._id === data._id ? data : i));
        }
        return [data, ...prev];
      });

      convertLatLongToAddress(data);
    };

    socket.on("updateCheckin", handleUpdate);
    return () => socket.off("updateCheckin", handleUpdate);
  }, [socket]);

  const downloadExcel = () => {
    const sheetData = list.map((item) => ({
      Name: item.user?.name || "-",
      Email: item.user?.email || "-",
      CheckIn: item.checkInTime ? new Date(item.checkInTime).toLocaleString() : "-",
      CheckOut: item.checkOutTime ? new Date(item.checkOutTime).toLocaleString() : "-",
      Address: item.location?.address || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Checkouts");
    XLSX.writeFile(workbook, "Today_Checkouts.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Today's Checkouts", 14, 10);

    const tableData = list.map((item) => [
      item.user?.name || "-",
      item.user?.email || "-",
      item.checkInTime ? new Date(item.checkInTime).toLocaleString() : "-",
      item.checkOutTime ? new Date(item.checkOutTime).toLocaleString() : "-",
      item.location?.address || "-",
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Check-In", "Check-Out", "Address"]],
      body: tableData,
      startY: 20,
    });

    doc.save("Today_Checkouts.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
      >
        ← Back
      </button>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Today's Checkouts</h2>

        <div className="flex gap-3 mb-4">
          <button onClick={downloadExcel} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Download Excel
          </button>

          <button onClick={downloadPDF} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Download PDF
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500">No checkouts today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Check-In</th>
                  <th className="px-4 py-2 text-left">Check-Out</th>
                  <th className="px-4 py-2 text-left">Address</th>
                </tr>
              </thead>

              <tbody>
                {list.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.user?.name || "-"}</td>
                    <td className="px-4 py-3">{item.user?.email || "-"}</td>
                    <td className="px-4 py-3">
                      {item.checkInTime ? new Date(item.checkInTime).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {item.checkOutTime ? new Date(item.checkOutTime).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3">{renderLocation(item.location)}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToDayCheckOut;
