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

const UserDetails = ({
  open,
  handleClose,
  handleDeleteOpen,
  // handlePromote,
  data,
}) => {
  const { email, profilePicture, username, isActive, id } = data;
  const [loading, setLoading] = useState(false);

  const defImg =
    "https://imgs.search.brave.com/wTGFv276tv4aDjxtxOQJKFik7yI3PdFq6OpafOk7YCI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMubGlmZS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTkv/MTAvMTUxNTMyMjgv/MTE1MjA5Ni1lMTU3/MTE1MzU0NzMzMi5q/cGc";

  const success = () => {
    toast.success("User Promoted Successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };
  const failed = () => {
    toast.error(
      "Update necessary user details to promote user as an Instructor",
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }
    );
  };

  const handlePromote = async (id) => {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("token");

    if (!apiUrl || !token) {
      console.warn("Missing API URL or Token");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/assign/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setLoading(false);
      if (response.status === 200) {
        success();
      }
      if (response.status === 201) {
        failed();
      }
      // setData((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.log("error", err);
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 4 }} id="customized-dialog-title">
          User Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className="flex justify-start items-start space-x-[60px] px-10  py-6 gap-5">
            <div className="w-56 h-56 relative ">
              <div
                className={`w-5 border-[3px] border-black h-5 top-1 right-12 ${isActive ? "bg-lime-400" : "bg-red-500"} rounded-full absolute z-20 shadow-md animate-pulse`}
              ></div>
              <div className="overflow-hidden rounded-full w-full h-full">
                <img
                  src={profilePicture ? profilePicture : defImg}
                  alt={username}
                  className="w-full h-full object-cover object-top scale-125  z-0"
                />
              </div>
            </div>
            <div className="pl-4 space-y-6 ">
              <h1 className="text-[50px]">
                {username
                  ? username ||
                    email?.split("@")[0].substring(0, 12) +
                      (email?.split("@")[0].length > 12 ? "..." : "")
                  : username || email?.split("@")[0]}
              </h1>
              <p className="opacity-65">{email}</p>
              <div className="flex space-x-4 items-center justify-center">
                <button
                  disabled={loading}
                  onClick={() => handlePromote(id)}
                  className="px-20 py-4 font-semibold hover:bg-lime-500 cursor-pointer transition-all duration-300 1s bg-lime-600 rounded-xs outline-none border-none text-white"
                >
                  {loading ? "Promoting..." : "Promote"}
                </button>
                <button
                  onClick={handleDeleteOpen}
                  className="px-20 py-4 font-semibold hover:bg-red-500 cursor-pointer transition-all duration-300 1s bg-red-600 rounded-xs outline-none border-none text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default UserDetails;
