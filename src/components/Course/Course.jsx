import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";

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

export default function Course() {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
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
        // throw new Error(error);
        console.log("error", error);
      }
    };
    courseData();
  }, []);

  if (!data) return <h1>Loading...</h1>;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {data.map((item, index) => (
          <Grid item xs={1} sm={4} md={4} key={index}>
            <Item>
              <Link
                key={index}
                to={`/course/${index}`}
                className="bg-red-500 hover:scale-105 min-h-[200px] transition 2s ease-in-out cursor-pointer"
              >
                <img
                  src="https://imgs.search.brave.com/nH6ZTkCGjSSV918jVV6RrZuLPhtAj8Y9tbSJHKRoHxg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzg1Lzg5LzE5/LzM2MF9GXzI4NTg5/MTk5MF9mUTI4RzNC/eGh3QzJCVzZlNUJr/dnRCMm5RczRrSEdD/bi5qcGc"
                  alt={item.title}
                  className="rounded-[10px]"
                />
                <div className="flex flex-col justify-center items-start py-2 space-y-2">
                  <h1 className="text-justify text-[18px] font-semibold">
                    {item.title}
                  </h1>
                  <span>{item.author}</span>
                  <div className="flex items-center gap-2">
                    <span>
                      <MovieFilterIcon />
                    </span>
                    <div className="flex items-center gap-1">
                      <p>{item.totalUnits}</p>
                      <p>Tutorials</p>
                    </div>
                  </div>
                </div>
              </Link>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
