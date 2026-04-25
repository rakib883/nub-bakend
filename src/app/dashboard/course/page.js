'use client';
import React, { useState, useEffect } from 'react'; // 👈 useEffect add kora hoyeche
import { 
  FaBook, FaUserTie, FaClock, FaTag, FaUsers, 
  FaCirclePlus, FaImage, FaFileLines, FaLink, 
  FaCheckCircle, FaPenToSquare, FaXmark
} from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 loading state lagbe

  // --- 1. Fetch Function ---
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/all-course'); 
      const result = await res.json();
      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses!");
    } finally {
      setLoading(false);
    }
  };

  // 👈 2. Page load holei data fetch hobe
  useEffect(() => {
    fetchCourses();
  }, []);

  const [formData, setFormData] = useState({
    courseName: '', price: '', description: '', instructorName: '',
    duration: '3 Months', status: 'Upcoming', seats: '',
    instructorPicLink: '', thumbnailLink: '', upcomingDate: ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingCourse({ ...editingCourse, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Uploading course to database... ⏳");

    try {
      const res = await fetch('/api/add-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Course Uploaded Successfully! 🚀", { id: toastId });
        
        // 👈 3. Data submit houwar por refresh kora
        fetchCourses(); 

        setFormData({
          courseName: '', price: '', description: '', instructorName: '',
          duration: '3 Months', status: 'Upcoming', seats: '',
          instructorPicLink: '', thumbnailLink: '', upcomingDate: ''
        });
        e.target.reset(); 
      } else {
        toast.error(data.message || "Something went wrong!", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to connect to server! ❌", { id: toastId });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success("Course Info Updated! ✨");
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-10 pb-20">
      <Toaster position="top-center" />

      {/* --- COURSE LIST TABLE --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-[#011e40] to-[#023b7d]">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <FaBook className="text-[#f1c40f]" /> Course Management
            </h2>
            <p className="text-blue-200 text-xs mt-1 uppercase tracking-[0.2em] font-bold">Lerapress Active Programs</p>
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
                  <th className="p-6 text-center font-black">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-gray-400">No courses found in database.</td></tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50/80 transition-all group">
                      <td className="p-6 font-black text-[#011e40] text-lg">{course.courseName}</td>
                      <td className="p-6 text-gray-700 font-bold">{course.instructorName}</td>
                      <td className="p-6 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${course.status === 'Running' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                          {course.status}
                        </span>
                        {course.status === 'Upcoming' && course.upcomingDate && (
                           <p className="text-[10px] mt-1 font-bold text-blue-500 italic">Date: {course.upcomingDate}</p>
                        )}
                      </td>
                      <td className="p-6 font-black text-[#011e40]">৳{course.price}</td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => { setEditingCourse(course); setIsEditModalOpen(true); }}
                          className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                        >
                          <FaPenToSquare />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- ADD NEW COURSE FORM --- */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-2xl font-black text-[#011e40] uppercase flex items-center gap-3">
            <FaCirclePlus className="text-[#f1c40f]" /> Add New Course
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase ml-1">Course Title</label>
            <input name="courseName" value={formData.courseName} type="text" onChange={handleChange} placeholder="Master in Next.js" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] outline-none focus:border-[#f1c40f] font-bold text-[#011e40]" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-blue-600 uppercase ml-1">Status & Start Date</label>
            <div className="flex gap-2">
              <select name="status" value={formData.status} onChange={handleChange} className="w-1/2 px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] outline-none focus:border-[#f1c40f] font-black text-[#011e40]">
                <option value="Upcoming">Upcoming</option>
                <option value="Running">Running</option>
              </select>
              <input name="upcomingDate" value={formData.upcomingDate} onChange={handleChange} type="date" className="w-1/2 px-5 py-4 bg-blue-50 border-2 border-blue-100 rounded-[1.25rem] outline-none font-bold text-blue-600" disabled={formData.status !== 'Upcoming'} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase ml-1">Instructor Image Link</label>
            <input name="instructorPicLink" value={formData.instructorPicLink} type="url" onChange={handleChange} placeholder="URL here..." className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] outline-none font-bold" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase ml-1">Thumbnail Link</label>
            <input name="thumbnailLink" value={formData.thumbnailLink} type="url" onChange={handleChange} placeholder="URL here..." className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] outline-none font-bold" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase ml-1">Instructor Name</label>
            <input name="instructorName" value={formData.instructorName} type="text" onChange={handleChange} placeholder="Jhankar Mahbub" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] outline-none font-bold" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase ml-1">Price (৳)</label>
              <input name="price" value={formData.price} type="number" onChange={handleChange} placeholder="4500" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] outline-none font-bold" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase ml-1">Seats</label>
              <input name="seats" value={formData.seats} type="number" onChange={handleChange} placeholder="50" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] outline-none font-bold" required />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase ml-1 flex items-center gap-2">
              <FaFileLines className="text-[#f1c40f]" /> Detailed Description
            </label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="4" 
              placeholder="What will students learn in this course?" 
              className="w-full px-5 py-5 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] outline-none focus:border-[#f1c40f] font-medium text-[#011e40]"
            ></textarea>
          </div>

          <div className="md:col-span-2 pt-4">
            <button type="submit" className="w-full bg-[#011e40] py-5 rounded-[1.5rem] font-black text-[#f1c40f] shadow-xl hover:bg-[#023066] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 cursor-pointer">
              Upload course 
            </button> 
          </div>
        </form>
      </div>

      {/* --- EDIT POPUP MODAL --- */}
      {isEditModalOpen && editingCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 bg-[#011e40] flex justify-between items-center text-white">
               <h3 className="font-black uppercase flex items-center gap-2 tracking-widest"><FaPenToSquare className="text-[#f1c40f]"/> Update Information</h3>
               <button onClick={() => setIsEditModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-red-500 cursor-pointer"><FaXmark /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2 space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase">Course Name</label>
                 <input name="courseName" value={editingCourse.courseName} onChange={handleEditChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" />
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
                 <input name="price" value={editingCourse.price} onChange={handleEditChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" />
               </div>
               <div className="md:col-span-2 pt-4 text-center">
                 <button type="submit" className="w-full bg-[#f1c40f] py-4 rounded-2xl font-black text-[#011e40] uppercase shadow-lg hover:scale-[1.01] transition-all cursor-pointer">Save Changes</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}