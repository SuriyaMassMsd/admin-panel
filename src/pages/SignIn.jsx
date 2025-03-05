import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { redirect, useNavigate } from "react-router-dom";
import { z } from "zod";
import App from "../App";

const SignIn = () => {
  const Schema = z.object({
    email: z.string().email("Email is required"),
    password: z.string({ required_error: "Password is required" }).min(6),
  });

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({ resolver: zodResolver(Schema) });

  const navigate = useNavigate();

  const submitForm = async (data) => {
    const { email, password } = data;

    try {
      const response = await fetch(
        "https://lms-masterv3.onrender.com/auth/signIn",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.value.token);
      alert("Sign in successful!");
      reset();
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-[url(/public/bg-img.png)] h-screen bg-cover py-10 bg-center">
      <div className="w-[60%] bg-white mx-auto h-[100%] rounded-md flex">
        <img
          src="sign-in.png"
          alt="signin"
          className="w-[50%] h-full rounded-l-md"
        />
        <div className="w-[50%] px-10 py-6">
          <h1 className="text-[28px] font-[600]">Signin</h1>
          <h4 className="text-[#8c8c8c] text-[14px] font-[400]">
            Signin your account to continue
          </h4>

          <form
            className="space-y-10 mt-10"
            onSubmit={handleSubmit(submitForm)}
          >
            <div>
              <input
                type="text"
                className={`px-[10px] w-full py-[10px] border ${
                  errors.email
                    ? "border-red-500 shadow-md shadow-red-500/50  placeholder:text-red-500"
                    : "border-gray-300 hover:border-[#00bbab] focus:border-[#00bbab] "
                }  rounded outline-none 
               placeholder:text-[#969696] placeholder:font-[500] text-[#969696]`}
                placeholder="Email*"
                {...register("email", {
                  required: true,
                })}
              />
              {errors.email && (
                <p className="font-headerFont text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                className={`px-[10px] w-full py-[10px] border ${
                  errors.password
                    ? "border-red-500 shadow-md shadow-red-500/50 placeholder:text-red-500"
                    : "border-gray-300 hover:border-[#00bbab] focus:border-[#00bbab] "
                }  rounded outline-none 
               placeholder:text-[#969696] placeholder:font-[500] text-[#969696]`}
                placeholder="Password*"
                {...register("password", {
                  required: true,
                })}
              />
              {errors.password && (
                <p className="font-headerFont text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-[14px] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="keepsign" />
                <label htmlFor="keepsign" className="cursor-pointer">
                  Keep me sign in
                </label>
              </div>

              <h4
                className="text-[#00bbab]
              
              hover:underline underline-[#00bbab] cursor-pointer"
              >
                Forgot Password
              </h4>
            </div>
            <div className="space-y-5">
              <button
                className="bg-[#00bbab] w-full py-3 text-center cursor-pointer font-[600] text-[16px] text-white
                hover:bg-[#00a899]
                rounded-md
                "
                type="submit"
              >
                SIGN IN
              </button>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[1px]  bg-gray-300"></div>
                <span className="text-gray-300 ">or</span>
                <div className="flex-1 h-[1px]  bg-gray-300"></div>
              </div>
              <button
                className="bg-white w-full py-3 text-center cursor-pointer font-[600] text-[16px] text-[#959595]
                hover:bg-[#fafafa]
                rounded-md
                border border-[#e1e1e1] 
                "
                type="submit"
              >
                REGISTER
              </button>
            </div>
          </form>

          <div></div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
