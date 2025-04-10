import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import UserDetails from "./UserDetails";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TicketDetails from "./TicketDetails";

export default function TicketOpen({ data }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTicket, setTicket] = React.useState("");
  const menuOpen = Boolean(anchorEl);

  console.log("ticketdata", data);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };

  const openUser = (data) => {
    // localStorage.setItem("ticketData", JSON.stringify(data));
    setTicket(data);
    handleDialogOpen();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={menuOpen ? "long-menu" : undefined}
        aria-expanded={menuOpen ? "true" : undefined}
        aria-haspopup="true"
        onClick={() => openUser(data)}
      >
        <VisibilityIcon fontSize="sm" />
      </IconButton>

      <TicketDetails
        open={dialogOpen}
        handleClose={handleDialogClose}
        data={selectedTicket}
      />
    </div>
  );
}
