import React, { useEffect, useState } from "react";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";

const schema = z.object({
  title: z
    .string()
    .min(10, { message: "Title must contain at least 10 character(s)" }),
  description: z
    .string()
    .min(10, { message: "Description must contain at least 10 character(s)" }),
  video: z
    .union([
      z.instanceof(File),
      z.object({
        file: z.instanceof(File),
        duration: z.number().optional(),
      }),
    ])
    .refine((value) => !!value, { message: "Video is required" }),
});

const CustomizedAccordions = ({ lesson, item, addLesson }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const details = JSON.parse(localStorage.getItem("item"));

  const methods = useForm({
    resolver: zodResolver(schema),
  });

  // console.log(item);

  const submitChapter = async (formData) => {
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_BASE_URL;

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);

    if (formData.video.file) {
      payload.append("video", formData.video.file);
      if (formData.video.duration) {
        payload.append(
          "duration",
          formData.video.duration.toString().split(".")[0]
        );
      }
    } else {
      payload.append("video", formData.video);
    }
    payload.append("courseId", item.courseId);
    payload.append("chapterId", item.chapterId);

    console.log("Data to be sent:", Object.fromEntries(payload.entries()));
    addLesson();
  };

  return (
    <>
      <MuiAccordion>
        <MuiAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div className="flex justify-between w-full items-center">
            <h1>{item.title}</h1>
            <span>{/* <KeyboardArrowDownIcon /> */}</span>
          </div>
        </MuiAccordionSummary>
        <MuiAccordionDetails sx={{ backgroundColor: "gray" }}>
          <div className="flex flex-wrap mb-1 ">
            {lesson &&
              lesson
                .filter(
                  (items) =>
                    items.courseId === item.courseId &&
                    items.chapterId === item.chapterId
                )
                .map((item, i) => (
                  <div
                    key={i}
                    className="flex mb-1 justify-between items-start  rounded-lg w-full"
                  >
                    <span className="hover:underline cursor-pointer hover:underline-offset-2 px-2 rounded-md">
                      {item.title}
                    </span>
                    <span className=" px-2 rounded-md">{item.duration}min</span>
                  </div>
                ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            type="submit"
            className="
            cursor-pointer
    mt-2
    font-medium rounded-lg text-sm px-10 py-3 text-center
    bg-pink-300 text-white hover:bg-pink-400 focus:ring-4 focus:outline-none focus:ring-pink-200
    dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-500
  "
          >
            Add Lesson
          </button>
        </MuiAccordionDetails>
      </MuiAccordion>

      {isModalOpen && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl h-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Create Lesson</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer"
              >
                ✖️
              </button>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(submitChapter)}>
                <Input
                  name="title"
                  id="title"
                  type="text"
                  label="Lesson Title"
                  placeholder="Enter lesson name"
                  error={methods.formState.errors.title}
                />
                <Input
                  name="description"
                  id="description"
                  type="textarea"
                  label="Description"
                  placeholder="Description*"
                  error={methods.formState.errors.description}
                />
                <Input
                  name="video"
                  id="video"
                  type="file"
                  label="video"
                  error={methods.formState.errors.video}
                  methods={methods}
                  accept="video/*"
                />
                <div className="flex justify-between items-center gap-4">
                  <button
                    className="
                              mt-4
                              w-full
                              text-gray-800          
                              bg-gray-200            
                              cursor-pointer
                              duration-150 
                              ease-in-out
                              transition-all 1s
                              hover:bg-gray-300      
                              focus:ring-4
                              focus:outline-none
                              focus:ring-gray-400    
                              font-medium
                              rounded-lg
                              text-sm
                              px-5
                              py-2.5
                              text-center

                              dark:text-white        
                              dark:bg-gray-600       
                              dark:hover:bg-gray-700 
                              dark:focus:ring-gray-500
                            "
                    onClick={() => methods.reset()}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="mt-4 w-full cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Add Lesson
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomizedAccordions;
