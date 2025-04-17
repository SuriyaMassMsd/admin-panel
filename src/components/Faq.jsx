import { object, z } from "zod";
import Input from "../components/Input";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomAccordion from "./FaqAccordian";
import { getUserValue } from "./UserType";

const schema = z.object({
  subject: z.string().nonempty({ message: "subject is required" }),
  question: z.string().nonempty({ message: "question is required" }),
  answer: z.string().nonempty({ message: "answer is required" }),
});

const Faq = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const userType = getUserValue();

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

  useEffect(() => {
    fetchFaqData();
  }, []);

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
      setData((prev) => [newFaq.value, ...prev]);
      toast.success("successfully faq created");
      methods.reset();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      {userType.role === "Admin" ? (
        <div className="w-[60%] border border-gray-800 shadow-2xl px-20 py-4 mt-10 mb-10">
          <h1 className="font-semibold text-3xl mt-10 mb-4">Add New FAQ</h1>
          <FormProvider {...methods}>
            <form
              className="space-y-4 w-full  mb-10"
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
        </div>
      ) : (
        ""
      )}
      {data?.map((item, index) => {
        return (
          <CustomAccordion
            key={item.faqId || index}
            // subject={item.subject}
            question={item.question}
            answer={item.answer}
          />
        );
      })}
    </div>
    // </div>
  );
};

export default Faq;
