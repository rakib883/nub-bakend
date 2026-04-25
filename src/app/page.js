"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserShield, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa6";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
      } else {
        setError("");
        // ✅ STEP 1: Server theke asha user data store kora
        localStorage.setItem("user", JSON.stringify(data)); 
        
        router.push("/dashboard"); 
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#011e40] px-4 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="text-center mb-10">
          <div className="bg-[#f1c40f] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUserShield className="text-[#011e40] text-3xl" />
          </div>
          <h2 className="text-3xl font-black text-[#011e40]">Admin Login</h2>
          {error && <p className="text-red-500 mt-2 text-sm font-bold bg-red-50 p-2 rounded-lg">{error}</p>}
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><FaEnvelope /></span>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#f1c40f]" 
              placeholder="Email" required
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><FaLock /></span>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#f1c40f]" 
              placeholder="Password" required
            />
          </div>
          <button type="submit" className="w-full bg-[#f1c40f] py-4 rounded-2xl font-black text-[#011e40] flex items-center justify-center gap-3">
            SIGN IN NOW <FaArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
}