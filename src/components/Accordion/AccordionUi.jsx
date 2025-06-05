import React, { useState } from "react";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import Loader from "../Skeleton/Loader";
import { useTheme } from "@mui/material";

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
      z.object({ file: z.instanceof(File), duration: z.number().optional() }),
    ])
    .refine((value) => !!value, { message: "Video is required" }),
});

const CustomizedAccordions = ({
  chapterName,
  courseName,
  lesson,
  item,
  addLesson,
  setLessonId,
  updateLesson,
  loading,
  lessonEditLoading,
  expanded,
  onChange,
  onEdit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingLessonData, setEditingLessonData] = useState(null);

  const methods = useForm({ resolver: zodResolver(schema) });
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [lessonMenu, setLessonMenu] = useState({ anchor: null, data: null });

  const openCreateLessonModal = () => {
    setIsEditMode(false);
    setEditingLessonData(null);
    methods.reset();
    setIsModalOpen(true);
  };

  const handleLessonEdit = () => {
    const lesson = lessonMenu.data;
    setLessonMenu({ anchor: null, data: null });
    setIsEditMode(true);
    setEditingLessonData(lesson);
    methods.reset({
      title: lesson.title,
      description: lesson.description,
      video: undefined,
    });
    setIsModalOpen(true);
  };

  const submitLesson = async (formData) => {
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);

    if (formData.video) {
      if (formData.video instanceof File) {
        payload.append("video", formData.video);
      } else if (formData.video.file instanceof File) {
        payload.append("video", formData.video.file);
        if (formData.video.duration) {
          payload.append("duration", formData.video.duration.toString());
        }
      }
    }

    payload.append("courseId", item.courseId);
    payload.append("chapterId", item.chapterId);

    if (isEditMode && editingLessonData) {
      payload.append("lessonId", editingLessonData.lessonId);
      setLessonId(editingLessonData.lessonId);
      await updateLesson(payload, () => {
        setIsModalOpen(false);
        methods.reset();
      });
      setIsModalOpen(false);
    } else {
      await addLesson(payload, () => {
        setIsModalOpen(false);
        methods.reset();
      });
    }
  };

  return (
    <>
      <MuiAccordion expanded={expanded} onChange={onChange}>
        <MuiAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className="flex justify-between w-full items-center">
            <h1>{item.title}</h1>
            <div>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={onEdit}>Edit</MenuItem>
                <MenuItem>Move</MenuItem>
                <MenuItem>Delete</MenuItem>
              </Menu>
            </div>
          </div>
        </MuiAccordionSummary>
        <MuiAccordionDetails sx={{ backgroundColor: "gray" }}>
          <div className="flex flex-wrap mb-1 w-full">
            {lesson?.map((lessonItem, i) => (
              <div
                key={i}
                className="flex justify-between items-center w-full px-2 py-1 rounded mb-2"
              >
                <span
                  className={`${isDark ? "text-white" : "text-gray-800"} hover:underline cursor-pointer font-medium`}
                >
                  {lessonItem.title}
                </span>
                <div>
                  <span
                    className={`ml-2 text-sm ${isDark ? "text-white" : "text-gray-800"}`}
                  >
                    {lessonItem.duration} min
                  </span>
                  <IconButton
                    onClick={(e) =>
                      setLessonMenu({
                        anchor: e.currentTarget,
                        data: lessonItem,
                      })
                    }
                    size="small"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={openCreateLessonModal}
            className="cursor-pointer mt-2 font-medium rounded-lg text-sm px-10 py-3 bg-gray-500 text-white hover:bg-gray-600"
          >
            Add Lesson
          </button>
        </MuiAccordionDetails>
      </MuiAccordion>

      <Menu
        anchorEl={lessonMenu.anchor}
        open={Boolean(lessonMenu.anchor)}
        onClose={() => setLessonMenu({ anchor: null, data: null })}
      >
        <MenuItem onClick={handleLessonEdit}>Edit</MenuItem>
        <MenuItem>Move</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Menu>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl text-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {isEditMode ? "Edit Lesson" : "Create Lesson"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer text-xl"
              >
                ✖️
              </button>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(submitLesson)}>
                <input
                  type="text"
                  value={courseName}
                  disabled
                  className="mb-2 w-full bg-gray-200 px-3 py-2 rounded"
                />
                <input
                  type="text"
                  value={chapterName}
                  disabled
                  className="mb-2 w-full bg-gray-200 px-3 py-2 rounded"
                />
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
                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded"
                    onClick={() => methods.reset()}
                  >
                    Reset
                  </button>
                  <button
                    disabled={lessonEditLoading || loading}
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded"
                  >
                    {loading || lessonEditLoading ? (
                      <Loader />
                    ) : isEditMode ? (
                      "Update Lesson"
                    ) : (
                      "Add Lesson"
                    )}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}

      {(loading || lessonEditLoading) && (
        <div className="fixed inset-0 text-black flex justify-center items-center z-50 glass-premium p-6 rounded-2xl shadow-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl h-screen">
          <Loader />
        </div>
      )}
    </>
  );
};

export default CustomizedAccordions;
