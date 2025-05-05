import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { useState } from "react";

const Notifications = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box p={3} color="#fff">
      {/* Breadcrumb Navigation */}
      {/* <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#90caf9" }}>
        <Link underline="hover" color="#90caf9" href="/Home">
          Home
        </Link>
        <Link underline="hover" color="#90caf9" href="/yt">
          Notification
        </Link>
        <Typography sx={{ color: "#fff" }}>Notifications</Typography>
      </Breadcrumbs>
      Page Title */}
      {/* <Typography variant="h4" mt={2} mb={2} sx={{ color: "#fff" }}>
        Notifications
      </Typography>
      Tabs */}
      <Paper sx={{ bgcolor: "#1e1e1e", borderRadius: 2 }} elevation={3}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab label="Individual" sx={{ color: "#90caf9" }} />
          <Tab label="Role" sx={{ color: "#90caf9" }} />
          <Tab label="Topic" sx={{ color: "#90caf9" }} />
          <Tab label="All" sx={{ color: "#90caf9" }} />
        </Tabs>

        {/* Tab Panel Content */}
        <Box p={2}>
          {tabIndex === 0 && (
            <Typography sx={{ color: "#fff" }}>
              Send Individual notification
            </Typography>
          )}
          {tabIndex === 1 && (
            <Typography sx={{ color: "#fff" }}>
              Send Role-based notification
            </Typography>
          )}
          {tabIndex === 2 && (
            <Typography sx={{ color: "#fff" }}>
              Send Topic-wise notification
            </Typography>
          )}
          {tabIndex === 3 && (
            <Typography sx={{ color: "#fff" }}>
              Send notification to all
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Notifications;
