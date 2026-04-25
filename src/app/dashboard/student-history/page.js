"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { FaSearch, FaPhoneAlt, FaEnvelope, FaTrash } from 'react-icons/fa';

const StudentListTable = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Data Fetch Kora
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/all-student'); 
      const result = await res.json();
      if (result.success) {
        setStudents(result.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading students", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. ✅ Delete Function
  const handleDelete = async (id, name) => {
    const confirmDelete = confirm(`Are you sure you want to delete ${name}?`);
    
    if (confirmDelete) {
      try {
        const res = await fetch(`/api/delete-student/${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();

        if (result.success) {
          // List update kora (Delete howar por filter kore bad dewa)
          setStudents(students.filter(student => student._id !== id));
        } else {
          alert("Failed to delete student.");
        }
      } catch (error) {
        alert("Something went wrong!");
      }
    }
  };

  const filteredStudents = students.filter((student) =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.mobileNumber.includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <div className="animate-pulse text-xl font-black text-[#002147]">LOADING STUDENTS...</div>
    </div>
  );




  
 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tight">Student Database</h2>
            <p className="text-gray-500 text-sm font-bold">Total {filteredStudents.length} Students</p>
          </div>

          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-[#002147] outline-none shadow-sm transition-all font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002147] text-white">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Student Info</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Payments</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Due Amount</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 text-[#002147] rounded-full flex items-center justify-center font-bold uppercase text-sm">
                            {student.studentName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 leading-tight">{student.studentName}</div>
                            <div className="text-[11px] flex items-center gap-1 mt-1">
                              <FaEnvelope className="text-gray-400" />
                              <Link href={`/students/${student._id}`} className="text-blue-600 hover:underline font-bold">
                                {student.email}
                              </Link>
                            </div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-1">
                              <FaPhoneAlt className="text-gray-300" /> {student.mobileNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-xs uppercase text-indigo-700">
                        {student.purchaseCourse}
                      </td>

                      <td className="px-6 py-4 text-sm font-black text-green-600">
                        ৳{student.cashPaid}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`font-black text-sm px-2 py-1 rounded-lg ${student.dueAmount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          ৳{student.dueAmount}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {/* ✅ Delete Button updated with onClick */}
                        <button 
                          onClick={() => handleDelete(student._id, student.studentName)}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 group"
                        >
                          <FaTrash className="group-hover:scale-110" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentListTable;