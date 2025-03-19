import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

function Media(props) {
  const { loading = false } = props;

  return (
    <Grid container wrap="nowrap">
      {(loading ? Array.from(new Array(4)) : data).map((item, index) => (
        <Box key={index} sx={{ width: 270, marginRight: 10, my: 5 }}>
          {item ? (
            <img
              style={{ width: 270, height: 270 }}
              alt={item.title}
              src={item.src}
            />
          ) : (
            <Skeleton variant="rectangular" width={300} height={300} />
          )}
          {item ? (
            <Box sx={{ pr: 2 }}>
              <Typography gutterBottom variant="body2">
                {item.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", color: "text.secondary" }}
              >
                {item.channel}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {`${item.views} • ${item.createdAt}`}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          )}
        </Box>
      ))}
    </Grid>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
};

export default function YouTube() {
  return (
    <Box sx={{ overflow: "hidden" }}>
      <Media loading />
      {/* <Media /> */}
    </Box>
  );
}
