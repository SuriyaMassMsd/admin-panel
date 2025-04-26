import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import CustomizedAccordions from "./AccordionUi";
import Input from "../Input";
import { getData, postData } from "../../hooks/api";
import { mutate } from "swr";

const schema = z.object({
  title: z
    .string()
    .min(10, { message: "Title must contain at least 10 character(s)" }),
  description: z
    .string()
    .min(10, { message: "Description must contain at least 10 character(s)" }),
});

const Accordion = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const details = course;

  const methods = useForm({
    resolver: zodResolver(schema),
  });

  const { data: chapterData } = getData(`${apiUrl}/chapter`);
  const { data: lessonData } = getData(`${apiUrl}/lesson`);
  const { trigger: createChapter } = postData(`${apiUrl}/chapter`);
  const { trigger: createLesson } = postData(`${apiUrl}/lesson`);

  const submitChapter = async (formData) => {
    try {
      const payload = { ...formData, courseId: details.courseId };
      const response = await createChapter({ payload });

      if (response.error === false) {
        toast.success("Chapter added successfully!");
        mutate(`${apiUrl}/chapter`); // Refetch chapters
        setIsModalOpen(false);
        methods.reset();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Create chapter failed", err);
    }
  };

  const addLesson = async (lessonFormData, onSuccess) => {
    try {
      const response = await createLesson({ payload: lessonFormData });

      if (response.error === false) {
        toast.success("Lesson added successfully!");
        mutate(`${apiUrl}/lesson`); // Refetch lessons
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Create lesson failed", err);
    }
  };

  return (
    <>
      <div className="font-semibold text-[18px] flex justify-between items-center rounded-lg shadow-sm w-full mb-4 p-2">
        <h1>Chapters</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-sm px-6 py-2 rounded cursor-pointer font-semibold"
        >
          Add Chapter
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Create Chapter</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer text-xl"
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
                    type="button"
                    className="mt-4 w-full text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-500"
                    onClick={() => methods.reset()}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Add Chapter
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}

      {chapterData?.value
        ?.filter((chapter) => chapter.courseId === details.courseId)
        .map((chapter, index) => (
          <CustomizedAccordions
            key={index}
            item={chapter}
            lesson={lessonData?.value?.filter(
              (lesson) => lesson.chapterId === chapter.chapterId
            )}
            addLesson={addLesson}
          />
        ))}
    </>
  );
};

export default Accordion;
