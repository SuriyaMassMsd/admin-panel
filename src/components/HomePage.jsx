import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import useFcmToken from "../firebase/firebase"; // adjust the path if needed

const HomePage = () => {
  const location = useLocation();
  const { getFcmToken, deviceType } = useFcmToken();

  const [openFcmDialog, setOpenFcmDialog] = useState(false);
  const [tokenFromApi, setTokenFromApi] = useState(null);

  // ✅ Show dialog only after login success and navigation to this page
  useEffect(() => {
    const token = localStorage.getItem("token"); // or however you store it
    if (token && !localStorage.getItem("fcmToken")) {
      setTokenFromApi(token);
      setOpenFcmDialog(true);
    }
  }, []);

  const sendFcmToken = async () => {
    let fcmToken = null;
    let attempts = 0;

    while (!fcmToken && attempts < 10) {
      fcmToken = getFcmToken();
      if (fcmToken) break;
      await new Promise((res) => setTimeout(res, 500));
      attempts++;
    }

    if (fcmToken) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/fcm`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenFromApi}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fcmToken, deviceType }),
        });

        const result = await response.json();
        if (!result.error) {
          toast.success("✅ FCM token sent to server");
          localStorage.setItem(
            "fcmToken",
            JSON.stringify({ fcmToken, deviceType })
          );
        } else {
          throw new Error(result.message || "FCM server error");
        }
      } catch (err) {
        console.error("FCM error:", err);
        toast.error("❌ Failed to send FCM token");
      }
    } else {
      toast.warn("⚠️ FCM token not available");
    }
  };

  return (
    <div>
      HomePage
      {/* FCM Dialog */}
      <Dialog open={openFcmDialog} onClose={() => setOpenFcmDialog(false)}>
        <DialogTitle>Enable Notifications</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to enable push notifications on this device?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenFcmDialog(false);
              toast.info("Notifications disabled");
            }}
            color="error"
          >
            No
          </Button>
          <Button
            onClick={async () => {
              setOpenFcmDialog(false);
              await sendFcmToken();
            }}
            autoFocus
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;
