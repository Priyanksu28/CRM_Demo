// /redux/reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import employeeReducer from '../slices/employeeSlice';
import customerReducer from '../slices/customerSlice'

const rootReducer = combineReducers({
  customers:customerReducer,
  employees: employeeReducer,
  auth: authReducer,
});

export default rootReducer;
