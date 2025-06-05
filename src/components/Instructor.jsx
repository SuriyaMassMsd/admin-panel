import React, { useEffect, useState } from "react";
import CustomizedTables from "../components/UserTable";
import { delData, getData } from "../hooks/api";
import Animations from "../components/Skeleton/TableSkeleton";

const Instructor = ({}) => {
  const [data, setData] = useState(null);
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const {
    data: userData,
    error,
    mutate,
    isLoading,
  } = getData(`${apiUrl}/users`);

  useEffect(() => {
    if (userData?.value) {
      const instructors = userData.value.filter(
        (user) => user.role === "Instructor"
      );
      setData(instructors);
      mutate();
    }
  }, [userData]);

  const { trigger: deleteUser, mutate: deleteMutate } = delData(
    `${apiUrl}/users`
  );

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      mutate();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (error) {
    console.log(error.response?.data?.message || "Something went wrong");
    return <div>Error loading users.</div>;
  }

  if (isLoading || !userData) {
    return (
      <div>
        <Animations />
      </div>
    );
  }
  return (
    <div>
      <CustomizedTables data={data} handleDelete={handleDelete} />
    </div>
  );
};

export default Instructor;
