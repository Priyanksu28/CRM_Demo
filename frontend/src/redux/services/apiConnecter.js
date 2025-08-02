import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", 
  withCredentials: true,
});

// Get the token from localStorage (or Redux state)
const token = localStorage.getItem("token");
if (token) {
  axiosInstance.defaults.headers["Authorization"] = `Bearer ${JSON.parse(token)}`;
}

export const apiConnecter = async (method, url, bodyData = null, headers = {}, params = {}) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: bodyData,
      headers,
      params,
    });
    return response;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
