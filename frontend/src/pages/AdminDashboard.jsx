import React from 'react'
import Navbar from '../components/Dashboard/Navbar'
import AdminSidebar from '../components/Dashboard/AdminSidebar'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <div className='flex bg-gray-200'>
        <AdminSidebar/>
      <div className='flex-1 ml-64  h-screen'>
        <Navbar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminDashboard