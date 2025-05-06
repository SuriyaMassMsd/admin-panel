const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const fetcher = async (url) => {
  const res = await axios.get(url, getAuthHeaders());
  return res.data;
};

const deleteFetcher = async (url, { arg: id }) => {
  const res = await axios.delete(`${url}/${id}`, getAuthHeaders());
  return res.data;
};

const postFetcher = async (url, { arg: payload }) => {
  const res = await axios.post(url, payload, getAuthHeaders());
  return res.data;
};
