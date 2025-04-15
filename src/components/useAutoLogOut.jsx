import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogOut = (timeout = 10 * 60 * 1000) => {
  const navigate = useNavigate();
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("current");
        navigate("/sign-in");
      }, timeout);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timer);
    };
  }, [navigate, timeout]);
};

export default useAutoLogOut;
