import React from "react";
import CustomizedTables from "../UserTable";
import { delData, getData } from "../../hooks/api";

const User = ({ navigate, datas, current }) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    mutate: usersMutate,
  } = getData(`${apiUrl}/users`);

  const { trigger: deleteUser, mutate: deleteMutate } = delData(
    `${apiUrl}/users`
  );

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      usersMutate();
    } catch (err) {
      console.log("error", err);
    }
  };

  if (usersError) {
    console.log(usersError.response?.data?.message || "Something went wrong");
    return <div>Error loading users.</div>;
  }

  if (usersLoading || !users) {
    return <div>Loading...</div>;
  }

  const studentUsers =
    users?.value?.filter(({ role }) => role === "Student") ?? [];

  return (
    <div>
      <CustomizedTables
        data={studentUsers}
        navigate={navigate}
        current={current}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default User;
