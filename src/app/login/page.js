'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserShield, FaLock, FaEnvelope, FaArrowRightToBracket } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Verifying credentials...");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Login Successful! 🚀", { id: loadingToast });
        router.push('/dashboard'); // Dashboard-e niye jabe
      } else {
        toast.error(data.message || "Login failed! ❌", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network error! Try again.", { id: loadingToast });
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#011e40] px-4 font-sans">
      <Toaster position="top-center" />
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border-t-8 border-[#f1c40f]">
        
        <div className="text-center mb-10">
          <div className="bg-[#f1c40f]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#f1c40f]">
            <FaUserShield className="text-[#011e40] text-4xl" />
          </div>
          <h2 className="text-3xl font-black text-[#011e40]">Admin Login</h2>
          <p className="text-gray-400 text-sm mt-1 font-medium">Lerapress Management System</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1 text-black">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#f1c40f] focus:bg-white transition-all text-black" 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1 text-black">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#f1c40f] focus:bg-white transition-all text-black" 
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#f1c40f] py-4 rounded-2xl font-black text-[#011e40] shadow-lg hover:bg-[#d4ac0d] flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
          >
            SIGN IN <FaArrowRightToBracket />
          </button>
        </form>
      </div>
    </div>
  );
}