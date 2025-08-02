import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  customers: [],
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomers: (state, action) => {
      state.customers.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCustomer: (state, action) => {
      state.customers = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCustomer, setLoading, setError, addCustomers } =
  customerSlice.actions;

export const fetchCustomer = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  const { token } = getState().auth;

  if (!token) {
    dispatch(setError("No token available"));
    dispatch(setLoading(false));
    return;
  }

  try {
    const response = await axios.get("http://localhost:3000/api/customer/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

   console.log(response)
    dispatch(setCustomer(response.data.customers || response.data.data));
  } catch (error) {
    dispatch(
      setError(error?.response?.data?.message || "Failed to fetch customers")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export default customerSlice.reducer;
