import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { postData } from "../hooks/api";
import { toast } from "react-toastify";

// Define the validation schema with Zod
const schema = z.object({
  type: z.enum(["Individual", "Role-based", "Topic-based", "All"]),
  userId: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      const type = ctx.parent?.type; // Accessing the parent data structure (form)
      if (type === "Individual" && !val) {
        ctx.addIssue({
          path: ["userId"],
          message: "User ID is required for Individual type",
          code: z.ZodIssueCode.custom,
        });
      }
    }),
  targetValue: z.enum(["student", "instructor", "admin"]).optional(),
  topicValue: z.enum(["general", "courses", "community"]).optional(),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  // route: z.string().min(1, "Route is required"),
});

const NotificationForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "Individual",
      targetValue: "student",
      topicValue: "general",
    },
  });
  const [notifyType, setNotify] = useState("Individual");

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const {
    trigger: postNotification,
    isLoading,
    error,
  } = postData(
    notifyType !== "Individual"
      ? `${apiUrl}/fcm/broadcast`
      : `${apiUrl}/fcm/notify`
  );

  const onSubmit = async (data) => {
    setNotify(data.type);
    const base = {
      title: data.title,
      body: data.body,
      data: {},
    };

    let payload = { ...base };

    if (data.type === "Individual") {
      payload.userId = Number(data.userId);
    } else if (data.type === "Role-based") {
      payload.targetGroup = "role";
      payload.targetValue = data.targetValue;
    } else if (data.type === "Topic-based") {
      payload.targetGroup = "topic";
      payload.targetValue = data.topicValue;
    }
    const response = await postNotification(payload);
    const result = await response.json();
    if (!response.ok) throw new Error("somthing went wrong");

    if (result.error === false) {
      toast.success("Notification sent successfully");
      console.log("Payload:", payload);
    }
  };

  const type = watch("type");

  return (
    <div className="flex justify-start p-4 text-gray-600">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg p-8 rounded-xl "
        id="shadow"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Send Notification
        </h2>

        <div className="mb-4">
          <label className="block text-gray-500 mb-1">Notification Type</label>
          <select
            {...register("type")}
            className="w-full p-2 border rounded-md"
          >
            <option value="Individual">Individual</option>
            <option value="Role-based">Role-based</option>
            <option value="Topic-based">Topic-based</option>
            <option value="All">All</option>
          </select>
          {errors.type && (
            <span className="text-red-500">{errors.type.message}</span>
          )}
        </div>

        {/* Show userId input for Individual type */}
        {type === "Individual" && (
          <div className="mb-4">
            <label className="block text-gray-500 mb-1">User ID</label>
            <input
              type="number"
              {...register("userId")}
              className="w-full p-2 border rounded-md"
            />
            {errors.userId && (
              <span className="text-red-500">{errors.userId.message}</span>
            )}
          </div>
        )}

        {/* Show targetValue input for Role-based type */}
        {type === "Role-based" && (
          <div className="mb-4">
            <label className="block text-gray-500 mb-1">Select Role</label>
            <select
              {...register("targetValue")}
              className="w-full p-2 border rounded-md"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
            {errors.targetValue && (
              <span className="text-red-500">{errors.targetValue.message}</span>
            )}
          </div>
        )}

        {/* Show topicValue input for Topic-based type */}
        {type === "Topic-based" && (
          <div className="mb-4">
            <label className="block text-gray-500 mb-1">Select Topic</label>
            <select
              {...register("topicValue")}
              className="w-full p-2 border rounded-md"
            >
              <option value="general">General</option>
              <option value="courses">Courses</option>
              <option value="community">Community</option>
            </select>
            {errors.topicValue && (
              <span className="text-red-500">{errors.topicValue.message}</span>
            )}
          </div>
        )}

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-500 mb-1">Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full p-2 border rounded-md"
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
        </div>

        {/* Body */}
        <div className="mb-4">
          <label className="block text-gray-500 mb-1">Body</label>
          <input
            type="text"
            {...register("body")}
            className="w-full p-2 border rounded-md"
          />
          {errors.body && (
            <span className="text-red-500">{errors.body.message}</span>
          )}
        </div>

        {/* Route */}
        {/* <div className="mb-4">
          <label className="block text-gray-500 mb-1">Route</label>
          <input
            type="text"
            {...register("route")}
            className="w-full p-2 border rounded-md"
          />
          {errors.route && (
            <span className="text-red-500">{errors.route.message}</span>
          )}
        </div> */}

        <div className="flex justify-between gap-6 mt-8">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-2 rounded-md bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition cursor-pointer"
          >
            Submit Notification
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationForm;
