'use client';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaTrashCan, FaUserTie, FaMagnifyingGlass } from "react-icons/fa6";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // ডাটা লোড করার ফাংশন
  const fetchData = async () => {
    try {
      const res = await fetch("/api/all-user");
      const result = await res.json();
      
      if (result.success) {
        setEmployees(result.data);

        // লোকাল স্টোরেজ থেকে লগইন করা ইউজার বের করা
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userObj = JSON.parse(savedUser);
          const email = userObj.user?.email || userObj.email;
          
          // ডাটাবেস থেকে বর্তমানে লগইন করা ইউজারের রোল খুঁজে বের করা
          const matched = result.data.find(u => u.email === email);
          if (matched) {
            setCurrentUser(matched);
          }
        }
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🛡️ রোল চেক লজিক (Admin অথবা Mgmt হতে হবে)
  const userRole = currentUser?.role?.toLowerCase();
  const canDelete = userRole === 'admin' || userRole === 'mgmt';

  // ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    // ১. ফ্রন্টএন্ডে পারমিশন চেক (সবচেয়ে গুরুত্বপূর্ণ)
    if (!canDelete) {
      toast.error("Access Denied! You are not authorized to delete.");
      return;
    }

    if (!confirm("Are you sure you want to delete this employee?")) return;
    
    const toastId = toast.loading("Deleting member...");
    try {
      // ব্যাকএন্ডে কুয়েরি প্যারামিটার হিসেবে আইডি পাঠানো (?id=...)
      const res = await fetch(`/api/delete-user/${id}`, { 
        method: 'DELETE' 
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Member removed successfully!", { id: toastId });
        // ডিলিট করার পর সাথে সাথে লিস্ট থেকে সরিয়ে ফেলা
        setEmployees(prev => prev.filter(emp => emp._id !== id));
      } else {
        toast.error(data.message || "Failed to delete", { id: toastId });
      }
    } catch (error) {
      toast.error("Error connecting to server", { id: toastId });
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#011e40] animate-pulse uppercase tracking-widest">Loading Directory...</div>;

  return (
    <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen">
      <Toaster position="top-center" />
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#011e40] tracking-tight">Employee Directory</h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Active Members: {employees.length} | Your Role: <span className="text-blue-600 uppercase">{currentUser?.role || "Visitor"}</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-[20px] outline-none font-bold text-sm shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase">Employee Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase">Official Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase">Background</th>
                {/* 🔒 যদি Admin বা Mgmt হয় তবেই Actions কলাম দেখা যাবে */}
                {canDelete && <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                        {emp.profilePicture ? (
                          <img src={emp.profilePicture} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><FaUserTie size={18} /></div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-[#011e40] text-[14px]">{emp.name || "N/A Member"}</p>
                        <p className="text-[11px] text-gray-400 font-bold">{emp.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border ${
                      emp.role?.toLowerCase() === 'admin' ? 'bg-red-50 text-red-500 border-red-100' : 
                      emp.role?.toLowerCase() === 'instructor' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                      emp.role?.toLowerCase() === 'mgmt' ? 'bg-purple-50 text-purple-500 border-purple-100' :
                      'bg-emerald-50 text-emerald-500 border-emerald-100'
                    }`}>
                      {emp.role}
                    </span>
                  </td>

                  <td className="px-8 py-5">
                     <p className="text-[11px] font-black text-gray-600">{emp.lastEducation || "No Degree"}</p>
                  </td>

                  {/* 🔒 ডিলিট বাটন শর্তসাপেক্ষে দেখানো হচ্ছে */}
                  {canDelete && (
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(emp._id)}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-[15px] transition-all"
                      >
                        <FaTrashCan size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}