import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import SummaryCard from './SummaryCard';
import { FaUser } from 'react-icons/fa';

const AdminSummary = () => {
  const dispatch = useDispatch();

  // Access the employees and loading state from Redux store
  const { employees, loading, error } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees()); // Dispatch the fetch action to load employees data
  }, [dispatch]);

  if (loading) {
    return <p>Loading employees...</p>;
  }

  if (error) {
    return <p>Error loading employees: {error}</p>;
  }

  // Check if employees data exists before rendering the SummaryCard
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Ensure you're rendering the correct number of employees */}
        <SummaryCard
          icon={<FaUser />}
          text="Total Employees"
          number={employees ? employees.length : 0} // Check for valid employees length
        />
      </div>
    </div>
  );
};

export default AdminSummary;
