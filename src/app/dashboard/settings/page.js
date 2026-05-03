'use client';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaUser, FaEnvelope, FaImage, FaSave, FaGraduationCap, 
  FaBriefcase, FaBookOpen, FaFileLines, FaPenNib 
} from "react-icons/fa6";

export default function ProfileSettings() {
  const [userData, setUserData] = useState({
    name: "",
    profilePicture: "",
    education: "",
    experience: "",
    course: "",
    lastEducation: "",
    summary: ""
  });

  
  const [originalData, setOriginalData] = useState({}); // Database er data track rakhar jonno
  const [loading, setLoading] = useState(true);

  // ১. Database theke data Fetch kora
  useEffect(() => {
    const fetchProfile = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return;
      
      const { email } = JSON.parse(savedUser).user || JSON.parse(savedUser);

      try {
        const res = await fetch("/api/all-user");
        const result = await res.json();
        
        if (result.success) {
          const matched = result.data.find(u => u.email === email);
          if (matched) {
            // Null thakle faka string kore dewa jate input error na hoy
            const formattedData = {
              name: matched.name || "",
              profilePicture: matched.profilePicture || "",
              education: matched.education || "",
              experience: matched.experience || "",
              course: matched.course || "",
              lastEducation: matched.lastEducation || "",
              summary: matched.summary || "",
              email: matched.email // email change hobe na, just tracking er jonno
            };
            setUserData(formattedData);
            setOriginalData(formattedData); // Original data save rakhlam
          }
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ২. Backend-e data pathano
  const handleUpdate = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating your profile...");

    // Logic: User input dile oi data jabe, na dile original data-tai jabe
    const finalData = {
      ...userData,
      name: userData.name || originalData.name,
      profilePicture: userData.profilePicture || originalData.profilePicture,
      education: userData.education || originalData.education,
      experience: userData.experience || originalData.experience,
      course: userData.course || originalData.course,
      lastEducation: userData.lastEducation || originalData.lastEducation,
      summary: userData.summary || originalData.summary,
    };

    try {
      const res = await fetch("/api/profile-update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Profile updated successfully! ✨", { id: toastId });
      } else {
        toast.error(result.message || "Failed to update", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: toastId });
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#011e40] animate-bounce">LOADING PROFILE...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Toaster position="top-center" />
      
      {/* Header Area */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#011e40] uppercase tracking-tight">Profile Settings</h1>
          <p className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-[0.3em]">Complete your professional identity</p>
        </div>
        <button 
          form="profile-form"
          className="bg-[#f1c40f] text-[#011e40] px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
        SAVE PROFILE
        </button>
      </div>

      <form id="profile-form" onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT CARD: User Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm text-center">
            <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-[#f1c40f] mx-auto shadow-2xl relative group">
              {userData.profilePicture ? (
                <img src={userData.profilePicture} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-5xl font-black">?</div>
              )}
            </div>
            <h2 className="mt-6 text-xl font-black text-[#011e40] truncate uppercase">{userData.name || "Guest User"}</h2>
            <p className="text-gray-400 font-bold text-[10px] tracking-widest mt-1 uppercase">{userData.email}</p>
          </div>

          <div className="bg-[#011e40] rounded-[32px] p-6 text-white overflow-hidden relative">
             <div className="absolute -right-4 -bottom-4 opacity-10 text-8xl text-[#f1c40f]"></div>
             <h4 className="text-[#f1c40f] text-[10px] font-black uppercase tracking-[0.2em] mb-4">Account Status</h4>
             <p className="text-2xl font-black text-white capitalize">{userData.email || "Admin"}</p>
          </div>
        </div>

        {/* RIGHT CARD: All Input Fields */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Input Component Helper Logic */}
            {[
              { label: "Display Name", key: "name", icon: <FaUser />, placeholder: "Rakib Hassan" },
              { label: "Profile Picture URL", key: "profilePicture", icon: <FaImage />, placeholder: "https://example.com/photo.jpg" },
              { label: "Current Education", key: "education", icon: <FaGraduationCap />, placeholder: "BSc in EEE" },
              { label: "Last Education", key: "lastEducation", icon: <FaBookOpen />, placeholder: "HSC / Diploma" },
              { label: "Course Name", key: "course", icon: <FaFileLines />, placeholder: "Web Development" },
              { label: "Total Experience", key: "experience", icon: <FaBriefcase />, placeholder: "2 Years" },
            ].map((item) => (
              <div key={item.key} className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{item.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f1c40f] text-sm">{item.icon}</span>
                  <input 
                    type="text"
                    value={userData[item.key]}
                    placeholder={item.placeholder}
                    onChange={(e) => setUserData({...userData, [item.key]: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#f1c40f] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#011e40]"
                  />
                </div>
              </div>
            ))}

            {/* Summary (Full Width) */}
            <div className="md:col-span-2 space-y-2 pt-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profile Summary</label>
              <div className="relative">
                <span className="absolute left-4 top-6 text-[#f1c40f]"><FaPenNib /></span>
                <textarea 
                  rows="4"
                  value={userData.summary}
                  placeholder="Describe your skills and professional goals..."
                  onChange={(e) => setUserData({...userData, summary: e.target.value})}
                  className="w-full pl-12 pr-5 py-5 bg-gray-50 border-2 border-transparent focus:border-[#f1c40f] focus:bg-white rounded-[32px] outline-none transition-all font-bold text-[#011e40] resize-none"
                ></textarea>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}