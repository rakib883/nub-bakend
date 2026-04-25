"use client";
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhoneAlt, FaGraduationCap, FaMapMarkerAlt, FaMoneyBillWave, FaBookOpen, FaCheckCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

export default function StudentAdmissionForm() {
  const [courses, setCourses] = useState([]);
  const [selectedCoursePrice, setSelectedCoursePrice] = useState(0);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    mobileNumber: '',
    lastStudyLevel: 'SSC',
    address: '',
    purchaseCourse: '',
    cashPaid: '',
    dueAmount: 0
  });

  // 1. Database theke Dynamic Course load kora
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('https://nub-bakend.vercel.app/api/all-course'); 
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setCourses(result.data);
        }
      } catch (error) {
        toast.error("Course list load hote somossa hochhe!");
      }
    };
    fetchCourses();
  }, []);

  // 2. Course Change hole Price set kora
  const handleCourseChange = (e) => {
    const courseName = e.target.value;
    const selectedObj = courses.find(c => c.courseName === courseName);
    
    if (selectedObj) {
      const price = Number(selectedObj.price) || 0;
      setSelectedCoursePrice(price);
      const currentPaid = Number(formData.cashPaid) || 0;
      setFormData(prev => ({ 
        ...prev, 
        purchaseCourse: courseName,
        dueAmount: price - currentPaid > 0 ? price - currentPaid : 0
      }));
    } else {
      setSelectedCoursePrice(0);
      setFormData(prev => ({ ...prev, purchaseCourse: '', dueAmount: 0 }));
    }
  };

  // 3. Cash Payment change hole Due update kora
  const handleCashChange = (e) => {
    const cash = Number(e.target.value) || 0;
    const due = selectedCoursePrice - cash;
    setFormData(prev => ({ 
      ...prev, 
      cashPaid: e.target.value, 
      dueAmount: due >= 0 ? due : 0 
    }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.purchaseCourse) return toast.error("Course select koro!");

    const loadingToast = toast.loading("Processing...");
    try {
      const res = await fetch('/api/student-reg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, totalPrice: selectedCoursePrice }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Student Admission Success! 🎉", { id: loadingToast });
        setFormData({
          studentName: '', email: '', mobileNumber: '', lastStudyLevel: 'SSC',
          address: '', purchaseCourse: '', cashPaid: '', dueAmount: 0
        });
        setSelectedCoursePrice(0);
      } else {
        toast.error("Error: " + data.message, { id: loadingToast });
      }
    } catch (error) {
      toast.error("Server error!", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans">
      <Toaster />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        <div className="bg-[#002147] p-8 text-center text-white">
          <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <FaGraduationCap className="text-[#FFD233]" /> Student Registration Form
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Student Name</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-4 text-gray-300" />
              <input name="studentName" value={formData.studentName} onChange={handleChange} type="text" placeholder="Full Name" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-semibold" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-4 text-gray-300" />
              <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="email@gmail.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-semibold" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Mobile Number</label>
            <div className="relative">
              <FaPhoneAlt className="absolute left-4 top-4 text-gray-300" />
              <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} type="tel" placeholder="01XXXXXXXXX" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-semibold" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Last Study Level</label>
            <select name="lastStudyLevel" value={formData.lastStudyLevel} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold">
              <option value="SSC">SSC</option>
              <option value="HSC">HSC</option>
              <option value="Diploma">Diploma</option>
              <option value="BSC">BSC</option>
            </select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-bold text-blue-500 uppercase">Select Course</label>
            <select name="purchaseCourse" value={formData.purchaseCourse} onChange={handleCourseChange} className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl outline-none font-bold text-blue-800" required>
              <option value="">-- Click to Select Course --</option>
              {courses.map(course => <option key={course._id} value={course.courseName}>{course.courseName}</option>)}
            </select>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-gray-300">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Fee</p>
            <p className="text-xl font-black text-[#002147]">৳{selectedCoursePrice}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-green-600 uppercase">Cash Paid</label>
            <input name="cashPaid" value={formData.cashPaid} onChange={handleCashChange} type="number" placeholder="Enter Amount" className="w-full px-4 py-3 bg-green-50 border border-green-100 rounded-xl outline-none focus:border-green-500 font-bold text-green-700" required />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Student Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="Full Address..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold" required></textarea>
          </div>

          <div className="md:col-span-2 bg-red-50 p-5 rounded-2xl flex justify-between items-center border border-red-100">
            <div>
              <p className="text-[10px] font-bold text-red-400 uppercase">Current Due</p>
              <p className="text-2xl font-black text-red-600">৳{formData.dueAmount}</p>
            </div>
            <FaMoneyBillWave className="text-3xl text-red-200" />
          </div>

          <button type="submit" className="md:col-span-2 w-full bg-[#002147] hover:bg-[#001a38] text-[#FFD233] py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
            <FaCheckCircle /> Confirm Admission
          </button>
        </form>
      </div>
    </div>
  );
}