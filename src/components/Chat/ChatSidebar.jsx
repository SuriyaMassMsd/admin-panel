import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useChat } from "../../context/ChatContext";
import SidebarSkeleton from "../Skeleton/SidebarSkeleton";
import { Users } from "lucide-react";

const ChatSidebar = () => {
  const {
    users,
    selectedUsers,
    setSelectedUsers,
    getUser,
    onlineUsers,
    isLoading,
    getMessages,
    isManualSelection,
  } = useChat();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Only fetch users once when component mounts
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     if (users.length === 0 && !isLoading) {
  //       await getUser();
  //     }
  //   };
  //   fetchUsers();
  // }, [getUser, users.length, isLoading]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length === 0) {
        await getUser();
      }
    };
    fetchUsers();
  }, [getUser, users.length]); // ✅ Safe now, since getUser is memoized

  // Memoize filtered users
  const filteredUsers = useMemo(() => {
    return showOnlineOnly
      ? users.filter((user) => onlineUsers.includes(user.userId))
      : users;
  }, [users, onlineUsers, showOnlineOnly]);

  // Handle user selection
  const handleSelectUser = useCallback(
    async (user) => {
      if (
        localLoading ||
        (selectedUsers && selectedUsers.userId === user.userId)
      ) {
        return;
      }

      try {
        setLocalLoading(true);
        setSelectedUsers(user, true); // Mark as manual selection
        await getMessages(user.userId);
      } catch (error) {
        console.error("Error selecting user:", error);
      } finally {
        setLocalLoading(false);
      }
    },
    [selectedUsers, setSelectedUsers, getMessages, localLoading]
  );

  if (isLoading && users.length === 0) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({Math.max(onlineUsers.length - 1, 0)} online)
          </span>
        </div> */}
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers?.map((user) => {
          // user.user.i
          // const isOnline = onlineUsers.some((u) => u.userId === user.userId);
          return (
            <button
              key={user.userId}
              onClick={() => handleSelectUser(user)}
              disabled={localLoading}
              className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
            cursor-pointer
            ${selectedUsers?.userId === user.userId ? "bg-base-300 ring-1 ring-base-300" : ""}
            ${localLoading ? "opacity-70 cursor-not-allowed" : ""}
          `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.user.profilePicture || "/avatar.png"}
                  alt={user.fullName || "User"}
                  className="size-12 object-cover rounded-full "
                  loading="lazy"
                />
                {user.user?.isActive && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">
                  {user.user?.username}
                </div>
                <div className="text-sm text-zinc-400">
                  {user.user?.isActive ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            {showOnlineOnly ? "No online users" : "No users available"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default React.memo(ChatSidebar);
