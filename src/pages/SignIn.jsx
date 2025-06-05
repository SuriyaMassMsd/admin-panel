import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Skeleton/Loader";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const Schema = z.object({
    email: z.string().email("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({ resolver: zodResolver(Schema) });

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const submitForm = async (data) => {
    const { email, password } = data;
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.message);

      const tokenFromApi = responseData?.value?.token;
      if (!tokenFromApi) {
        toast.error("Authentication failed. Please try again.");
        return;
      }

      if (jwtDecode(tokenFromApi).role === "Student") {
        toast.error("No permission");
        return;
      }

      localStorage.setItem("token", tokenFromApi);
      reset();

      if (responseData.error === false) {
        toast.success("Logged in successfully ✅");
        navigate("/", {
          replace: true,
          state: { askFcm: true, token: tokenFromApi },
        });
      }
    } catch (err) {
      console.error("Login error", err);
      toast.error(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white h-screen bg-cover py-10 bg-center">
      <div
        id="shadow"
        className="w-[90%] sm:w-[60%] px-2 py-6 sm:px-0 sm:py-0 bg-white mx-auto h-[100%] rounded-md flex flex-col sm:flex-row items-center justify-center"
      >
        <img
          src="sign-in.png"
          alt="signin"
          className="hidden w-[50%] h-full rounded-l-md lg:block"
        />
        <div className="w-full px-4 sm:w-[80%] lg:w-[50%] lg:px-10 lg:py-14">
          <img
            src="https://gravitus.io/static/media/gravituslogo.d101ec067ab314ba6c5f8c14bfc019c6.svg"
            alt="logo"
            className="-mt-10  w-[200px] h-auto py-8"
          />
          <h1 className="text-[28px] font-[600] text-black">Signin</h1>
          <h4 className="text-[#8c8c8c] text-[14px] font-[400]">
            Signin to your account to continue
          </h4>

          <form
            className="space-y-10 sm:space-y-14 mt-10"
            onSubmit={handleSubmit(submitForm)}
          >
            <div>
              <input
                type="text"
                className={`px-[10px] w-full py-[10px] border ${
                  errors.email
                    ? "border-red-500 shadow-md shadow-red-500/50 placeholder:text-red-500"
                    : "border-gray-300 hover:border-[#00bbab] focus:border-[#00bbab]"
                } rounded outline-none placeholder:text-[#969696] text-[#969696]`}
                placeholder="Email*"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                className={`px-[10px] w-full py-[10px] border ${
                  errors.password
                    ? "border-red-500 shadow-md shadow-red-500/50 placeholder:text-red-500"
                    : "border-gray-300 hover:border-[#00bbab] focus:border-[#00bbab]"
                } rounded outline-none placeholder:text-[#969696] text-[#969696]`}
                placeholder="Password*"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="text-[14px] flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" id="keepsign" />
                <label htmlFor="keepsign" className="cursor-pointer">
                  Keep me signed in
                </label>
              </div>
              <h4 className="text-[#00bbab] hover:underline cursor-pointer">
                Forgot Password
              </h4>
            </div>

            <div className="space-y-5">
              <button
                className="bg-[#00bbab] w-full py-3 text-center font-[600] text-[16px] text-white hover:bg-[#00a899] rounded-md"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="mx-auto">
                    <Loader />
                  </div>
                ) : (
                  "SIGN IN"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
