'use client';
import React, { useState } from 'react'; // state management-er jonno useState add kora hoyeche
import { useRouter } from 'next/navigation';
import { FaUserShield, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa6";


export default function LoginPage() {
 
  const router = useRouter();

  // Input data dhorar jonno states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    console.log(data);

    if (!data.success) {
      setError(data.message);
    } else {
      setError("");
      router.push("/dashboard"); // login success hole redirect
    }
  } catch (err) {
    console.log(err);
    setError("Something went wrong");
  }
};

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#011e40] px-4 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden">
        
        {/* Design Element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f1c40f] rounded-full opacity-20"></div>

        <div className="text-center mb-10 relative">
          <div className="bg-[#f1c40f] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
            <FaUserShield className="text-[#011e40] text-3xl" />
          </div>
          <h2 className="text-3xl font-black text-[#011e40] tracking-tight">Admin Login</h2>
          
          {/* Error Message UI */}
          {error && <p className="text-red-500 mt-2 text-sm font-bold bg-red-50 p-2 rounded-lg">{error}</p>}
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <FaEnvelope />
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Email store kora
                placeholder="admin@gmail.com" 
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#f1c40f] focus:bg-white transition-all duration-300" 
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <FaLock />
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Password store kora
                placeholder="••••••••" 
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#f1c40f] focus:bg-white transition-all duration-300" 
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            className="w-full bg-[#f1c40f] py-4 rounded-2xl font-black text-[#011e40] shadow-[0_10px_20px_rgba(241,196,15,0.3)] hover:shadow-none hover:bg-[#d4ac0d] flex items-center justify-center gap-3 group transition-all duration-300 active:scale-95"
          >
            SIGN IN NOW
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-400">
          Don't have an account? <span className="text-[#011e40] font-bold cursor-pointer hover:underline">Contact SuperAdmin</span>
        </p>
      </div>
    </div>
  );
}