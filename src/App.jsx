import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import "global";
import { Bounce, ToastContainer } from "react-toastify";
import useAutoLogOut from "./components/useAutoLogOut.jsx";

const App = () => {
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Sidebar />
    </div>
  );
};

export default App;
