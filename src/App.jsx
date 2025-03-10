import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import "global";

const App = () => {
  useEffect(() => {
    document.title = "Admin Panel";
  }, []);
  return (
    <div>
      <Sidebar />
    </div>
  );
};

export default App;
