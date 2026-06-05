"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSpring, animated } from "@react-spring/web";
import { toast, Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Initialize react-hook-form fields for client-side evaluation error messages
  const {
    register,
    formState: { errors },
  } = useForm();

  // Smooth entrance animation matching design spec
  const cardSpring = useSpring({
    from: { opacity: 0, transform: "scale(0.95) translateY(20px)" },
    to: { opacity: 1, transform: "scale(1) translateY(0px)" },
    config: { tension: 300, friction: 20 },
  });

  // Updated Login Handler (No try-catch blocks)
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
      rememberMe: true,
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message || "Invalid email or password");
      setLoading(false);
      return;
    }

    if (data) {
      toast.success("Welcome back!");
      router.push("/");
    }

    setLoading(false);
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
      <Toaster position="top-center" />

      <animated.div
        style={cardSpring}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sm:p-12 border border-gray-100/50"
      >
        {/* Logo Header Block */}
        <div className="mb-8">
          <h1 className="text-3xl font-black italic text-gray-950 tracking-tight uppercase">
            DRIVEFLEET
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            Sign in to your account
          </p>
        </div>

        {/* Input Credential Grouping Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full px-6 py-3.5 bg-white border ${errors.email ? "border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:ring-blue-500/20"} rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs text-left px-4 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-6 py-3.5 bg-white border ${errors.password ? "border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:ring-blue-500/20"} rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs text-left px-4 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Core Action Button with explicit submit token type */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition text-sm tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Decorative Divider */}
        <div className="my-6 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            OR USE SOCIAL
          </span>
        </div>

        {/* Google Social Trigger Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:scale-[0.99] text-gray-700 font-semibold py-3.5 px-6 border border-gray-200 rounded-full shadow-xs transition text-sm disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"
            />
            <path
              fill="#FBBC05"
              d="M16.04 15.345c-1.012.727-2.4 1.164-4.04 1.164a7.077 7.077 0 01-6.734-4.855L1.24 14.77A11.934 11.934 0 0012 24c3.055 0 5.89-.982 8.073-2.69l-4.033-5.965z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.275c0-.818-.073-1.609-.208-2.373H12v4.51h6.464a5.53 5.53 0 01-2.4 3.627l4.033 5.965c2.364-2.173 3.393-5.382 3.393-8.995z"
            />
            <path
              fill="#34A853"
              d="M5.266 14.235L1.24 11.12a7.042 7.042 0 010-4.47L5.266 9.765a7.014 7.014 0 010 4.47z"
            />
          </svg>
          Google Login
        </button>

        {/* Bottom Switch Link Node */}
        <p className="mt-8 text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-gray-950 hover:text-blue-600 transition ml-0.5"
          >
            Register
          </Link>
        </p>
      </animated.div>
    </div>
  );
};

export default LoginPage;
