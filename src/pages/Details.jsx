import React, { useEffect } from "react";
import Accordion from "../components/Accordion/Accordion.jsx";
import { Grid, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import { z } from "zod";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const schema = z.object({
  courseStatus: z.string(),
});

const courseStatusOptions = [
  { value: "7", label: "Approved" },
  { value: "1", label: "Pending" },
  { value: "-1", label: "Deleted" },
  { value: "0", label: "Rework" },
];

const Details = () => {
  const course = JSON.parse(localStorage.getItem("item"));

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: { courseStatus: course.courseStatus?.toString() },
  });

  const { control, watch, setValue } = methods;
  const selectedStatus = watch("courseStatus");

  useEffect(() => {
    if (course.courseStatus !== undefined) {
      setValue("courseStatus", course.courseStatus.toString());
    }
  }, [course.courseStatus, setValue]);

  const handleStatusChange = async (newStatus) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("token");
    try {
      await fetch(
        `${apiUrl}/course/approve/${Number(course.courseId)}`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // body: {},
        }
      );

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Grid
      container
      spacing={6}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Grid item xs={12} md={9}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[20px] font-semibold">{course.title}</h1>

            <div>
              <FormProvider {...methods}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Controller
                    name="courseStatus"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleStatusChange(e.target.value);
                        }}
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
            </div>
          </div>

          <p className="text-[16px] text-gray-300 font-normal">
            {course.introduction}
          </p>

          <div className="w-full h-auto p-4 rounded-md">
            <img src={course.thumbnailUrl} alt={course.title} />
            <div className="flex mt-2 justify-between">
              <p>Total Tutorials: {course.totalUnits}</p>
              <p>Author: {course.author}</p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <Accordion />
        </div>
      </Grid>

      <Grid item xs={12} md={3}>
        <div>
          <h1 className="font-semibold text-[18px]">What You Will Learn</h1>
          <ul>
            {course?.highlights?.map((item, i) => (
              <li className="list-disc m-4 font-medium text-[16px]" key={i}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 space-y-2">
          <h1 className="font-semibold text-[18px]">About The Course</h1>
          <span>{course.description}</span>
        </div>

        <div className="mt-10 flex flex-col  space-y-1 ">
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
  );
};

export default Details;
