import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchCustomer } from "../../redux/slices/customerSlice";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { customers, loading } = useSelector((state) => state.customers);
  const token =
    useSelector((state) => state.auth.token) || JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      dispatch(fetchCustomer());
    }
  }, [dispatch, token]);

  const handleDelete = async (id) => {
    if (!token) return console.error("No token found. Please log in.");

    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:3000/api/customer/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(fetchCustomer());
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customer List</h2>
        <button
          onClick={() => navigate("/employee-dashboard/customer/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Customer
        </button>
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((cust) => (
            <div
              key={cust._id}
              className="bg-white border rounded-lg shadow p-5 relative"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  🏢
                </div>
                <div>
                  <h3 className="text-lg font-bold">{cust.orgName}</h3>
                  <p className="text-sm text-gray-500">Name: {cust.name}</p>
                </div>
              </div>

              <div className="text-sm space-y-1 mb-3">
                <p className="flex items-center gap-1">
                  <HiOutlineMail /> {cust.email}
                </p>
                <p className="flex items-center gap-1">
                  <HiOutlinePhone /> {cust.phone}
                </p>
                <p className="flex items-center gap-1">
                  <HiOutlineLocationMarker />
                  {cust.address?.street}, {cust.address?.city}, {cust.address?.state} -{" "}
                  {cust.address?.zip}, {cust.address?.country}
                </p>
                <p className="flex items-center gap-1">
                  <HiOutlinePhone />Created By: {cust.createdBy?.name}
                </p>
              </div>

              {/* Static placeholders for invoices - replace with real stats if available */}
              <div className="flex justify-between items-center text-sm border-t pt-3">
                <div>
                  <p className="font-medium">0</p>
                  <p className="text-gray-500">Invoices</p>
                </div>
                <div>
                  <p className="font-medium">₹0</p>
                  <p className="text-gray-500">Total</p>
                </div>
                <div>
                  <p className="text-gray-500">Last invoice: N/A</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/employee-dashboard/customer/edit/${cust._id}`)}
                  className="flex-1 bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                 <button
         onClick={() =>
    navigate("/employee-dashboard/customer/create-quotation", {
      state: { customer: cust },
    })
  }
  className="flex-1 bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
>
  Create Quotation
</button>

                <button
                  onClick={() => handleDelete(cust._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
