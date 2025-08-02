import React, { useEffect,useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { addCustomers } from '../../redux/slices/customerSlice';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const AddCustomer = () => {
  const { id } = useParams(); // <-- get :id from URL
  const [customer, setCustomer] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const token = useSelector((state) => state.auth.token) || JSON.parse(localStorage.getItem("token"));
  const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem("user"));

  // Fetch customer if editing
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        if (id) {
          const response = await axios.get(`http://localhost:3000/api/customer/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setCustomer(response.data.customer);
          reset(response.data.customer); // populate form
        }
      } catch (err) {
        console.error("Failed to fetch customer", err.response?.data || err.message);
      }
    };

    fetchCustomer();
  }, [id, token, reset]);
  const onSubmit = async (data) => {
    try {
      if (!user?.id) {
        console.error("User ID is missing. Cannot proceed.");
        return;
      }

      const customerPayload = {
        ...data,
        createdBy: user.id,
      };

      const url = customer?._id
        ? `http://localhost:3000/api/customer/${customer._id}`
        : `http://localhost:3000/api/customer/`;
      const method = customer?._id ? 'put' : 'post';
      console.log(url);

      const response = await axios[method](url, customerPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!customer) {
        dispatch(addCustomers(response.data));
      }

      navigate("/employee-dashboard/customer");
    } catch (err) {
      console.error("Error submitting customer data", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        {customer ? 'Edit Customer' : 'Add Customer'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* --- Basic Info --- */}
        <section>
          <h3 className="text-xl font-medium text-gray-700 mb-4">Basic Information</h3>

          {/* Company Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-600">Company Name</label>
            <input
              type="text"
              {...register("orgName", {
                required: "Company name is required",
                minLength: { value: 3, message: "Must be at least 3 characters" }
              })}
              placeholder="Enter company name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.orgName && <p className="text-sm text-red-500">{errors.orgName.message}</p>}
          </div>

          {/* Contact Person Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-600">Contact Person Name</label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Minimum 3 characters" }
              })}
              placeholder="Enter full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format"
                }
              })}
              placeholder="Enter email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-600">Phone</label>
            <input
              type="tel"
              {...register("phone")}
              placeholder="Enter phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* --- Address Info --- */}
        <section>
          <h3 className="text-xl font-medium text-gray-700 mb-4">Address Information</h3>

          {/* Street */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-600">Street</label>
            <input
              type="text"
              {...register("address.street")}
              placeholder="Enter street"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-600">City</label>
            <input
              type="text"
              {...register("address.city")}
              placeholder="Enter city"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-600">State</label>
            <input
              type="text"
              {...register("address.state")}
              placeholder="Enter state"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ZIP */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-600">ZIP Code</label>
            <input
              type="text"
              {...register("address.zip")}
              placeholder="Enter ZIP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-600">Country</label>
            <input
              type="text"
              {...register("address.country")}
              defaultValue="India"
              placeholder="India"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* --- Additional Info --- */}
        <section>
          <h3 className="text-xl font-medium text-gray-700 mb-4">Additional Info</h3>

          {/* GSTIN */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-600">GSTIN</label>
            <input
              type="text"
              {...register("gstin")}
              placeholder="Enter GST number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            {customer ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
