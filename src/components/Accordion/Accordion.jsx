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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const details = course;

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

  const submitChapter = async (data) => {
    const token = localStorage.getItem("token");
    const sentData = { ...data, courseId: details.courseId };
    const apiUrl = import.meta.env.VITE_BASE_URL;
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

      if (response.status === 200) {
        toast.success("Chapter added succssfully");
        setIsModalOpen(false);
      } else {
        toast.error(response.message);
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
                <button
                  type="submit"
                  className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add Chapter
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      )}

      {data &&
        data
          .filter((item) => item.courseId === details.courseId)
          .map((item, i) => <CustomizedAccordions key={i} item={item} />)}
    </>
  );
};

export default Accordion;
