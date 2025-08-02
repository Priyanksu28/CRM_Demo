import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice'; 
import { useNavigate } from 'react-router-dom';
 

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    dispatch(logout());             
    navigate('/');              
  };

  return (
    <div className='flex justify-between h-16 bg-gray-800 text-white items-center px-5'>
      <p>Welcome Back {`${user.name}`.toUpperCase()}</p>
      <button 
        onClick={handleLogout} 
        className='px-4 py-1 bg-gray-500 hover:bg-gray-700 rounded'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
