import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  employees: [],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: (state, action) => {
       state.employees.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;  
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setEmployees, setError, addEmployee } = employeeSlice.actions;

export const fetchEmployees = () => async (dispatch, getState) => {
  dispatch(setLoading(true));

  const { token } = getState().auth;

  if (!token) {
    dispatch(setError("No token available"));
    dispatch(setLoading(false));
    return;
  }

  try {
    const response = await axios.get('http://localhost:3000/api/admin/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setEmployees(response.data.employees)); 
  } catch (error) {
    dispatch(setError('Failed to fetch employees'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default employeeSlice.reducer;
