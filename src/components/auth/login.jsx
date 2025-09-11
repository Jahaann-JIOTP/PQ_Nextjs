"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.replace("/dashboard");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );

      if (res.data?.token) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Login successful!");

        setTimeout(() => {
          router.replace("/dashboard");
        }, 1800);
      } else {
        toast.error("Invalid response from server.");
        setLoading(false); 
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/pq_meter.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-[420px] border border-white/30 backdrop-blur-[15px] shadow text-black p-[30px] px-[40px] rounded-[20px]">
          <div className="flex justify-center mb-6">
            <img src="/assets/jahaannlogo.png" alt="Logo" className="w-[230px]" />
          </div>
          <h2 className="text-3xl font-semibold text-center text-white mb-4">
            Login
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                className="w-full px-4 py-3 border bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#1a50b6]"
                placeholder="Enter Email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ border: "2px solid rgba(0, 0, 0, 0.1)" }}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="w-full px-4 py-3 border bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#1a50b6]"
                placeholder="Enter Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ border: "2px solid rgba(0, 0, 0, 0.1)" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 w-full h-[45px] rounded-[40px] text-white font-semibold transition-all duration-300 cursor-pointer
                ${loading ? "bg-[#2557d5] opacity-80 cursor-not-allowed" : "bg-[#043287] hover:bg-[#2557d5]"}`}
            >
              {loading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
