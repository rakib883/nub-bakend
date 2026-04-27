'use client';
import React, { useEffect, useState } from 'react';
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
  FaGraduationCap,
 FaUserCircle,
  FaGear,
  FaShieldHalved,
  FaBlog,
  FaUserPlus
} from "react-icons/fa6";
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const [userEmail, setUserEmail] = useState(""); 
  const [userData, setUserData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  // ১. LocalStorage theke user email ana
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        const email = userObj.user?.email || userObj.email; 
        setUserEmail(email);
      } catch (error) {
        console.error("Parse error", error);
      }
    }
  }, []);

  // ২. Matching User Fetch kora
  useEffect(() => {
    if (!userEmail) return;

    const fetchMatchedUser = async () => {
      try {
        const response = await fetch("/api/all-user");
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const matchedUser = result.data.find((user) => user.email === userEmail);
          if (matchedUser) {
            setUserData(matchedUser);
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedUser();
  }, [userEmail]);

  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      const res = await fetch('/api/log-out', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        toast.success("Successfully Logged Out! 👋", { id: toastId });
        setTimeout(() => {
          router.push('/'); 
          router.refresh(); 
        }, 1200);
      } else {
        toast.error(data.message || "Logout failed!", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: toastId });
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaChartLine />, path: '/dashboard' },
    { name: 'Course', icon: <FaGraduationCap />, path: '/dashboard/course' },
    { name: 'Add Student', icon: <FaUserPlus />, path: '/dashboard/add-student' },
    { name: 'Student History', icon: <FaClockRotateLeft />, path: '/dashboard/student-history' },
    { name: 'employee', icon: <FaChalkboardUser />, path: '/dashboard/employee' },
    { name: 'Add User', icon: <FaCirclePlus />, path: '/dashboard/add-user' },
    { name: 'Add/remove blog', icon: < FaBlog />, path: '/dashboard/add-blog' },
    { name: 'Add/remove notice', icon: <FaUserPlus />, path: '/dashboard/add-notice' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-[#011e40] text-white transition-all duration-300 flex flex-col relative z-20 shadow-2xl`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 bg-[#f1c40f] text-black rounded-full p-1 border-2 border-white shadow-md hover:scale-110 transition active:scale-95 cursor-pointer"
        >
          {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
        </button>

        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="bg-[#f1c40f] min-w-[40px] h-10 rounded-lg text-black font-black flex items-center justify-center text-xl shadow-lg">L</div>
          {!isCollapsed && <h1 className="text-xl font-extrabold tracking-widest uppercase truncate text-white">20 Min school</h1>}
        </div>

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

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-4 p-4 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all group cursor-pointer">
            <FaRightFromBracket className="text-xl group-hover:translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b flex justify-between items-center px-8 shrink-0 shadow-sm relative">
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Pages / <span className="text-gray-800 font-black underline decoration-[#f1c40f] decoration-4">Overview</span>
          </h2>

          <div className="flex items-center gap-4 relative   ">
            <div className="hidden md:block text-right ">
              {/* ✅ userData?.name checking added */}
              <p className="text-sm font-black text-[#011e40]">{userData?.name || "Welcome User"}</p>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest leading-none">Online</p>
            </div>

            {/* Profile Dropdown Logic */}
            <div className="relative left-0 ">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-11 h-11 bg-gray-100 rounded-xl border-2 border-[#f1c40f] flex items-center justify-center overflow-hidden shadow-sm cursor-pointer hover:scale-105 transition"
              >
                {userData?.profilePicture ? (
                  <img src={userData.profilePicture} alt="User" className="w-full h-full object-cover" />
                ) : (
                  < FaUserPlus/>
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div className="  " onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute left-7 mt-3  w-[500px]  rounded-2xl shadow-2xl border border-gray-100 z-20 py-3 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-50 mb-2 ">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Account</p>
                      <p className="text-sm font-black text-[#011e40] truncate">{userData?.email}</p>
                    </div>
                    <div className="px-2 space-y-1">
                      <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#011e40] rounded-xl transition">
                        My Profile
                      </button>
                      <Link href="/dashboard/settings" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#011e40] rounded-xl transition">
                          <FaGear className="text-blue-500" /> Settings
                      </Link>
                    </div>
                    <div className="mt-3 px-2 pt-2 border-t border-gray-50">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-black text-red-500 hover:bg-red-50 hover:rounded-xl transition">
                        <FaRightFromBracket /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-2 md:p-10 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}