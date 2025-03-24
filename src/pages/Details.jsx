import React from "react";
import Accordion from "../components/Accordion/Accordion.jsx";
import { Grid } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import WorkIcon from "@mui/icons-material/Work";
import DeleteIcon from "@mui/icons-material/Delete";

const Details = () => {
  const course = JSON.parse(localStorage.getItem("item"));
  console.log(course);

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
            {course.courseStatus === 1 ? (
              <div className="space-x-4">
                <button className="cursor-pointer">
                  <ClearIcon />
                </button>
                <button className="cursor-pointer">
                  <DoneIcon />
                </button>
              </div>
            ) : (
              <button className="cursor-pointer">
                <DeleteIcon />
              </button>
            )}
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
          <h1 className="font-semibold text-[18px] ">About The Course</h1>
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
