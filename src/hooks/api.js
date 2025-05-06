import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "axios";

// 🔐 Get token and build Authorization headers dynamically
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// 📥 GET Request
const fetcher = async (url) => {
  const res = await axios.get(url, getAuthHeaders());
  return res.data;
};

// ❌ DELETE Request
const deleteFetcher = async (url, { arg: id }) => {
  const res = await axios.delete(`${url}/${id}`, getAuthHeaders());
  return res.data;
};

// 📤 POST Request
const postFetcher = async (url, { arg: payload }) => {
  const res = await axios.post(url, payload, getAuthHeaders());
  return res.data;
};

// 🧩 Hook: GET data with SWR
export const getData = (url) => useSWR(url, fetcher);

// 🧩 Hook: POST data with SWR Mutation
export const postData = (url) => useSWRMutation(url, postFetcher);

// 🧩 Hook: DELETE data with SWR Mutation
export const delData = (url) => useSWRMutation(url, deleteFetcher);
