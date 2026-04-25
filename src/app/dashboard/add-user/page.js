"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast"; // Notification-er jonno install koro

const Page = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "admin", // 👈 "Admin" theke "admin" kora holo (Mongoose enum match korte)
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Loading state start
    const loadingToast = toast.loading("Creating user...");

    try {
      const res = await fetch("/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("User create successfully", { id: loadingToast });
        // Form reset kora (Optional)
        setForm({ email: "", password: "", role: "admin" });
      } else {
        toast.error(data.message || "Failed to create user ❌", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: loadingToast });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB] p-4">
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          >
            {/* Sob value lowercase kora standard practice, backend er sathe mil rekhe */}
            <option value="admin">Admin</option>
            <option value="mgmt">MGMT</option>
            <option value="accounts">Accounts</option>
            <option value="hr">HR</option>
            <option value="instructor">Instructor</option>
          </select>

          <button
            type="submit"
            className="w-full cursor-pointer py-3 rounded-xl text-white font-semibold 
            bg-gradient-to-r from-blue-500 to-blue-600 
            hover:from-blue-600 hover:to-blue-700 
            transition-all shadow-md"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;