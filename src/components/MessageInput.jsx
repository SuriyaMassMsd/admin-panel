import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useChat } from "../context/ChatContext";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUsers, isLoading } = useChat();

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !imageFile) || !selectedUsers) return;

    try {
      // Send message (text or image) using sendMessage from context
      const messageData = {
        courseId: selectedUsers.courseId,
        lessonId: selectedUsers.lessonId,
        messageContent: text.trim(),
        file: imageFile,
      };

      // Send the message
      await sendMessage(messageData);

      // Reset form after successful send
      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.message || "Failed to send message");
    }
  };

  // Keyboard shortcut for sending (Enter key)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="p-4 w-full border-t border-base-300">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              type="button"
              aria-label="Remove image"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Message form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Text input */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isLoading}
          />

          {/* Image upload button */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle btn-sm ${
              imagePreview ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            aria-label="Attach image"
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className={`btn btn-circle btn-sm ${
            text.trim() || imageFile ? "btn-primary" : "btn-ghost"
          }`}
          disabled={(!text.trim() && !imageFile) || isLoading}
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
