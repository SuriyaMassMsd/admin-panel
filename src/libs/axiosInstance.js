import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;
const BASEURL = import.meta.env.MODE === "development" ? apiUrl : "/";

export const axiosInstance = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
});
