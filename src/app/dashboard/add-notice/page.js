'use client';
import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaTrashCan, FaPlus, FaCircleExclamation } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';

export default function NoticeManager() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNotice, setNewNotice] = useState("");

  // ১. নোটিশ লোড করা
  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/all-notice'); // আপনার অল-নোটিশ এপিআই
      const data = await res.json();
      if (data.success) setNotices(data.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ২. নোটিশ আপলোড করা
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newNotice) return toast.error("Please enter notice text!");

    const toastId = toast.loading("Uploading notice...");
    try {
      const res = await fetch('/api/add-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newNotice }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Notice Published!", { id: toastId });
        setNewNotice("");
        fetchNotices();
      }
    } catch (error) {
      toast.error("Upload failed!", { id: toastId });
    }
  };

  // ৩. নোটিশ ডিলিট করা
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    const toastId = toast.loading("Deleting notice...");
    try {
      const res = await fetch(`/api/delete-notice/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Notice Deleted!", { id: toastId });
        fetchNotices();
      }
    } catch (error) {
      toast.error("Delete failed!", { id: toastId });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <Toaster />

      {/* ADD NOTICE SECTION */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-[#011e40] text-white flex items-center gap-3">
          <FaBullhorn className="text-[#f1c40f]" />
          <h2 className="font-black uppercase tracking-wider text-sm">Post New Emergency Notice</h2>
        </div>
        <form onSubmit={handleUpload} className="p-8 flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={newNotice}
            onChange={(e) => setNewNotice(e.target.value)}
            placeholder="e.g., Notice 5: Semester Final Exam Date Released"
            className="flex-1 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-blue-200 transition-all"
          />
          <button type="submit" className="bg-[#f1c40f] text-[#011e40] px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-transform cursor-pointer">
            <FaPlus /> Post Notice
          </button>
        </form>
      </div>

      {/* NOTICE LIST & DELETE SECTION */}
      <div className="bg-[#1a1a1a] rounded-[2rem] shadow-xl overflow-hidden border border-gray-800">
        <div className="p-5 text-center border-b border-gray-800">
          <h2 className="text-white font-black flex items-center justify-center gap-2 tracking-tighter text-lg">
            <FaCircleExclamation className="text-red-500 animate-pulse" /> EMERGENCY NOTICE BOARD
          </h2>
        </div>

        <div className="p-6 space-y-3 bg-white/5 backdrop-blur-md min-h-[200px]">
          {loading ? (
            <div className="text-center py-10 text-gray-500 font-bold">Loading Notices...</div>
          ) : notices.length === 0 ? (
            <div className="text-center py-10 text-gray-500 font-bold italic">No active notices found.</div>
          ) : (
            notices.map((notice) => (
              <div key={notice._id} className="group flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border-l-4 border-[#f1c40f] hover:border-red-500 transition-all">
                <span className="font-bold text-[#011e40] text-sm md:text-base">{notice.title}</span>
                <button 
                  onClick={() => handleDelete(notice._id)}
                  className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Delete Notice"
                >
                  <FaTrashCan size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}