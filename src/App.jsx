import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import "global";
import useAutoLogOut from "./components/useAutoLogOut.jsx";
import useFcmToken from "./firebase/firebase.js";

const App = () => {
  const { token, deviceType } = useFcmToken();
  console.log(token, deviceType);

  useAutoLogOut();
  useEffect(() => {
    document.title = "Admin Panel";
    const pathName = localStorage.getItem("current");

    if (pathName !== "/courses/details") {
      localStorage.removeItem("item");
    }
  }, []);
  return (
    <div>
      <Sidebar />
    </div>
  );
};

export default App;
