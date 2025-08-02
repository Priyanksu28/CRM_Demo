import React from 'react'
import { NavLink } from 'react-router-dom'
import {FaTachometerAlt, FaUser} from 'react-icons/fa'


const AdminSidebar = () => {
  return (
    <div className='bg-gray-600 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64'>
         <div className='flex items-center justify-center h-16 bg-gray-900'>
            <h3 className='text-2xl text-center font-serif'>Employee MS</h3>
         </div>
         <div className='px-4'>
            <NavLink to='/admin-dashboard' className='flex items-center gap-2 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors'>
                <FaTachometerAlt/>
                <span>Dashborad</span>
            </NavLink>
            <NavLink to='/admin-dashboard/employees' className='flex items-center gap-2 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors'>
                <FaUser/>
                <span>Employee</span>
            </NavLink>
         </div>
    </div>
  )
}

export default AdminSidebar