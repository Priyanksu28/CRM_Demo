import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios"; // For API request
import { useDispatch } from "react-redux"; // Dispatch to Redux
import { useNavigate } from "react-router-dom"; // For redirection
import { addEmployee } from "../../redux/slices/employeeSlice"; // Add this action to Redux
 import { useSelector } from 'react-redux';

const Add = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use for redirection

const token = useSelector((state) => state.auth.token) || JSON.parse(localStorage.getItem("token"));

const onSubmit = async (data) => {
  try {
    console.log("Sending data:", data);
    const response = await axios.post("http://localhost:3000/api/admin/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    dispatch(addEmployee(response.data));
    navigate("/admin-dashboard/employees");
  } catch (err) {
    console.error("Error adding employee", err);
  }
};


  return (
    <div className="max-w-full mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Employee ID */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Employee ID</label>
          <input
            id="employeeId"
            type="text"
            {...register('employeeId', {
              required: 'Employee ID is required',
              maxLength: { value: 15, message: 'Employee ID cannot exceed 15 characters' }
            })}
            placeholder="Enter Employee ID"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.employeeId && <p className="text-red-500 text-sm mt-1 text-left">{errors.employeeId.message}</p>}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: "Name is required",
              maxLength: { value: 50, message: 'Name cannot exceed 50 characters' }
            })}
            placeholder="Enter Employee Name"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1 text-left">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email Address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="Enter your email"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1 text-left">{errors.email.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
          <input
            id="phone"
            type="text"
            {...register('phone', {
              required: 'Phone Number is required',
              minLength: { value: 10, message: 'Phone Number must be at least 10 digits' },
              maxLength: { value: 15, message: 'Phone Number cannot exceed 15 digits' }
            })}
            placeholder="Enter your phone number"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1 text-left">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 5, message: 'Password must be at least 6 characters' },
              maxLength: { value: 20, message: 'Password cannot exceed 20 characters' }
            })}
            placeholder="Enter your password"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1 text-left">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
