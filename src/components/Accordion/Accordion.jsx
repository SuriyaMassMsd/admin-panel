import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Input from "../Input";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomizedAccordions from "./AccordionUi";
import { toast } from "react-toastify";

const schema = z.object({
  title: z
    .string()
    .min(10, { message: "Title must contain at least 10 character(s)" }),
  description: z
    .string()
    .min(10, { message: "Description must contain at least 10 character(s)" }),
});

const Accordion = ({ course }) => {
  const [data, setData] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const details = course;
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const methods = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const chapterData = async () => {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_BASE_URL;
      try {
        const response = await fetch(`${apiUrl}/chapter`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const formDatas = await response.json();
        if (!response.ok) throw new Error(formDatas.message);
        setData(formDatas.value || []);
      } catch (err) {
        console.log(err);
      }
    };

    chapterData();
  }, []);

  const fetchLesson = async () => {
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_BASE_URL;

    try {
      const response = await fetch(`${apiUrl}/lesson`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      setLesson(responseData.value || []);
      if (!response.ok) throw new Error(responseData.message);
    } catch (err) {
      console.error("lesson fetch failed", err);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, []);

  const addLesson = async (newLesson, onSuccess) => {
    try {
      const response = await fetch(`${apiUrl}/lesson`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: newLesson,
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message);

      if (responseData.error === false) {
        toast.success("lesson added successful");
        setLesson((pre) => [...pre, responseData.value]);
        await fetchLesson();
        if (onSuccess) onSuccess();
      } else {
        toast.error(responseData.message);
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Upload failed", err);
    }
  };

  const submitChapter = async (data) => {
    const sentData = { ...data, courseId: details.courseId };
    try {
      const response = await fetch(`${apiUrl}/chapter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sentData),
      });

      const formDatas = await response.json();
      if (!response.ok) throw new Error(formDatas.message);

      if (formDatas.error) {
        toast.error(formDatas.message);
        setIsModalOpen(false);
      } else if (formDatas.error === false) {
        setData((pre) => [...pre, formDatas.value]);
        toast.success("Chapter added succssfully");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="font-semibold text-[18px] flex justify-between items-center rounded-lg shadow-sm w-full mb-4 p-2">
        <h1>Chapters</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300   text-sm px-6 py-2 rounded cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 font-semibold"
        >
          Add Chapter
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 text-black bg-black opacity-95 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Create Chapter</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer "
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
                  label="Chapter Title"
                  placeholder="Enter chapter name"
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
                    className="cursor-pointer
    duration-150 
    ease-in-out
    transition-all 1s mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Add Chapter
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}

      {data &&
        data
          .filter((item) => item.courseId === details.courseId)
          .map((item, i) => (
            <CustomizedAccordions
              lesson={lesson?.filter((l) => l.chapterId === item.chapterId)}
              key={i}
              item={item}
              addLesson={addLesson}
            />
          ))}
    </>
  );
};

export default Accordion;
