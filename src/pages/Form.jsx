import { z } from "zod";
import Input from "../components/Input";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RichTextEditor from "./../components/RichTextEditor";

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
  preview: z.instanceof(File, { message: "Preview is required" }),
});
const MyForm = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
  });

  const submitData = (data) => {
    console.log("form data", data);
  };
  return (
    <FormProvider {...methods}>
      <form
        className="space-y-4 py-6 w-[50%]"
        onSubmit={methods.handleSubmit(submitData)}
      >
        {/* <Input
          name="title"
          id="title"
          type="text"
          label="Title"
          placeholder="Title*"
          validationSchema={{ required: "Email is required" }}
          error={methods.formState.errors.title}
        />
        <Input
          name="courseType"
          id="CourseType"
          type="text"
          label="Course Type"
          placeholder="Course type*"
          validationSchema={{ required: "Email is required" }}
          error={methods.formState.errors.email}
        /> */}
        <Input
          name="title"
          id="title"
          type="text"
          label="Title"
          placeholder="Title*"
          validationSchema={{ required: "Title is required" }}
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
          validationSchema={{ required: "Course Type is required" }}
          error={methods.formState.errors.courseType}
        />
        <Input
          name="introduction"
          id="introduction"
          type="textarea"
          label="Introduction"
          placeholder="Introduction*"
          validationSchema={{ required: "Introduction is required" }}
          error={methods.formState.errors.introduction}
        />
        <Input
          name="description"
          id="description"
          type="textarea"
          label="Description"
          placeholder="Description*"
          validationSchema={{ required: "Description is required" }}
          error={methods.formState.errors.description}
        />
        <Input
          name="category"
          id="category"
          type="text"
          label="Category"
          placeholder="Category*"
          validationSchema={{ required: "Category is required" }}
          error={methods.formState.errors.category}
        />
        <Input
          name="duration"
          id="duration"
          type="text"
          label="Duration"
          placeholder="Duration*"
          validationSchema={{ required: "Duration is required" }}
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
          validationSchema={{ required: "Price is required" }}
          error={methods.formState.errors.price}
        />
        <Input
          name="thumbnail"
          id="thumbnail"
          type="file"
          label="Thumbnail Image"
          error={methods.formState.errors.thumbnail}
          methods={methods}
        />

        <Input
          name="preview"
          id="preview"
          type="file"
          label="Preview"
          error={methods.formState.errors.preview}
          methods={methods}
        />
        <button className="bg-[#00bbab] text-white py-2 px-4 rounded mt-4">
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

export default MyForm;
