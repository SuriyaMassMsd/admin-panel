import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "axios";

// 🔐 Get token and build Authorization headers dynamically
// Handles FormData for file uploads
const getAuthHeaders = (payload) => {
  const token = localStorage.getItem("token");
  const isFormData = payload instanceof FormData;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  };
};

// 📥 GET Request
const fetcher = async (url) => {
  const res = await axios.get(url, getAuthHeaders());
  return res.data;
};

// 📤 POST Request
const postFetcher = async (url, { arg: payload }) => {
  const res = await axios.post(url, payload, getAuthHeaders(payload));
  return res.data;
};

// ✏️ PUT Request
const putFetcher = async (url, { arg: payload }) => {
  const res = await axios.patch(url, payload, getAuthHeaders(payload));
  return res.data;
};

// ❌ DELETE Request
const deleteFetcher = async (url, { arg: id }) => {
  const res = await axios.delete(`${url}/${id}`, getAuthHeaders());
  return res.data;
};

// 🧩 Hook: GET data
export const getData = (url) =>
  useSWR(url, fetcher, { revalidateOnFocus: false });

// 🧩 Hook: POST data
export const postData = (url) => useSWRMutation(url, postFetcher);

// 🧩 Hook: PUT data
export const putData = (url) => useSWRMutation(url, putFetcher);

// 🧩 Hook: DELETE data
export const delData = (url) => useSWRMutation(url, deleteFetcher);

// 🧩 Example for custom POST (can rename/remove if not needed)
export const subscribeToTopic = (url) => useSWRMutation(url, postFetcher);
