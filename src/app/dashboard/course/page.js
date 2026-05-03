'use client';
import React, { useState, useEffect } from 'react';
import { 
  FaBook, FaCirclePlus, FaPenToSquare, FaXmark, FaImage, FaFileLines, FaLink, FaUserTie, FaUsers, FaClock, FaTag
} from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    courseName: '', price: '', description: '', instructorName: '',
    duration: '3 Months', status: 'Upcoming', seats: '',
    instructorPicLink: '', thumbnailLink: '', upcomingDate: ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // --- 1. Get User info ---
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

  // --- 2. Check User Role ---
  useEffect(() => {
    if (!userEmail) return;
    const fetchMatchedUser = async () => {
      try {
        const response = await fetch("/api/all-user");
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const matchedUser = result.data.find((user) => user.email === userEmail);
          if (matchedUser) setUserData(matchedUser);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchMatchedUser();
  }, [userEmail]);

  // --- 3. Fetch All Courses ---
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/all-course');
      const result = await res.json();
      if (result.success) setCourses(result.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- 4. Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingCourse({ ...editingCourse, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData?.role !== 'admin') return toast.error("Only admins can add courses!");

    const toastId = toast.loading("Uploading course... ⏳");
    try {
      const res = await fetch('/api/add-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Course Uploaded Successfully! 🚀", { id: toastId });
        fetchCourses();
        setFormData({
          courseName: '', price: '', description: '', instructorName: '',
          duration: '3 Months', status: 'Upcoming', seats: '',
          instructorPicLink: '', thumbnailLink: '', upcomingDate: ''
        });
      } else {
        toast.error(data.message || "Something went wrong!", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to connect to server! ❌", { id: toastId });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (userData?.role !== 'admin') return toast.error("Unauthorized!");
    const toastId = toast.loading("Updating course info... ⏳");
    try {
      const res = await fetch(`/api/course-update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingCourse, id: editingCourse._id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Course Updated Successfully! ✨", { id: toastId });
        setIsEditModalOpen(false);
        fetchCourses(); 
      } else {
        toast.error(data.message || "Update failed!", { id: toastId });
      }
    } catch (error) {
      toast.error("Server error! ❌", { id: toastId });
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      <Toaster position="top-center" />

      {/* --- COURSE LIST TABLE --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-[#011e40] to-[#023b7d]">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <FaBook className="text-[#f1c40f]" /> Course Management
            </h2>
            <p className="text-blue-200 text-xs mt-1 uppercase tracking-[0.2em] font-bold">Active Programs</p>
          </div>
          <div className="bg-[#f1c40f] text-[#011e40] px-6 py-2 rounded-2xl text-sm font-black shadow-lg">
            Total: {courses.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-gray-500 font-bold animate-pulse">Loading Courses...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 uppercase text-[11px] font-black tracking-widest border-b">
                  <th className="p-6">Course Details</th>
                  <th className="p-6">Instructor</th>
                  <th className="p-6 text-center">Status</th>
                  <th className="p-6">Price</th>
                  {userData?.role === 'admin' && <th className="p-6 text-center">Edit</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50/80 transition-all">
                    <td className="p-6 font-black text-[#011e40] text-lg">{course.courseName}</td>
                    <td className="p-6 text-gray-700 font-bold">{course.instructorName}</td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${course.status === 'Running' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="p-6 font-black text-[#011e40]">৳{course.price}</td>
                    {userData?.role === 'admin' && (
                      <td className="p-6 text-center">
                        <button onClick={() => { setEditingCourse(course); setIsEditModalOpen(true); }} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                          <FaPenToSquare />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- ADD NEW COURSE FORM (SCREENSHOT DESIGN) --- */}
      {userData?.role === 'admin' && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50">
            <h2 className="text-xl font-black text-[#011e40] uppercase flex items-center gap-2">
              <FaCirclePlus className="text-[#f1c40f]" /> Add New Course
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Course Title & Status/Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Course Title</label>
                <input name="courseName" value={formData.courseName} onChange={handleChange} placeholder="Master in Next.js" className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-blue-200 transition-all" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-600 uppercase ml-1">Status & Start Date</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-black text-sm">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Running">Running</option>
                  </select>
                </div>
                <div className="space-y-2 pt-6">
                  <input name="upcomingDate" type="date" value={formData.upcomingDate} onChange={handleChange} className="w-full px-4 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl outline-none font-bold text-blue-600 text-sm" />
                </div>
              </div>

              {/* Instructor Image & Thumbnail */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Instructor Image Link</label>
                <input name="instructorPicLink" value={formData.instructorPicLink} onChange={handleChange} placeholder="URL here..." className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Thumbnail Link</label>
                <input name="thumbnailLink" value={formData.thumbnailLink} onChange={handleChange} placeholder="URL here..." className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-bold" />
              </div>

              {/* Instructor Name & Price/Seats */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Instructor Name</label>
                <input name="instructorName" value={formData.instructorName} onChange={handleChange} placeholder="Jhankar Mahbub" className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Price (৳)</label>
                  <input name="price" value={formData.price} type="number" onChange={handleChange} placeholder="4500" className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Seats</label>
                  <input name="seats" value={formData.seats} type="number" onChange={handleChange} placeholder="50" className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-bold" />
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2">
                <FaFileLines className="text-amber-500" /> Detailed Description
              </label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What will students learn in this course?" rows="4" className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-bold resize-none" />
            </div>

            <button type="submit" className="w-full bg-[#011e40] py-5 rounded-2xl font-black text-white uppercase tracking-widest hover:bg-[#023b7d] transition-all shadow-xl cursor-pointer">
              Upload Course
            </button>
          </form>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && editingCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-[#011e40] flex justify-between items-center text-white">
               <h3 className="font-black uppercase flex items-center gap-2"><FaPenToSquare className="text-[#f1c40f]"/> Update Course</h3>
               <button onClick={() => setIsEditModalOpen(false)} className="bg-white/10 p-2 rounded-full cursor-pointer hover:bg-red-500 transition-all"><FaXmark /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2 space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase">Course Name</label>
                 <input name="courseName" value={editingCourse.courseName} onChange={handleEditChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase">Status</label>
                 <select name="status" value={editingCourse.status} onChange={handleEditChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-black text-blue-600">
                   <option value="Upcoming">Upcoming</option>
                   <option value="Running">Running</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase">Price</label>
                 <input name="price" value={editingCourse.price} type="number" onChange={handleEditChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none" />
               </div>
               <div className="md:col-span-2 pt-4">
                 <button type="submit" className="w-full bg-[#f1c40f] py-5 rounded-2xl font-black text-[#011e40] uppercase shadow-lg cursor-pointer hover:scale-[1.02] transition-transform">Save Changes</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}