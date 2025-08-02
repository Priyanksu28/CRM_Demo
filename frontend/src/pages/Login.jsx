import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginAPI } from "../redux/services/operations/authApi";
import { setLoading, setToken, setUser } from "../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: isLoading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async ({ email, password }) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Logging in...");

    try {
      const response = await loginAPI(email, password);

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      const { token, user } = response.data;

      dispatch(setToken(token));
      dispatch(setUser(user));

      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful");
       if(user.role === 'admin'){
        navigate('/admin-dashboard');
       }else{
        navigate('/employee-dashboard')
       }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600">
           Vinay EnterPrise
          </h2>
          <p className="text-center text-sm text-gray-500">
            Keep all your credentials safe!
          </p>

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email or EmployeeId
            </label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required!" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required!" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <NavLink to={'/forgot-password'} className="text-sm text-blue-600 hover:underline cursor-pointer">
              Forgot Password?
            </NavLink>
          </div>

          {/* Submit Button */}
          {isLoading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-6 h-6 border-t-2 border-blue-600 border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Log in
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
