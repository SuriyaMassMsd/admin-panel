import { Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getData } from "../hooks/api";
import Input from "../components/Input"; // ✅ Make sure this path is correct

// Zod schema
const schema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, { message: "Title cannot be empty" }),

  body: z
    .string({ required_error: "Body is required" })
    .min(1, { message: "Body cannot be empty" }),

  userId: z
    .number({ required_error: "User is required" })
    .int({ message: "User must be an integer" }),
});

const Notifications = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
  });

  const [selectedTab, setSelectedTab] = useState("Individual");

  const handleChange = (event) => {
    setSelectedTab(event.target.value);
  };

  const apiUrl = import.meta.env.VITE_BASE_URL;
  const {
    data: users,
    isLoading,
    error: usersError,
  } = getData(`${apiUrl}/users`);

  console.log(users);

  const submitData = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div>
      {/* Dropdown to choose audience type */}
      <div className="flex justify-end">
        <Select
          value={selectedTab}
          onChange={handleChange}
          sx={{ color: "#90caf9", minWidth: 150 }}
        >
          <MenuItem value="Individual">Individual</MenuItem>
          <MenuItem value="Role">Role</MenuItem>
          <MenuItem value="Topic">Topic</MenuItem>
          <MenuItem value="All">All</MenuItem>
        </Select>
      </div>

      {/* Main form container */}
      <div
        className="rounded-[12px] w-[60%] px-20 py-4 mt-10 mb-10"
        id="shadow"
      >
        <FormProvider {...methods}>
          <form
            className="space-y-4 w-full mb-10"
            onSubmit={methods.handleSubmit(submitData)}
          >
            {/* Title */}
            <Input
              name="title"
              id="title"
              type="text"
              label="Title"
              placeholder="title*"
              error={methods.formState.errors.title}
            />

            {/* Body */}
            <Input
              name="body"
              id="body"
              type="textarea"
              label="Body"
              placeholder="body*"
              error={methods.formState.errors.body}
            />

            {/* UserId (Select from API) */}
            <Select
              name="userId"
              value={methods.getValues("userId") || ""}
              onChange={(e) =>
                methods.setValue("userId", parseInt(e.target.value))
              }
              displayEmpty
              fullWidth
              disabled={isLoading}
              error={Boolean(methods.formState.errors.userId)}
            >
              <MenuItem value="" disabled>
                Select a user
              </MenuItem>
              {!isLoading &&
                users?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
            </Select>
            {methods.formState.errors.userId && (
              <p className="text-red-500 text-sm">
                {methods.formState.errors.userId.message}
              </p>
            )}

            {/* Buttons */}
            <div className="flex justify-between gap-4">
              <button
                type="button"
                className="mt-4 w-full text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-400 rounded px-4 py-4 text-center font-semibold dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-500"
                onClick={() => methods.reset()}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#00bbab] hover:bg-[#51ada5f3] w-full font-semibold text-white py-4 px-4 rounded mt-4"
              >
                Submit
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Notifications;
