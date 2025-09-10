"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // ✅ ye decide karega login dikhana hai ya loader

  const router = useRouter();

  // ✅ Check auth only after client mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      router.replace("/dashboard");
    } else {
      setAuthChecked(true); // ab login form dikhao
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

   try {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`, // ✅ env se URL
    { email, password }
  );

      if (res.data?.token) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setSuccess("Login successful!");
        setLoading(false);
        router.replace("/dashboard");
      } else {
        setError("Invalid response from server.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      setLoading(false);
    }
  };

  // ✅ Loader until we decide whether to show login or redirect
  if (!authChecked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <style>{`
          @keyframes loader-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
          }
        `}</style>
        <div className="relative flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full border-8 border-t-[#1a50b6] border-b-[#2557d5] border-l-[#1a50b6] border-r-[#2557d5] animate-spin shadow-2xl"
            style={{
              boxShadow: "0 0 40px 10px #1a50b6, 0 0 80px 20px #2557d5 inset"
            }}
          ></div>
          <div
            className="absolute left-1/2 top-1/2 w-6 h-6 bg-[#1a50b6] rounded-full shadow-lg"
            style={{
              transform: "translate(-50%, -50%)",
              animation: "loader-bounce 1s infinite"
            }}
          ></div>
        </div>
        <div className="mt-6 text-[#1a50b6] text-lg font-semibold tracking-wide animate-pulse">Loading...</div>
      </div>
    );
  }

  // ✅ Show login form only after authChecked = true
  return (
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
              id="email"
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
              id="password"
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
            className="w-full h-[45px] bg-[#043287] rounded-[40px] text-white font-semibold transition-all duration-300 hover:bg-[#2557d5]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {success && (
          <div className="text-green-700 bg-green-100 border border-green-300 rounded-md mt-4 p-3">
            ✅ {success}
          </div>
        )}

        {error && (
          <div className="text-red-700 bg-red-100 border border-red-300 rounded-md mt-4 p-3">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
