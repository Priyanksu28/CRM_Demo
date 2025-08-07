import React from 'react'
import { FaTachometerAlt, FaFileInvoice } from 'react-icons/fa'
import { BiPurchaseTag } from "react-icons/bi";
import { TiDocumentAdd } from "react-icons/ti";
import { NavLink } from 'react-router-dom'
import { IoPersonAdd } from "react-icons/io5";

const EmpSidebar = () => {

  const user = JSON.parse(localStorage.getItem('user'));



  const userNameInitial = user?.name?.charAt(0).toUpperCase() || 'N'; 

  return (
    <div className='bg-gray-600 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64'>
      <div className='flex items-center justify-center h-16 bg-gray-900'>
        <h3 className='text-2xl text-center font-serif'>Viany Enterprise</h3>
      </div>
      <div className='px-4'>
        <NavLink to='/employee-dashboard' className='flex items-center gap-2 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors'>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to='/employee-dashboard/customer' className='flex items-center gap-2 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors'>
          <IoPersonAdd />
          <span>Customers</span>
        </NavLink>
        <NavLink to='/employee-dashboard/pi' className='flex items-center gap-2 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors'>
          <BiPurchaseTag />
          <span>PI</span>
        </NavLink>
        <NavLink to='/employee-dashboard/quotation' className='flex items-center gap-2 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors'>
          <TiDocumentAdd />
          <span>Quotation</span>
        </NavLink>
        <NavLink to='/employee-dashboard/invoice' className='flex items-center gap-2 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors'>
          <FaFileInvoice />
          <span>Invoice</span>
        </NavLink>
      </div>

      {/* Employee Details Section */}
      <div className='p-4 mt-[320px] bg-gray-700 '>
        <div className='flex items-center justify-center mb-2'>
          {/* Display the first letter of the user's name as a circular avatar */}
          <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-semibold">
            {userNameInitial}
          </div>
        </div>
        <h2 className='text-center text-xl font-semibold'>{user?.name || 'Employee Name'}</h2>
        <p className='text-center text-sm'>{user?.email || 'No email provided'}</p>
      </div>
    </div>
  )
}

export default EmpSidebar;
