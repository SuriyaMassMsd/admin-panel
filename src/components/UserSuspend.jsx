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

const options = ["Delete", "Details"];

const ITEM_HEIGHT = 48;

const handleDelete = async (id) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  try {
    await fetch(`${apiUrl}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.log("error", err);
  }
};

function AlertDialog({ open, handleClose, id }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Deleting User"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this user?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button
          onClick={() => {
            handleDelete(id);
            handleClose();
          }}
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function LongMenu({ id, navigate, data }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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

  const handleMenu = (index, data) => {
    if (index === 0) {
      handleDialogOpen();
    } else if (index === 1) {
      navigate("/users/details");
      localStorage.setItem("userData", JSON.stringify(data));
    }
  };

  const openUser = () => {
    // handleMenuClick();
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
        onClick={openUser}
      >
        <VisibilityIcon />
      </IconButton>
      {/* <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={() => handleMenu(index, data)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu> */}
      <UserDetails open={dialogOpen} handleClose={handleDialogClose} />
      {/* <AlertDialog open={dialogOpen} handleClose={handleDialogClose} id={id} /> */}
    </div>
  );
}
