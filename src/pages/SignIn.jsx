import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import useFcmToken from "../firebase/firebase";
import { postData } from "../hooks/api";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const { getFcmToken, deviceType } = useFcmToken();
  const { trigger: postFcmToken } = postData(`${apiUrl}/fcm`);

  // 🔁 FCM Callback Function
  const sendFcmToken = async (tokenFromApi) => {
    console.log(tokenFromApi);

    let fcmToken = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (!fcmToken && attempts < maxAttempts) {
      fcmToken = getFcmToken();
      if (fcmToken) break;
      console.log(`Waiting for FCM token... (${attempts + 1}/${maxAttempts})`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }

    if (fcmToken) {
      try {
        console.log("📡 Sending FCM token:", fcmToken, deviceType);

        const response = await fetch(`${apiUrl}/fcm`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenFromApi}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fcmToken, deviceType }),
        });

        const result = await response.json();

        console.log("FCM token result:", result);
        if (result.error === false) {
          toast.success("✅ FCM token sent to server");
          localStorage.setItem(
            "fcmToken",
            JSON.stringify({ fcmToken, deviceType })
          );
        } else {
          throw new Error(result.message || "Unknown error");
        }
      } catch (error) {
        console.error("❌ Failed to post FCM token", error);
        toast.error("Failed to send FCM token");
      }
    } else {
      console.warn("⚠️ FCM token not available after waiting");
    }
  };

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

      // Reject login if role is not allowed
      if (jwtDecode(tokenFromApi).role === "Student") {
        toast.error("No permission");
        return;
      }

      localStorage.setItem("token", tokenFromApi);
      reset();
      setStatus(response.status);

      if (responseData.error === false) {
        toast.success("Logged in successfully ✅");
        await sendFcmToken(tokenFromApi);
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login error", err);
      toast.error(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-300/50 h-screen bg-cover py-10 bg-center">
      <div className="w-[90%] sm:w-[60%] px-2 py-6 sm:px-0 sm:py-0 bg-white mx-auto h-[100%] rounded-md flex flex-col sm:flex-row items-center justify-center">
        <img
          src="sign-in.png"
          alt="signin"
          className="hidden w-[50%] h-full rounded-l-md lg:block"
        />
        <div className="w-full px-4 sm:w-[80%] lg:w-[50%] lg:px-10 lg:py-14">
          <h1 className="text-[28px] font-[600]">Signin</h1>
          <h4 className="text-[#8c8c8c] text-[14px] font-[400]">
            Signin your account to continue
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
                    ? "border-red-500 shadow-md shadow-red-500/50  placeholder:text-red-500"
                    : "border-gray-300 hover:border-[#00bbab] focus:border-[#00bbab]"
                } rounded outline-none placeholder:text-[#969696] placeholder:font-[500] text-[#969696]`}
                placeholder="Email*"
                {...register("email", { required: true })}
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
                    : "border-gray-300 hover:border-[#00bbab] focus:border-[#00bbab]"
                } rounded outline-none placeholder:text-[#969696] placeholder:font-[500] text-[#969696]`}
                placeholder="Password*"
                {...register("password", { required: true })}
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
              <h4 className="text-[#00bbab] hover:underline cursor-pointer">
                Forgot Password
              </h4>
            </div>

            <div className="space-y-5">
              <button
                className="bg-[#00bbab] w-full py-3 text-center cursor-pointer font-[600] text-[16px] text-white hover:bg-[#00a899] rounded-md"
                type="submit"
                disabled={loading}
              >
                {loading ? "SIGNING..." : "SIGN IN"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
