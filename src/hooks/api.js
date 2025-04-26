import useSWR from "swr";
import axios from "axios";
import useSWRMutation from "swr/mutation";

const token = localStorage.getItem("token");
const headers = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const fetcher = async (url) => {
  const res = await axios.get(url, headers);
  return res.data;
};

const deleteFetcher = async (url, { arg: id }) => {
  const res = await axios.delete(`${url}/${id}`, headers);
  return res.data;
};

const postFetcher = async (url, { arg: payload }) => {
  const res = await axios.post(url, payload, headers);
  return res.data;
};

export const getData = (url) => useSWR(url, fetcher);
export const postData = (url) => useSWRMutation(url, postFetcher);
export const delData = (url) => useSWRMutation(url, deleteFetcher);
