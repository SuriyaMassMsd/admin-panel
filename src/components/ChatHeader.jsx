import { X } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
// import { useChatStore } from "../store/useChatStore";
import { useChat } from "../context/ChatContext";

const ChatHeader = () => {
  const { selectedUsers, setSelectedUsers, onlineUsers } = useChat();
  // const { onlineUsers } = useAuthStore();

  // console.log("username", selectedUsers.user?.username);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUsers.user.profilePicture || "/avatar.png"}
                alt={selectedUsers.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedUsers.user?.username || "Student"}
            </h3>
            <p className="text-sm text-base-content/70">
              {selectedUsers.user?.isActive ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          className="cursor-pointer"
          onClick={() => setSelectedUsers(null)}
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
