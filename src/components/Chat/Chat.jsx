import React from "react";
import { useChat } from "../../context/ChatContext";
import NoChatSelected from "../NoChatSelected";
import ChatContainer from "../ChatContainer";
import ChatSidebar from "./ChatSidebar";

export default function Chat() {
  const { selectedUsers } = useChat();

  return (
    <div className="h-screen -mt-20">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <ChatSidebar />
            {!selectedUsers ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}
