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
import { CloseOutlined } from "@mui/icons-material";
import dayjs from "dayjs";

// Custom Bootstrap-like Dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    // padding: theme.spacing(2),
    width: "50vw",
    maxWidth: "none",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
}));

export default function TicketDetails({ open, handleClose, data }) {
  const [inputValue, setInputValue] = React.useState("");
  const {
    message,
    ticketId,
    username,
    createdAt,
    solution,
    handlerName,
    updatedAt,
  } = data;
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
      toast.success("Solution submitted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BootstrapDialog open={open} onClose={handleClose}>
      {data.ticketStatus === 1 ? (
        <div
          style={{
            // maxWidth: "440px",
            width: "100%",
            margin: "auto",
            padding: "28px",
            borderRadius: "20px",
            backdropFilter: "blur(14px)",
            background: "rgba(255, 255, 255, 0.75)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            fontFamily: "'Segoe UI', sans-serif",
            color: "#333",
          }}
        >
          <div className="flex justify-between items-center">
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 700,
                marginBottom: "24px",
                color: "#222",
              }}
            >
              🎫 Close Ticket
            </h2>

            <h1
              onClick={handleClose}
              className="cursor-pointer font-semibold hover:text-gray-600"
            >
              <CloseOutlined />
            </h1>
          </div>

          <div
            style={{
              marginBottom: "20px",
              padding: "16px",
              background: "#f9f9f9",
              borderRadius: "12px",
              borderLeft: "4px solid #6366f1",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                color: "#444",
              }}
            >
              📝 <span style={{ marginLeft: "8px" }}>Message</span>
            </div>
            <p
              style={{
                fontSize: "14.5px",
                lineHeight: 1.6,
                color: "#555",
                margin: 0,
              }}
            >
              {message}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13.5px",
              color: "#666",
              marginBottom: "24px",
              padding: "12px 16px",
              background: "#fdfdfd",
              borderRadius: "10px",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600, color: "#444" }}>
                👤 Issued by
              </span>
              <span>{username ? username : "unknown"}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
              }}
            >
              <span style={{ fontWeight: 600, color: "#444" }}>
                ⏰ Issued at
              </span>
              <span>
                {dayjs(Number(createdAt))
                  .format("DD.MMM.YYYY, hh:mm A")
                  .toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="solution"
              style={{
                display: "block",
                fontWeight: 600,
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              🛠️ Solution
            </label>
            <textarea
              id="solution"
              rows="5"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe the resolution..."
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                fontSize: "14px",
                outline: "none",
                transition: "border 0.2s ease-in-out",
              }}
            ></textarea>
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
          >
            <button
              onClick={handleReset}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#f3f3f3",
                color: "#333",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              Reset
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.3s ease",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      ) : data.ticketStatus === 2 ? (
        <div
          style={{
            // maxWidth: "460px",
            width: "100%",
            margin: "auto",
            padding: "28px",
            borderRadius: "20px",
            backdropFilter: "blur(14px)",
            background: "rgba(255, 255, 255, 0.75)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            fontFamily: "'Segoe UI', sans-serif",
            color: "#333",
          }}
        >
          <div className="flex justify-between items-center">
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 700,
                marginBottom: "24px",
                color: "#222",
              }}
            >
              🎫 Closed Ticket
            </h2>

            <h1
              onClick={handleClose}
              className="cursor-pointer font-semibold hover:text-gray-600"
            >
              <CloseOutlined />
            </h1>
          </div>
          <div
            style={{
              marginBottom: "20px",
              padding: "16px",
              background: "#f9f9f9",
              borderRadius: "12px",
              borderLeft: "4px solid #6366f1",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                color: "#444",
              }}
            >
              📝 <span style={{ marginLeft: "8px" }}>Message</span>
            </div>
            <p
              style={{
                fontSize: "14.5px",
                lineHeight: 1.6,
                color: "#555",
                margin: 0,
              }}
            >
              {message}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13.5px",
              color: "#666",
              marginBottom: "24px",
              padding: "12px 16px",
              background: "#fdfdfd",
              borderRadius: "10px",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600, color: "#444" }}>
                👤 Issued by
              </span>
              <span>{username ? username : "unknown"}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
              }}
            >
              <span style={{ fontWeight: 600, color: "#444" }}>
                ⏰ Issued at
              </span>
              <span>
                {dayjs(Number(createdAt))
                  .format("DD.MMM.YYYY, hh:mm A")
                  .toUpperCase()}
              </span>
            </div>
          </div>

          <div
            style={{
              marginBottom: "24px",
              padding: "18px 20px",
              background: "#eef4ff",
              borderRadius: "14px",
              borderRight: "4px solid #3b82f6",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                color: "#3b4b69",
              }}
            >
              ✅ <span style={{ marginLeft: "8px" }}>Solution Provided</span>
            </div>
            <p
              style={{
                fontSize: "14.5px",
                lineHeight: 1.6,
                color: "#444",
                margin: 0,
              }}
            >
              {solution}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13.5px",
              color: "#666",
              padding: "12px 16px",
              background: "#fdfdfd",
              borderRadius: "10px",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600, color: "#444" }}>
                🔒 Closed by
              </span>
              <span>{handlerName ? handlerName : "unknown"}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
              }}
            >
              <span style={{ fontWeight: 600, color: "#444" }}>
                📅 Closed at
              </span>
              <span>
                {dayjs(Number(updatedAt))
                  .format("DD.MMM.YYYY, hh:mm A")
                  .toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </BootstrapDialog>
  );
}
