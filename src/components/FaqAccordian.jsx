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
        mb: 2,
        width: "50%",
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
            color={isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)"}
          >
            {question}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          variant="body1"
          sx={{ color: isDark ? "#fff" : "#333", fontSize: "1.1rem" }}
        >
          {answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
