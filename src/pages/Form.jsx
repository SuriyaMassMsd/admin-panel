import { z } from "zod";
import Input from "../components/Input";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RichTextEditor from "./../components/RichTextEditor";
import { useState } from "react";
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
  thumbnail: z.instanceof(File, { message: "Thumbnail is required" }),
  preview: z
    .union([
      z.instanceof(File),
      z.object({
        file: z.instanceof(File),
        duration: z.number().optional(),
      }),
    ])
    .refine((value) => !!value, { message: "Video is required" }),
  // preview: z.instanceof(File, { message: "Preview is required" }),
});
const MyForm = () => {
  const [loading, setLoading] = useState(false);
  const methods = useForm({
    resolver: zodResolver(schema),
  });

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

    const apiUrl = import.meta.env.VITE_BASE_URL;
    try {
      const response = await fetch(`${apiUrl}/course`, {
        method: "POST",
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
          error={methods.formState.errors.title}
        />
        <Input
          name="courseType"
          id="courseType"
          type="select"
          label="Course Type"
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
          error={methods.formState.errors.introduction}
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
          name="highlights"
          id="highlights"
          type="array"
          label="Highlights"
          placeholder="Add a highlight and press Enter"
          error={methods.formState.errors.highlights}
          methods={methods}
        />
        <Input
          name="tags"
          id="tags"
          type="array"
          label="Tags"
          placeholder="Add a tag and press Enter"
          error={methods.formState.errors.tags}
          methods={methods}
        />

        <Input
          name="category"
          id="category"
          type="text"
          label="Category"
          placeholder="Category*"
          error={methods.formState.errors.category}
        />
        <Input
          name="duration"
          id="duration"
          type="text"
          label="Duration"
          placeholder="Duration*"
          error={methods.formState.errors.duration}
        />
        <Input
          name="currency"
          id="currency"
          type="text"
          label="Currency"
          placeholder="Currency"
          error={methods.formState.errors.currency}
        />
        <Input
          name="price"
          id="price"
          type="text"
          label="Price"
          placeholder="Price*"
          error={methods.formState.errors.price}
        />

        <Input
          name="thumbnail"
          id="thumbnail"
          type="file"
          label="Thumbnail Image"
          error={methods.formState.errors.thumbnail}
          methods={methods}
          accept="image/*"
        />

        <Input
          name="preview"
          id="preview"
          type="file"
          label="Preview"
          error={methods.formState.errors.preview}
          methods={methods}
          accept="video/*"
        />
        <button
          disabled={loading}
          className="bg-[#00bbab] cursor-pointer hover:bg-[#51ada5f3] w-full font-semibold text-white py-2 px-4 rounded mt-4"
        >
          {loading ? "Submiting course" : "Create course"}
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
