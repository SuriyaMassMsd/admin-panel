import React from "react";
import Grid from "@mui/material/Grid";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import Item from "./ItemCard"; // assuming your styled Paper is in this file

export default function PendingCourses({ data, handleClick }) {
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 8 }}
      columns={{ xs: 1, sm: 8, md: 8, lg: 12 }}
    >
      {data.map((item, index) => (
        <Grid item xs={1} sm={4} md={4} key={index}>
          <Item onClick={() => handleClick(item)}>
            <div className="relative cursor-pointer flex flex-col justify-between h-[280px]">
              <span className="absolute -top-3 -right-3 px-3 py-1.5 rounded bg-[#ff4d6d] text-white font-semibold">
                Pending
              </span>
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="rounded-[10px] h-[150px] object-cover"
              />
              <div className="flex flex-col justify-between items-start py-2 space-y-4 h-full">
                <h1 className="text-[18px] text-start font-semibold">
                  {item.title}
                </h1>
                <div className="flex flex-col items-start">
                  <span className="text-sm text-gray-400">{item.author}</span>
                  <div className="flex items-center gap-2">
                    <MovieFilterIcon />
                    <p>{item.totalUnits} Tutorials</p>
                  </div>
                </div>
              </div>
            </div>
          </Item>
        </Grid>
      ))}
    </Grid>
  );
}
