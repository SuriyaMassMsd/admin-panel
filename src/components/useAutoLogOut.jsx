import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserValue } from "./UserType";

const useAutoLogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiry = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = getUserValue();
        if (!payload?.exp) return;

        const expiryInMs = payload.exp * 1000 - Date.now();

        if (expiryInMs <= 0) {
          handleLogout();
        } else {
          const timer = setTimeout(handleLogout, expiryInMs);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        handleLogout();
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/sign-in", { replace: true });
      window.dispatchEvent(new Event("storage"));
    };

    checkTokenExpiry();

    const handleStorageChange = (e) => {
      if (e.key === "token" && !e.newValue) {
        navigate("/sign-in", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);
};

export default useAutoLogOut;
