import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { employees, loading } = useSelector((state) => state.employees);
  const token = useSelector((state) => state.auth.token) || JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, token]);

  const handleDelete = async (id) => {
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Re-fetch the employees list after successful delete
        dispatch(fetchEmployees());
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employee List</h2>
        <button
          onClick={() => navigate("/admin-dashboard/employees/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Employee ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone No.</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(employees) &&
                employees.map((emp) => (
                  <tr key={emp._id} className="border-t">
                    <td className="px-4 py-2">{emp.employeeId}</td>
                    <td className="px-4 py-2">{emp.name}</td>
                    <td className="px-4 py-2">{emp.email}</td>
                    <td className="px-4 py-2">{emp.phone}</td>
                    <td className="px-4 py-2 space-x-2">
                     <button
  onClick={() => navigate(`/admin-dashboard/employees/edit/${emp._id}`)}
  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
>
  Edit
</button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default List;
