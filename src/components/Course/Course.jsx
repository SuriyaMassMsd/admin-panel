import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import Details from "../../pages/Details";
import YouTube from "../Skeleton/Skeleton";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2.5),
  borderRadius: "10px",
  transition: "all 0.3s",

  "&:hover": {
    boxShadow: "0px 4px 10px rgba(0 0 0 0.2) ",
    transform: "scale(1.05)",
  },
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function Course({ navigate, datas, current }) {
  // const [data, setData] = React.useState(null);
  const { selectedCourse, setSelectedCourse } = datas;
  const { setPathname } = current;
  const [approvedCourse, setApprovedCourse] = React.useState(null);
  const [pendingCourse, setPendingCourse] = React.useState(null);

  React.useEffect(() => {
    const courseData = async () => {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_BASE_URL;
      try {
        const response = await fetch(`${apiUrl}/course`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Error", errorData.message || "something went wrong");
          return;
        }
        const data = await response.json();

        if (
          (data?.value.approved.length !== 0 &&
            data?.value.approved.length >= 0) ||
          (data?.value.pending.length !== 0 && data?.value.pending.length >= 0)
        ) {
          setApprovedCourse(data.value.approved);
          setPendingCourse(data.value.pending);
          localStorage.setItem(
            "dataLength",
            JSON.stringify(data?.value.approved.length || 4)
          );
        } else {
          setApprovedCourse([]);
          setPendingCourse([]);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    courseData();
  }, []);

  if (!approvedCourse || !pendingCourse) return <YouTube />;

  const handleRouteData = (data) => {
    localStorage.setItem("item", JSON.stringify(data));
    setPathname("/courses");
    navigate("/courses/details");
  };

  console.log(pendingCourse);

  return (
    <Box sx={{ flexGrow: 1, my: 4 }}>
      {/* <div className="flex justify-center sm:justify-center -mt-10 mb-10  sm:-mt-20 ">
        <button className="px-10 py-1 bg-gray-500 font-semibold text-[18px] mr-1 cursor-pointer hover:bg-gray-600 transition-all ease-in-out 2s duration-300">
          Approved
        </button>
        <a
          href="#pending"
          className="px-10 py-2 bg-gray-500 font-semibold text-[18px] cursor-pointer hover:bg-gray-600 transition-all ease-in-out 2s duration-300"
        >
          Pending
        </a>
      </div> */}
      <div className="flex justify-center sm:justify-end -mt-10 mb-10  sm:-mt-20 sm:mb-20">
        <button
          className="  px-10 py-2 bg-gray-500 font-semibold text-white cursor-pointer hover:scale-105 hover:bg-gray-600 rounded outline-none transition-all duration-200 2s"
          onClick={() => navigate("/courses/addCourse")}
        >
          Add Course
        </button>
      </div>

      <Grid
        container
        spacing={{ xs: 2, md: 8 }}
        columns={{ xs: 1, sm: 8, md: 8, lg: 12 }}
      >
        {approvedCourse.length > 0 ? (
          approvedCourse.map((item, index) => (
            <Grid item xs={1} sm={4} md={4} key={index}>
              <Item onClick={() => handleRouteData(item)}>
                <div className="relative cursor-pointer flex flex-col justify-between  h-[280px] ">
                  <span
                    className={`absolute -top-3 -right-3 px-3 py-1.5 rounded 
                  
                   ${item.courseStatus === 7 ? "bg-[#0ead69] text-white font-semibold" : ""}`}
                  >
                    {item.courseStatus === 7 ? "Approved" : "Pending"}
                  </span>
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="rounded-[10px] h-[150px]  object-cover"
                  />
                  <div className="flex flex-col justify-between items-start py-2 space-y-4 h-full ">
                    <h1 className="text-[18px] text-start font-semibold ">
                      {item.title}
                    </h1>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-gray-400">
                        {item.author}
                      </span>
                      <div className="flex items-center gap-2 ">
                        <MovieFilterIcon />
                        <div className="flex items-center gap-1">
                          <p>{item.totalUnits}</p>
                          <p>Tutorials</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Item>
            </Grid>
          ))
        ) : (
          <div className="px-16">No Courses Availables </div>
        )}
      </Grid>

      <div className="mt-10 w-full h-1 bg-white"></div>
      <h1 className="mt-10 mb-10">Pending Courses</h1>
      <Grid
        container
        spacing={{ xs: 2, md: 8 }}
        columns={{ xs: 1, sm: 8, md: 8, lg: 12 }}
      >
        {pendingCourse?.length >= 0 ? (
          pendingCourse.map((item, index) => (
            <Grid item xs={1} sm={4} md={4} key={index}>
              <Item onClick={() => handleRouteData(item)}>
                <div
                  id="pending"
                  className="relative cursor-pointer flex flex-col justify-between  h-[280px] "
                >
                  <span
                    className={`absolute -top-3 -right-3 px-3 py-1.5 rounded 
                  
                   ${item.courseStatus === 7 ? "" : "bg-[#ff4d6d] text-white font-semibold"}`}
                  >
                    {item.courseStatus === 7 ? "Approved" : "Pending"}
                  </span>
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="rounded-[10px] h-[150px]  object-cover"
                  />
                  <div className="flex flex-col justify-between items-start py-2 space-y-4 h-full ">
                    <h1 className="text-[18px] text-start font-semibold ">
                      {item.title}
                    </h1>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-gray-400">
                        {item.author}
                      </span>
                      <div className="flex items-center gap-2 ">
                        <MovieFilterIcon />
                        <div className="flex items-center gap-1">
                          <p>{item.totalUnits}</p>
                          <p>Tutorials</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Item>
            </Grid>
          ))
        ) : (
          <div>Loading Approved Courses...</div>
        )}
      </Grid>
    </Box>
  );
}
