import React from 'react'
import Navbar from '../components/Dashboard/Navbar'
import EmpSidebar from '../components/EmpDashboard/EmpSidebar'
import { Outlet } from 'react-router-dom'

const EmployeeDashboard = () => {
  return (
    <div className='flex bg-gray-200'>
      <EmpSidebar/>
      <div className='flex-1 ml-64  h-screen'>
        <Navbar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default EmployeeDashboard