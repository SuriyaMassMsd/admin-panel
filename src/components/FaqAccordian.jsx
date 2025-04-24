import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomAccordion = ({ question, answer }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      sx={{
        backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.1)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        mb: 1,
        px: 2,
        py: 1,
        width: "70%",
        overflow: "hidden",
        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: isDark ? "#fff" : "#000" }} />}
      >
        <div className="flex flex-col w-full">
          <Typography
            variant="body1"
            sx={{ fontSize: 14 }}
            color={isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)"}
          >
            {question}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? "#e0e0e0" : "#333",
            backgroundColor: isDark ? "#2c2c2c" : "#f5f5f5",
            fontSize: "12px",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          {answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
