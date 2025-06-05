import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { socket } from "../libs/socket";
import toast from "react-hot-toast";
import { getUserValue } from "../components/UserType";
import { getData } from "../hooks/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUsers, setSelectedUsersState] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isManualSelection, setIsManualSelection] = useState(false);

  const apiUrl = import.meta.env.VITE_BASE_URL;
  const { id: authUserId } = getUserValue();
  const token = localStorage.getItem("token");

  // Set selected user
  const setSelectedUsers = useCallback((user, manual = false) => {
    setIsManualSelection(manual);
    setSelectedUsersState(user);
  }, []);

  // Socket setup
  useEffect(() => {
    if (!authUserId) return;

    socket.auth = {
      token: localStorage.getItem("token"),
      userId: authUserId,
    };
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
      toast.error(`Socket connection failed: ${err.message}`);
    });

    const handleIncomingMessage = (message) => {
      const processedMessage = {
        ...message,
        timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
      };
      setMessages((prev) => [...prev, processedMessage]);
    };

    socket.on("doubt", handleIncomingMessage);

    return () => {
      socket.off("doubt", handleIncomingMessage);
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [authUserId]);

  console.log(onlineUsers);

  // Listen only to messages from selected user
  useEffect(() => {
    if (!selectedUsers) return;

    const handleNewMessage = (msg) => {
      if (msg.senderId === selectedUsers.id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === msg.id);
          return exists ? prev : [...prev, msg];
        });
      }
    };

    socket.on("doubt", handleNewMessage);
    return () => socket.off("doubt", handleNewMessage);
  }, [selectedUsers]);

  // Get chat user list
  const {
    data: userData,
    error: userError,
    mutate: userListMutate,
  } = getData(`${apiUrl}/doubt/chatlist`);

  const getUser = useCallback(() => {
    const user = getUserValue();
    const id = user?.id;
    if (!id) return;

    setLoading(true);

    try {
      if (userError || !userData) {
        throw new Error("Failed to fetch users");
      }

      if (Array.isArray(userData?.value)) {
        setUsers(userData.value); // All users
        const active = userData.value
          .filter((item) => item.user?.isActive)
          .map((item) => item.user);
        setOnlineUsers(active); // Only active users
      } else {
        setUsers([]);
        setOnlineUsers([]);
      }

      userListMutate();
    } catch (error) {
      toast.error(error.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [userData, userError, userListMutate]);

  // Get messages using SWR
  const {
    data: userMessage,
    error: userMessageErr,
    mutate: userMutate,
  } = getData(
    selectedUsers?.userId
      ? `${apiUrl}/doubt/student/${selectedUsers.userId}`
      : null
  );

  // Update message state when fetched
  useEffect(() => {
    if (userMessage?.value) {
      const processedMessages = userMessage.value.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      }));
      setMessages(processedMessages);
    } else {
      setMessages([]);
    }
  }, [userMessage]);

  // Send message
  const sendMessage = useCallback(
    async (data) => {
      if (!selectedUsers) {
        throw new Error("No user selected");
      }

      setLoading(true);

      try {
        let content = data.messageContent;
        let messageType = "TEXT";

        // If image file exists, convert to Base64
        if (data.file) {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(data.file);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
          });

          content = base64;
          messageType = "IMAGE";
        }

        const payload = {
          action: "SOLVE_DOUBT",
          solveDoubtDto: {
            courseId: data.courseId,
            lessonId: data.lessonId,
            userId: selectedUsers.userId,
            messageContent: content,
            messageType: messageType,
          },
        };

        // Optimistic UI
        const optimisticMessage = {
          ...payload.solveDoubtDto,
          timestamp: new Date(),
          senderId: authUserId,
        };

        setMessages((prev) => [...prev, optimisticMessage]);

        // Emit to socket
        socket.emit("doubt", payload, (res) => {
          if (res?.data) {
            const received = {
              ...res.data,
              timestamp: new Date(),
              senderId: authUserId,
            };
            setMessages((prev) => [...prev, received]);
            userMutate(); // revalidate
          }
        });
      } catch (err) {
        console.error("Message sending failed:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedUsers, authUserId, userMutate]
  );

  return (
    <ChatContext.Provider
      value={{
        users,
        onlineUsers,
        messages,
        selectedUsers,
        setSelectedUsers,
        getUser,
        sendMessage,
        isLoading,
        isManualSelection,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
