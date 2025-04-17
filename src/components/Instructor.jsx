import React, { useEffect, useState } from "react";
import CustomizedTables from "../components/UserTable";

const Instructor = ({}) => {
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

        setData(
          datas?.value?.filter(({ role }) => role === "Instructor") ?? []
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserData();
  }, []);

  const handleDelete = async (id) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("token");

    try {
      await fetch(`${apiUrl}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div>
      <CustomizedTables data={data} />
    </div>
  );
};

export default Instructor;
