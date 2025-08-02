import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { fetchEmployees } from "../../redux/slices/employeeSlice";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token) || JSON.parse(localStorage.getItem("token"));
  const { employees } = useSelector((state) => state.employees);

  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(fetchEmployees()); 
    }
  }, [dispatch]);

  useEffect(() => {
    const emp = employees.find((e) => e._id === id);
    if (emp) {
      setValue("employeeId", emp.employeeId);
      setValue("name", emp.name);
      setValue("email", emp.email);
      setValue("phone", emp.phone);
      setLoading(false);
    }
  }, [employees, id, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:3000/api/admin/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh list and navigate back
      dispatch(fetchEmployees());
      navigate("/admin-dashboard/employees");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) return <p>Loading employee data...</p>;

  return (
    <div className='max-w-full mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Edit Employee</h2>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <label>Employee ID</label>
          <input
            {...register("employeeId", { required: "Employee ID is required" })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          {errors.employeeId && <p className="text-red-500">{errors.employeeId.message}</p>}
        </div>

        <div>
          <label>Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label>Phone</label>
          <input
            type="number"
            {...register("phone", { required: "Phone number is required" })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>

        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
