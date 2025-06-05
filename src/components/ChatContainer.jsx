import React, { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../libs/utils";
import { getUserValue } from "./UserType";

const ChatContainer = () => {
  const { messages, selectedUsers, onlineUsers } = useChat();
  const { profilePicture } = getUserValue();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current && messages?.length) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUsers) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message, index) => {
          const isCurrentUser = message.senderId === selectedUsers.id;
          const profilePic =
            (message.senderId === selectedUsers.id &&
              selectedUsers.user.profilePicture) ||
            "/avatar.png";
          // : onlineUsers?.user.profilePicture || "/avatar.png";

          return (
            <div
              key={message.id}
              className={`chat ${message.side !== 1 ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.side !== 1
                        ? profilePicture
                        : selectedUsers.user.profilePicture
                    }
                    alt="profile"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.timestamp || message.createdAt)}
                </time>
              </div>

              <div className="chat-bubble flex flex-col">
                {message.messageType === "IMAGE" ? (
                  <img
                    src={message.messageContent}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                ) : (
                  message.messageContent && <p>{message.messageContent}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
