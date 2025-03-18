import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import Details from "../../pages/Details";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function Course({ navigate, datas }) {
  const [data, setData] = React.useState(null);
  const { selectedCourse, setSelectedCourse } = datas;
  // const [selectedCourse, setSelectedCourse] = React.useState(null);

  React.useEffect(() => {
    const courseData = async () => {
      const token = localStorage.getItem("token");
      console.log(token);

      try {
        const response = await fetch("https://lms_api.haloquant.com/course", {
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
        setData(data.value);
        console.log(data);
      } catch (error) {
        console.log("error", error);
      }
    };
    courseData();
  }, []);

  if (!data) return <h1>Loading...</h1>;

  // if (selectedCourse) {
  //   return (
  //     <Details
  //       course={selectedCourse}
  //       onBack={() => setSelectedCourse(null)}
  //       // path={path}
  //     />
  //   );
  // }

  const handleRouteData = (data) => {
    setSelectedCourse(data);
    navigate("/courses/details");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 8, md: 8, lg: 12 }}
      >
        {data.map((item, index) => (
          <Grid item xs={1} sm={4} md={4} key={index}>
            <Item onClick={() => handleRouteData(item)}>
              <div className="hover:scale-105 transition cursor-pointer flex flex-col justify-between h-[280px]">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="rounded-[10px] h-[150px] w-full object-cover"
                />
                <div className="flex flex-col justify-between items-start py-2 space-y-2 h-full">
                  <h1 className="text-[18px] text-start font-semibold line-clamp-2 overflow-hidden text-ellipsis w-full">
                    {item.title}
                  </h1>
                  <span className="text-sm text-gray-400">{item.author}</span>
                  <div className="flex items-center gap-2 mt-auto">
                    <MovieFilterIcon />
                    <div className="flex items-center gap-1">
                      <p>{item.totalUnits}</p>
                      <p>Tutorials</p>
                    </div>
                  </div>
                </div>
              </div>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
