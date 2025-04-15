import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserValue } from "./UserType";

const useAutoLogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = getUserValue();
    if (!payload?.exp) return;

    const expiryInMs = payload.exp * 1000 - Date.now();

    if (expiryInMs <= 0) {
      localStorage.removeItem("token");
      navigate("/sign-in");
    } else {
      const timer = setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/sign-in");
      }, expiryInMs);

      return () => clearTimeout(timer);
    }
  }, [navigate]);
};

export default useAutoLogOut;
