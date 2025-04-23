import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import YouTube from "../Skeleton/Skeleton";
import ApprovedCourses from "./Approved";
import PendingCourses from "./Pending";

export default function CourseTabs({ navigate, datas, current }) {
  const { selectedCourse, setSelectedCourse } = datas;
  const { setPathname } = current;
  const [value, setValue] = useState(0);
  const [approved, setApproved] = useState(null);
  const [pending, setPending] = useState(null);

  const handleChange = (event, newValue) => setValue(newValue);

  const handleRouteData = (data) => {
    setSelectedCourse(data);
    setPathname("/courses");
    navigate("/courses/details");
  };

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_BASE_URL;
    try {
      const response = await fetch(`${apiUrl}/course`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setApproved(data.value.approved || []);
      setPending(data.value.pending || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (!approved || !pending) return <YouTube />;

  return (
    <Box sx={{ width: "100%", my: 4 }}>
      <div className="flex justify-center sm:justify-end mb-6">
        <button
          className="px-10 py-2 bg-gray-500 text-white font-semibold rounded hover:scale-105 hover:bg-gray-600 transition-all duration-200"
          onClick={() => {
            localStorage.removeItem("item");
            navigate("/courses/addCourse");
          }}
        >
          Add Course
        </button>
      </div>

      <Tabs value={value} onChange={handleChange}>
        <Tab label="Approved Courses" />
        <Tab label="Pending Courses" />
      </Tabs>

      <Box sx={{ mt: 4 }}>
        {value === 0 && (
          <ApprovedCourses data={approved} handleClick={handleRouteData} />
        )}
        {value === 1 && (
          <PendingCourses data={pending} handleClick={handleRouteData} />
        )}
      </Box>
    </Box>
  );
}
