'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast'; 
import { 
  FaChartLine, 
  FaUserPlus, 
  FaClockRotateLeft, 
  FaChalkboardUser, 
  FaRightFromBracket, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCirclePlus,
  FaGraduationCap
} from "react-icons/fa6";

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    // ১. Loading toast shuru koro ebong ekta ID variable-e rakho
    const toastId = toast.loading("Logging out...");

    try {
      const res = await fetch('/api/log-out', {
        method: 'POST', 
      });

      const data = await res.json();

      if (data.success) {
        // ২. Loading toast-ta ke Success-e convert koro
        toast.success("Successfully Logged Out! 👋", { id: toastId });

        // ৩. ১ সেকেন্ড সময় দাও যাতে টোস্ট দেখা যায়, তারপর লগইন পেজে পাঠাও
        setTimeout(() => {
          router.push('/'); 
          router.refresh(); 
        }, 1200);

      } else {
        toast.error(data.message || "Logout failed!", { id: toastId });
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Something went wrong!", { id: toastId });
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaChartLine />, path: '/dashboard' },
    { name: 'Course', icon: <FaGraduationCap />, path: '/dashboard/course' },
    { name: 'Add Student', icon: <FaUserPlus />, path: '/dashboard/add-student' },
    { name: 'Student History', icon: <FaClockRotateLeft />, path: '/dashboard/history' },
    { name: 'Instructors', icon: <FaChalkboardUser />, path: '/dashboard/instructors' },
    { name: 'Add User', icon: <FaCirclePlus />, path: '/dashboard/add-user' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Toaster Container - Eta thaklei Toast dekhabe */}
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-[#011e40] text-white transition-all duration-300 flex flex-col relative z-20 shadow-2xl`}>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 bg-[#f1c40f] text-black rounded-full p-1 border-2 border-white shadow-md hover:scale-110 transition active:scale-95 cursor-pointer"
        >
          {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
        </button>

        {/* Logo Section */}
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="bg-[#f1c40f] min-w-[40px] h-10 rounded-lg text-black font-black flex items-center justify-center text-xl shadow-lg">L</div>
          {!isCollapsed && <h1 className="text-xl font-extrabold tracking-widest uppercase truncate text-white">Lerapress</h1>}
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <div 
                key={index} 
                onClick={() => router.push(item.path)}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all group ${
                  isActive ? 'bg-[#f1c40f] text-black shadow-lg' : 'hover:bg-white/10 text-white'
                }`}
              >
                <span className={`text-xl ${isActive ? 'text-black' : 'text-[#f1c40f]'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="font-bold text-sm tracking-wide">{item.name}</span>}
              </div>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-4 p-4 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all group cursor-pointer"
          >
            <FaRightFromBracket className="text-xl group-hover:translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b flex justify-between items-center px-8 shrink-0 shadow-sm">
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Pages / <span className="text-gray-800 font-black underline decoration-[#f1c40f] decoration-4">Overview</span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-black text-[#011e40]">Admin Bhai</p>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest leading-none">Online</p>
            </div>
            <div className="w-11 h-11 bg-gray-100 rounded-xl border-2 border-[#f1c40f] flex items-center justify-center font-black text-[#011e40] shadow-sm">
              A
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-2 md:p-10 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}