import React, { useEffect, useState } from "react";
import Accordion from "../components/Accordion/Accordion.jsx";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import { z } from "zod";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserValue } from "../components/UserType.js";
import EditIcon from "@mui/icons-material/Edit";
import { useCourse } from "../components/Course/UseCourse.jsx";
import { useTheme } from "@mui/material";

const schema = z.object({
  courseStatus: z.string(),
});

const courseStatusOptions = [
  { value: "7", label: "Approved" },
  { value: "1", label: "Pending" },
  { value: "-1", label: "Deleted" },
  { value: "0", label: "Rework" },
];

const Details = ({ data, navigate, current }) => {
  const userData = getUserValue();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const course = data;

  if (!course) {
    const { setPathname } = current;
    setPathname("/courses");
    navigate("/courses");
    return null; // 👈 this stops execution and prevents rendering
  }

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: { courseStatus: course.courseStatus?.toString() },
  });

  const { control, watch, setValue } = methods;

  useEffect(() => {
    if (course.courseStatus !== undefined) {
      setValue("courseStatus", course.courseStatus.toString());
    }
  }, [course.courseStatus, setValue]);

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const handleStatusChange = async (newStatus) => {
    const statusEndPoint = {
      7: {
        url: `${apiUrl}/course/approve/${course.courseId}`,
        method: "POST",
        body: null,
      },
      "-1": {
        url: `${apiUrl}/course/${course.courseId}`,
        method: "DELETE",
        body: null,
      },
      1: {
        url: `${apiUrl}/course/update/${course.courseId}`,
        method: "PATCH",
        body: JSON.stringify({ courseStatus: 1 }),
      },
      0: {
        url: `${apiUrl}/course/update/${course.courseId}`,
        method: "PATCH",
        body: JSON.stringify({ courseStatus: 0 }),
      },

      // rework :
    };

    const selectedStatus = watch("courseStatus");

    const api = statusEndPoint[selectedStatus];
    const token = localStorage.getItem("token");
    try {
      await fetch(api.url, {
        method: api.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: api.body,
      });

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const courseEdit = () => {
    const { setPathname } = current;
    setPathname("/courses");
    navigate("/courses/edit");
  };

  return (
    <Box sx={{ flexGrow: 1, my: 4 }}>
      <div className="flex justify-center sm:justify-end -mt-10 mb-10  sm:-mt-20  ml-auto w-[300px] gap-4">
        <FormProvider {...methods}>
          <FormControl fullWidth>
            <InputLabel id="course-status-label">Status</InputLabel>
            <Controller
              name="courseStatus"
              control={control}
              disabled={userData.role !== "Admin"}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="course-status-label"
                  label="Status" // 🟢 REQUIRED to avoid outline overlap
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {courseStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </FormProvider>

        <button
          disabled={userData.role !== "Admin"}
          onClick={() => handleStatusChange(methods.getValues("courseStatus"))}
          className="px-10 py-2 bg-[#00bbab] cursor-pointer hover:bg-[#51ada5f3] rounded"
        >
          Submit
        </button>
      </div>
      <div className="mt-18">
        <Grid
          container
          spacing={10}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            // marginTop: "2px",
            // mt: 1,
          }}
        >
          <Grid item xs={12} md={8} sx={{ width: "100%" }}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-[20px] font-semibold">{course.title}</h1>
                <h4
                  className="flex justify-between items-center gap-3 cursor-pointer"
                  onClick={courseEdit}
                >
                  Edit <EditIcon fontSize="small" />
                </h4>
              </div>

              <p className="text-[16px]  font-normal">{course.introduction}</p>

              <div
                className={`w-full h-auto p-4 rounded-md transition-all duration-300 bg-white ${isDark ? "text-white" : "text-gray-800"} border border-gray-300  dark:bg-white/10 dark:border-white/20  backdrop-blur-md shadow-sm`}
              >
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full rounded-md"
                />
                <div className="flex mt-6 justify-between text-sm">
                  <p>Total Tutorials: {course.totalUnits}</p>
                  <p>Author: {course.author}</p>
                </div>
              </div>
            </div>

            <div className="mt-20">
              <Accordion course={course} />
            </div>
          </Grid>

          <Grid item xs={12} md={4}>
            <div className="text-wrap">
              <h1 className="font-semibold text-[18px]">What You Will Learn</h1>
              <ul>
                {course?.highlights?.map((item, i) => (
                  <li className="list-disc m-4 font-medium text-[16px]" key={i}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 space-y-2 text-justify">
              <h1 className="font-semibold text-[18px]">About The Course</h1>
              <span>{course.description}</span>
            </div>

            <div className="mt-10 flex flex-col  space-y-1 text-wrap">
              <h1 className="font-semibold text-[18px]">
                Learn From - {course.authorOccupation}
              </h1>
              <span> Author : {course.author}</span>
              <div>
                <span className="flex gap-2">
                  <WorkIcon />
                  {course.authorExp}
                </span>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

export default Details;
