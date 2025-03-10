import { z } from "zod";
import Input from "../components/Input";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RichTextEditor from "./../components/RichTextEditor";

const schema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  bio: z.string().min(15).max(50, "Bio must be less than 200 characters"),
  gender: z.string().nonempty("Gender is required"),
  text: z.string().min(10, "min 10 letters requirded"),
  check: z.any("checkbox is required"),
});

const MyForm = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
  });

  const data = (data) => {
    console.log(data);
  };
  return (
    <FormProvider {...methods}>
      <form
        className="space-y-4 w-[50%] mx-auto py-4"
        onSubmit={methods.handleSubmit(data)}
      >
        <Input
          name="email"
          type="email"
          placeholder="Email*"
          validationSchema={{ required: "Email is required" }}
          error={methods.formState.errors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password*"
          validationSchema={{ required: "Password is required" }}
          error={methods.formState.errors.password}
        />
        <Input
          name="bio"
          type="textarea"
          placeholder="Your Bio"
          validationSchema={{ required: "Bio is required" }}
          error={methods.formState.errors.bio}
        />
        <Input
          name="gender"
          type="select"
          placeholder="Select Gender"
          options={[
            { label: "Select One", value: "" },
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ]}
          validationSchema={{ required: "Gender is required" }}
          error={methods.formState.errors.gender}
        />
        <Input
          name="text"
          error={methods.formState.errors.text}
          type="text"
          placeholder="text"
          validationSchema={{ required: "text is required" }}
        />
        <Input
          name="check"
          data={["apple", "mango", "orange"]}
          error={methods.formState.errors.check}
          type="checkbox"
          placeholder=""
        />
        <RichTextEditor />
        <button
          type="submit"
          className="bg-[#00bbab] text-white py-2 px-4 rounded mt-4"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

export default MyForm;
