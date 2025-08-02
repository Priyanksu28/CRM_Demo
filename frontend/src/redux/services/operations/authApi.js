// redux/services/operation/authAPI.js
import { apiConnecter } from "../apiConnecter";
import { endpoints } from "../apis";

const { LOGIN_API } = endpoints;

export async function loginAPI(identifier, password) {
  return await apiConnecter("POST", LOGIN_API, { identifier, password });
}
