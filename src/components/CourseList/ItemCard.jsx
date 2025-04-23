// ItemCard.js
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2.5),
  borderRadius: "10px",
  transition: "all 0.3s",
  "&:hover": {
    boxShadow: "0px 4px 10px rgba(0 0 0 0.2)",
    transform: "scale(1.05)",
  },
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default Item;
