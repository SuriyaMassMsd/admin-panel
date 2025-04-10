import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

// Custom Bootstrap-like Dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    padding: theme.spacing(2),
    width: "50vw",
    maxWidth: "none",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
}));

export default function TicketDetails({ open, handleClose }) {
  const [inputValue, setInputValue] = React.useState("");
  const { message, ticketId } = JSON.parse(localStorage.getItem("ticketData"));
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const payload = { solution: inputValue };
  const handleReset = () => setInputValue("");
  const handleSubmit = async () => {
    try {
      await fetch(`${apiUrl}/ticket/close/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      handleClose();
      toast.success("solution submited successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BootstrapDialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Close Ticket
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box mb={2} mt={2} sx={{ height: 50 }}>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Solution"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
        <Button
          onClick={handleReset}
          variant="outlined"
          color="secondary"
          sx={{ px: 10, py: 1.5, fontWeight: 600 }}
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="success"
          sx={{ px: 10, py: 1.5, fontWeight: 600 }}
        >
          Submit
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
