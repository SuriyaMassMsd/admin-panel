import React, { useEffect, useState } from "react";
import CustomizedTables from "../UserTable";

const User = ({ navigate, datas, current }) => {
  const { setPathname } = current;
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const apiUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${apiUrl}/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response) {
          const errorData = await response.json();
          console.log("Error", errorData.message || "something went wrong");
          return;
        }

        const datas = await response.json();

        setData(datas?.value?.filter(({ role }) => role === "Student") ?? []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserData();
  }, []);

  const handleEdit = () => {
    localStorage.setItem("userData", data);
    setPathname("/users");
    navigate("/users/edit");
  };
  console.log(data);

  return (
    <div>
      <CustomizedTables data={data} handleEdit={handleEdit} />
    </div>
  );
};

export default User;
