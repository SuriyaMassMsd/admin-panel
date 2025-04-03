import { object, z } from "zod";
import Input from "../components/Input";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RichTextEditor from "./../components/RichTextEditor";
import { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";

const schema = z.object({
  title: z
    .string()
    .min(10, { message: "Title must contain at least 10 character(s)" }),
  courseType: z.string().nonempty({ message: "Course type is required" }),
  introduction: z
    .string()
    .min(20, { message: "Introduction must contain at least 20 character(s)" }),
  description: z
    .string()
    .min(50, { message: "Description must contain at least 50 character(s)" }),
  highlights: z
    .array(z.string())
    .min(1, { message: "At least one highlight is required" }),
  tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
  category: z.string().nonempty({ message: "Category is required" }),
  duration: z.string().nonempty({ message: "Duration is required" }),
  currency: z.string().nonempty({ message: "Currenty is required" }),
  price: z.string().nonempty({ message: "Price is required" }),
  thumbnail: z.union([z.instanceof(File), z.string().url().or(z.literal(""))]),

  preview: z.union([z.instanceof(File), z.string().url().or(z.literal(""))]),
});
const MyForm = () => {
  const existingCourse = JSON.parse(localStorage.getItem("item"));
  console.log(existingCourse);

  const [loading, setLoading] = useState(false);
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: existingCourse
      ? {
          ...existingCourse,
          tags: existingCourse.tags || [],
          highlights: existingCourse.highlights || [],
          thumbnail: existingCourse.thumbnailUrl || "",
          preview: existingCourse.previewUrl || "",
        }
      : {
          tags: [],
          highlights: [],
          thumbnail: "",
          preview: "",
        },
  });

  useEffect(() => {
    if (existingCourse) {
      Object.entries(existingCourse).forEach(([key, value]) => {
        methods.setValue(key, value);
      });
    }
  }, [existingCourse, methods.setValue]);

  const success = () => {
    toast.success("Course Created Successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const submitData = async (data) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    // console.log(data);

    data.tags = data.tags ? data.tags.filter((tag) => tag.trim() !== "") : [];
    data.highlights = data.highlights
      ? data.highlights.filter((highlight) => highlight.trim() !== "")
      : [];

    if (data.tags.length === 0) {
      delete data.tags;
    }
    if (data.highlights.length === 0) {
      delete data.highlights;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("courseType", data.courseType);
    formData.append("introduction", data.introduction);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("duration", data.duration);
    formData.append("currency", data.currency);
    formData.append("price", data.price);

    formData.append("thumbnail", data.thumbnail);
    formData.append("preview", data.preview);

    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag) => formData.append("tags", tag));
    }
    if (data.highlights && data.highlights.length > 0) {
      data.highlights.forEach((highlight) =>
        formData.append("highlights", highlight)
      );
    }

    const apiUrl = import.meta.env.VITE_BASE_URL;
    try {
      const urlApi = existingCourse
        ? {
            url: `${apiUrl}/course/update/${existingCourse.courseId}`,
            method: "PATCH",
          }
        : {
            url: `${apiUrl}/course`,
            method: "POST",
          };

      // `${apiUrl}/course/update/${existingCourse.id}`: ;
      const response = await fetch(urlApi.url, {
        method: urlApi.method,
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const formDatas = await response.json();
      if (!response.ok) throw new Error(formDatas.message);

      if (response.status === 201) {
        success();
      }
      console.log("form data", data);
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        className="space-y-4 py-6 w-[50%] "
        onSubmit={methods.handleSubmit(submitData)}
      >
        <Input
          name="title"
          id="title"
          type="text"
          label="Title"
          placeholder="Title*"
          defaultValues={existingCourse?.title}
          error={methods.formState.errors.title}
        />
        <Input
          name="courseType"
          id="courseType"
          type="select"
          label="Course Type"
          defaultValues={existingCourse?.courseType}
          options={[
            { value: "", label: "Select The Type" },
            { value: "Pre-Recorded", label: "Pre-Recorded" },
            { value: "Live-Session", label: "Live-Session" },
          ]}
          error={methods.formState.errors.courseType}
        />
        <Input
          name="introduction"
          id="introduction"
          type="textarea"
          label="Introduction"
          placeholder="Introduction*"
          defaultValues={existingCourse?.introduction}
          error={methods.formState.errors.introduction}
        />
        <Input
          name="description"
          id="description"
          type="textarea"
          label="Description"
          placeholder="Description*"
          defaultValues={existingCourse?.description}
          error={methods.formState.errors.description}
        />
        <Input
          name="highlights"
          id="highlights"
          type="array"
          label="Highlights"
          placeholder="Add a highlight and press Enter"
          defaultValues={existingCourse?.highlights}
          error={methods.formState.errors.highlights}
          methods={methods}
        />
        <Input
          name="tags"
          id="tags"
          type="array"
          label="Tags"
          placeholder="Add a tag and press Enter"
          defaultValues={existingCourse?.tags}
          error={methods.formState.errors.tags}
          methods={methods}
        />

        <Input
          name="category"
          id="category"
          type="text"
          label="Category"
          placeholder="Category*"
          defaultValues={existingCourse?.category}
          error={methods.formState.errors.category}
        />
        <Input
          name="duration"
          id="duration"
          type="text"
          label="Duration"
          placeholder="Duration*"
          defaultValues={existingCourse?.duration}
          error={methods.formState.errors.duration}
        />
        <Input
          name="currency"
          id="currency"
          type="text"
          label="Currency"
          placeholder="Currency"
          defaultValues={existingCourse?.currency}
          error={methods.formState.errors.currency}
        />
        <Input
          name="price"
          id="price"
          type="text"
          label="Price"
          placeholder="Price*"
          defaultValues={existingCourse?.price}
          error={methods.formState.errors.price}
        />

        <Input
          name="thumbnail"
          id="thumbnail"
          type="file"
          label="Thumbnail Image"
          defaultValues={existingCourse?.thumbnail}
          error={methods.formState.errors.thumbnail}
          methods={methods}
          accept="image/*"
        />

        {methods.watch("thumbnail") instanceof File ? (
          <img
            src={URL.createObjectURL(methods.watch("thumbnail"))}
            alt="Thumbnail Preview"
            className="w-32 h-32 object-cover mt-2"
          />
        ) : existingCourse?.thumbnailUrl ? (
          <img
            src={existingCourse.thumbnailUrl}
            alt="Existing Thumbnail"
            className="w-32 h-32 object-cover mt-2"
          />
        ) : null}

        <Input
          name="preview"
          id="preview"
          type="file"
          label="Preview"
          defaultValues={existingCourse?.preview}
          error={methods.formState.errors.preview}
          methods={methods}
          accept="video/*"
        />

        {methods.watch("preview") instanceof File ? (
          <video controls className="w-64 h-36 mt-2">
            <source
              src={URL.createObjectURL(methods.watch("preview"))}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : existingCourse?.previewUrl ? (
          <video controls className="w-64 h-36 mt-2">
            <source src={existingCourse?.previewUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null}
        <button
          disabled={loading}
          className="bg-[#00bbab] cursor-pointer hover:bg-[#51ada5f3] w-full font-semibold text-white py-2 px-4 rounded mt-4"
        >
          {existingCourse ? "Update course" : "Create course"}
          {/* {loading ? "Submiting course" : "Create course"} */}
        </button>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </form>
    </FormProvider>
  );
};

export default MyForm;
