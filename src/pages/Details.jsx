import React from "react";
import Accordion from "../components/Accordion/Accordion.jsx";
import { Grid } from "@mui/material";

const Details = () => {
  const course = JSON.parse(localStorage.getItem("item"));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7.5}>
        <div>
          <h1>{course.title}</h1>
          <p>Author: {course.author}</p>
          <p>Total Tutorials: {course.totalUnits}</p>
          <img src={course.thumbnailUrl} alt={course.title} />
        </div>
      </Grid>

      <Grid item xs={12} md={4.5}>
        <div>
          <Accordion />
        </div>
      </Grid>
    </Grid>
  );
};

export default Details;
