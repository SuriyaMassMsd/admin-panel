import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import "global";

const App = () => {
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
