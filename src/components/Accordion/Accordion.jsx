import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import CustomizedAccordions from "./AccordionUi";
import Input from "../Input";
import { getData, postData, putData } from "../../hooks/api";
import { mutate } from "swr";
import Loader from "../Skeleton/Loader";

const schema = z.object({
  title: z.string(),
  description: z
    .string()
    .min(10, { message: "Description must contain at least 10 character(s)" }),
});

const Accordion = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const details = course;
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [openedChapterName, setOpenedChapterName] = useState("");
  const [editingLessonId, setLessonId] = useState(null);

  console.log(editingLessonId);

  const methods = useForm({
    resolver: zodResolver(schema),
  });

  const { data: chapterData } = getData(`${apiUrl}/chapter`);
  const { data: lessonData } = getData(`${apiUrl}/lesson`);
  const { trigger: createChapter, isMutating: isChapterLoading } = postData(
    `${apiUrl}/chapter`
  );
  const { trigger: updateChapter } = putData(
    `${apiUrl}/chapter/${editingChapterId}`
  );
  const { trigger: createLesson, isMutating: isLessonLoading } = postData(
    `${apiUrl}/lesson`
  );
  const { trigger: updateLesson, isMutating: lessonEditLoading } = putData(
    `${apiUrl}/lesson/${editingLessonId}`
  );

  const openEditModal = (chapter) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditingChapterId(chapter.chapterId);
    methods.reset({
      title: chapter.title,
      description: chapter.description,
    });
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    setEditingChapterId(null);
    methods.reset();
  };

  const submitChapter = async (formData) => {
    try {
      const payload = { ...formData, courseId: details.courseId };

      let response;

      if (isEditMode) {
        response = await updateChapter(payload);
      } else {
        response = await createChapter(payload);
      }

      if (response.error === false) {
        toast.success(
          `Chapter ${isEditMode ? "updated" : "added"} successfully!`
        );
        await mutate(`${apiUrl}/chapter`); // Refresh chapter data
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingChapterId(null);
        methods.reset();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Create/update chapter failed", err);
    }
  };

  const addLesson = async (lessonFormData, onSuccess) => {
    try {
      const response = await createLesson(lessonFormData);
      if (response.error === false) {
        toast.success("Lesson added successfully!");
        await mutate(`${apiUrl}/lesson`); // Refresh lesson data
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Create lesson failed", err);
    }
  };

  const updateExistingLesson = async (lessonFormData, onSuccess) => {
    try {
      const response = await updateLesson(lessonFormData);
      if (response.error === false) {
        toast.success("Lesson updated successfully!");
        await mutate(`${apiUrl}/lesson`); // Refresh lesson data
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Update lesson failed", err);
    }
  };

  return (
    <>
      <div className="font-semibold text-[18px] flex justify-between items-center rounded-lg shadow-sm w-full mb-4 p-2">
        <h1>Chapters</h1>
        <button
          onClick={openCreateModal}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-sm px-6 py-2 rounded cursor-pointer font-semibold"
        >
          Add Chapter
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 glass-premium p-6 rounded-2xl shadow-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {isEditMode ? "Edit Chapter" : "Create Chapter"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditingChapterId(null);
                }}
                className="cursor-pointer text-xl"
              >
                ✖️
              </button>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(submitChapter)}>
                <label htmlFor="courseName">Course Name</label>
                <input
                  id="courseName"
                  type="text"
                  value={details.title}
                  disabled
                  className="px-[10px] w-full my-2 py-[10px] rounded bg-gray-200 text-gray-500 cursor-not-allowed placeholder:text-gray-500 placeholder:font-[500] outline-none"
                />
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
                    className="mt-4 w-full text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={() => methods.reset()}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    {isChapterLoading ? (
                      <Loader />
                    ) : isEditMode ? (
                      "Update"
                    ) : (
                      "Add Chapter"
                    )}
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
            chapterName={openedChapterName}
            courseName={details.title}
            key={index}
            item={chapter}
            lesson={lessonData?.value?.filter(
              (lesson) => lesson.chapterId === chapter.chapterId
            )}
            addLesson={addLesson}
            updateLesson={updateExistingLesson} // Pass update function here
            lessonEditLoading={lessonEditLoading}
            loading={isLessonLoading}
            expanded={expandedPanel === index}
            setLessonId={setLessonId}
            onEdit={() => openEditModal(chapter)}
            onChange={() => {
              const nextExpanded = expandedPanel === index ? null : index;
              setExpandedPanel(nextExpanded);
              setOpenedChapterName(nextExpanded === null ? "" : chapter.title);
            }}
          />
        ))}

      {(isChapterLoading || (isLessonLoading && !isModalOpen)) && (
        <div className="fixed inset-0 text-black flex justify-center items-center z-50 glass-premium p-6 rounded-2xl shadow-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl h-screen">
          <Loader />
        </div>
      )}
    </>
  );
};

export default Accordion;
