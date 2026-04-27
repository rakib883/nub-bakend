'use client';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaTrashCan, FaUserGraduate, FaUserTie, FaEnvelope, FaMagnifyingGlass, FaBookOpen } from "react-icons/fa6";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/all-user");
      const result = await res.json();
      if (result.success) {
        setEmployees(result.data);
      }
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    const toastId = toast.loading("Deleting member...");
    try {
      const res = await fetch(`/api/delete-user?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success("Member removed successfully!", { id: toastId });
        setEmployees(employees.filter(emp => emp._id !== id));
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      toast.error("Error deleting employee", { id: toastId });
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
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#011e40] tracking-tight">Employee Directory</h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Active Members: {employees.length}
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-[20px] outline-none focus:ring-2 focus:ring-[#f1c40f]/20 focus:border-[#f1c40f] transition-all font-bold text-sm shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Employee Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Official Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Education & Background</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-blue-50/30 transition-all group">
                  
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border-2 border-white shadow-md overflow-hidden group-hover:scale-110 transition-transform duration-300">
                          {emp.profilePicture ? (
                            <img src={emp.profilePicture} alt="User" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                               <FaUserTie size={18} />
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-black text-[#011e40] text-[14px] leading-none mb-1 group-hover:text-blue-600 transition-colors">
                          {emp.name || "N/A Member"}
                        </p>
                        <p className="text-[11px] text-gray-400 font-bold tracking-tight">{emp.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      emp.role === 'admin' ? 'bg-red-50 text-red-500 border-red-100' : 
                      emp.role === 'instructor' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                      'bg-emerald-50 text-emerald-500 border-emerald-100'
                    }`}>
                      {emp.role}
                    </span>
                  </td>

                  {/* Education & Last Education Section */}
                  <td className="px-8 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <FaUserGraduate className="text-[#f1c40f] text-[10px]" />
                        <p className="text-[11px] font-black text-gray-600 truncate max-w-[180px]">
                          {emp.lastEducation || "No Degree"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-60">
                        <FaBookOpen className="text-gray-400 text-[10px]" />
                        <p className="text-[10px] font-bold text-gray-500 italic truncate max-w-[180px]">
                          Last: {emp.education || "Not Provided"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(emp._id)}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-[15px] transition-all active:scale-90"
                      title="Delete Employee"
                    >
                      <FaTrashCan size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="py-24 text-center">
            <div className="inline-flex p-6 bg-gray-50 rounded-full mb-4">
               <FaUserTie size={40} className="text-gray-200" />
            </div>
            <h3 className="text-gray-400 font-black text-sm uppercase tracking-widest">No matching records</h3>
          </div>
        )}
      </div>
    </div>
  );
}
