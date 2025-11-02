  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { FaArrowLeftLong } from "react-icons/fa6";
  import { useNavigate } from "react-router-dom";

  function AllEmployes() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/admin/employees", {
            withCredentials: true,
          });
          setEmployees(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
          console.error("Error fetching employees:", error);
          setEmployees([]);
        } finally {
          setLoading(false);
        }
      };

      fetchEmployees();
    }, []);

    // helper to safely format date
    const formatDate = (d) => {
      if (!d) return "—";
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return "—";
      return dt.toLocaleString();
    };

    // robust check for "active" check-in status — supports multiple possible field names
    const isEmployeeActive = (emp) => {
      if (!emp) return false;

      // common fields we try (in order):
      // - checkinStatus: "active"
      // - status: "active"
      // - activeCheckin: boolean true
      // - isCheckedIn: boolean true
      // - currentCheckin.status: "active"
      try {
        if (emp.checkinStatus === "active") return true;
        if (emp.status === "active") return true;
        if (emp.activeCheckin === true) return true;
        if (emp.isCheckedIn === true) return true;
        if (emp.currentCheckin && emp.currentCheckin.status === "active")
          return true;
      } catch (e) {
        // ignore
      }
      return false;
    };

    return (
      <div className="min-h-screen bg-gray-50 pt-[80px] px-4 md:px-12 lg:px-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaArrowLeftLong
              onClick={() => navigate(-1)}
              className="text-2xl text-gray-700 cursor-pointer hover:text-red-500 transition"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              All Registered Employees
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading employees...</p>
        ) : employees.length === 0 ? (
          <p className="text-gray-600">No employees found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b border-gray-300">
                  <th className="py-3 px-4 text-center border-r border-gray-300 w-16">S.No</th>
                  <th className="py-3 px-4 border-r border-gray-300 text-left">Name</th>
                  <th className="py-3 px-4 border-r border-gray-300 text-left">Email</th>
                  <th className="py-3 px-4 border-r border-gray-300 text-left">Role</th>
                  <th className="py-3 px-4 border-r border-gray-300 text-left">Registered On</th>
                  <th className="py-3 px-4 text-left w-28">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => {
                  const active = isEmployeeActive(emp);
                  return (
                    <tr
                      key={emp._id || emp.id || index}
                      className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                    >
                      <td className="py-3 px-4 text-center border-r border-gray-200 font-medium text-gray-700">
                        {index + 1}
                      </td>

                      {/* Name: green + underline if active */}
                      <td
                        className={`py-3 px-4 border-r border-gray-200 font-medium ${
                          active
                            ? "text-green-600 underline decoration-green-500 decoration-2 underline-offset-4"
                            : "text-gray-800"
                        }`}
                      >
                        {emp.name || "—"}
                      </td>

                      <td className="py-3 px-4 border-r border-gray-200 text-gray-600">
                        {emp.email || "—"}
                      </td>

                      <td className="py-3 px-4 border-r border-gray-200 text-gray-600 capitalize">
                        {emp.role || "employee"}
                      </td>

                      <td className="py-3 px-4 border-r border-gray-200 text-gray-600">
                        {formatDate(emp.createdAt)}
                      </td>

                      {/* Status badge column */}
                      <td className="py-3 px-4 text-gray-700">
                        {active ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  export default AllEmployes;
