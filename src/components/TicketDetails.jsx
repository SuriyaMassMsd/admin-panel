import React, { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Bounce, toast, ToastContainer } from "react-toastify";
import PropagateLoader from "react-spinners/PropagateLoader";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "900px",
    maxWidth: "90%",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const TicketDetails = ({
  open,
  handleClose,
  // handlePromote,
}) => {
  const [loading, setLoading] = useState(false);

  //   const success = () => {
  //     toast.success("User Promoted Successfully", {
  //       position: "top-right",
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: false,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //       transition: Bounce,
  //     });
  //   };
  //   const failed = () => {
  //     toast.error(
  //       "Update necessary user details to promote user as an Instructor",
  //       {
  //         position: "top-right",
  //         autoClose: 2000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //         transition: Bounce,
  //       }
  //     );
  //   };

  //   const handlePromote = async (id) => {
  //     setLoading(true);
  //     const apiUrl = import.meta.env.VITE_BASE_URL;
  //     const token = localStorage.getItem("token");

  //     if (!apiUrl || !token) {
  //       console.warn("Missing API URL or Token");
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`${apiUrl}/users/assign/${id}`, {
  //         method: "POST",
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       setLoading(false);
  //       if (response.status === 200) {
  //         success();
  //       }
  //       if (response.status === 201) {
  //         failed();
  //       }
  //       // setData((prev) => prev.filter((u) => u.id !== id));
  //     } catch (err) {
  //       console.log("error", err);
  //       setLoading(false);
  //       toast.error(err.message);
  //     }
  //   };

  return <div>hello</div>;
};

export default TicketDetails;
