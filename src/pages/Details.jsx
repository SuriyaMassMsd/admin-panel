import React from "react";
import { useNavigate } from "react-router-dom";

const Details = () => {
  const navigate = useNavigate();
  const course = JSON.parse(localStorage.getItem("item"));
  return (
    <div>
      <button className="cursor-pointer text-lg hover:underline">
        {/* Courses / Details */}
      </button>
      <div>
        <h1>{course.title}</h1>
        <p>Author: {course.author}</p>
        <p>Total Tutorials: {course.totalUnits}</p>
        <img src={course.thumbnailUrl} alt={course.title} />
      </div>
    </div>
  );
};
export default Details;
