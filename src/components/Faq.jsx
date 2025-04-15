import { object, z } from "zod";
import Input from "../components/Input";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const schema = z.object({
  subject: z
    .string()
    .min(10, { message: "subject must contain at least 10 character(s)" }),
  question: z.string().nonempty({ message: "Course type is required" }),
  answer: z
    .string()
    .min(20, { message: "answer must contain at least 20 character(s)" }),
});

const Faq = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await fetch(`${apiUrl}/faq`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to create FAQ");

        const faqData = await response.json();
        setData(faqData.value);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFaqData();
  }, [data]);

  const submitData = async (data) => {
    setLoading(true);
    console.log(data);

    try {
      const response = await fetch(`${apiUrl}/faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create FAQ");

      const newFaq = await response.json();
      setData((prev) => [newFaq, ...prev]);
      toast.success("successfully faq created");
      methods.reset();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="">
      <h1 className="font-semibold text-5xl mt-10 mb-4">Add New FAQ</h1>
      <FormProvider {...methods}>
        <form
          className="space-y-4 py-6 w-[50%] "
          onSubmit={methods.handleSubmit(submitData)}
        >
          <Input
            name="subject"
            id="subject"
            type="text"
            label="Subject"
            placeholder="subject*"
            error={methods.formState.errors.subject}
          />
          <Input
            name="question"
            id="question"
            type="text"
            label="Question"
            placeholder="question*"
            error={methods.formState.errors.question}
          />
          <Input
            name="answer"
            id="answer"
            type="textarea"
            label="Answer"
            placeholder="answer*"
            error={methods.formState.errors.answer}
          />
          <button
            disabled={loading}
            className="bg-[#00bbab] cursor-pointer hover:bg-[#51ada5f3] w-full font-semibold text-white py-4 px-4 rounded mt-4"
          >
            {loading ? "Adding FAQ" : "Add FAQ"}
          </button>
        </form>
      </FormProvider>

      {data?.map((item, index) => {
        return (
          <div className="bg-white/10 backdrop-blur-md border border-white/30 shadow-lg rounded-xl px-10 py-6 w-[50%] mb-4">
            <div className="text-white flex flex-col space-y-4" key={index}>
              <h1 className="font-semibold text-3xl">{item.subject}</h1>
              <div className="flex flex-col text-xl space-y-2 text-white/90">
                <span>Q : {item.question}</span>
                <span>A : {item.answer}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    // </div>
  );
};

export default Faq;
