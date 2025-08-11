import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSummary from "./components/Dashboard/AdminSummary";
import List from "./components/Employee/List";
import Add from "./components/Employee/Add";
import EditEmployee from "./components/Employee/EditEmployee";
import ProtectedRoutes from "./utils/ProtectedRoutes"; 
import ErrorPage from "./pages/ErrorPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CustomerDashboard from "./components/custDashboard/CustomerDashboard";
import AddCustomer from './components/custDashboard/AddCustomer'
import QuotationForm from "./components/Quotation/QuotationForm";
import QuotationDashboard from "./components/Quotation/QuotationDashboard";
import PIDashboard from "./components/PI/PIDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";


const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/resetPassword/:token" element={<UpdatePassword/>}/>
      

      {/* Protected Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoutes requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoutes>
        }
      >
        <Route index element={<AdminSummary />} />
        <Route path="employees" element={<List />} />
        <Route path="employees/add" element={<Add />} />
        <Route path="employees/edit/:id" element={<EditEmployee />} />
      </Route>

      <Route path="/employee-dashboard"
      element={
        <ProtectedRoutes requiredRole='employee'>
         <EmployeeDashboard/>
        </ProtectedRoutes>
      }>
        <Route index element={<h1>Employee Dashboard</h1>} />
        <Route path="customer" element={<CustomerDashboard/>} 
        />
         <Route path="customer/add" element={<AddCustomer/>} />
        <Route path="customer/edit/:id" element={<AddCustomer/>} />


         <Route path="quotation" element={<QuotationDashboard/>} />
         <Route path="customer/create-quotation" element={<QuotationForm/>} />
         <Route path="quotation/edit/:id" element={<QuotationForm/>} />

          <Route path="pi" element={<PIDashboard/>} />
      </Route>

      <Route path="*" element={<ErrorPage/>}/>
    </Routes>
  );
};

export default App;
