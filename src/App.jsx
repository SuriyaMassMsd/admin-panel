import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import "global";
import useAutoLogOut from "./components/useAutoLogOut.jsx";
import useFcmToken from "./firebase/firebase.js";
import { ChatProvider, useChat } from "./context/ChatContext.jsx";

const App = () => {
  const { token, deviceType } = useFcmToken();
  console.log(token, deviceType);
  // const {} = useChat();

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
      <ChatProvider>
        <Sidebar />
      </ChatProvider>
    </div>
  );
};

export default App;
