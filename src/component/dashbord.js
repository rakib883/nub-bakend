"use client";
import { useEffect, useState } from "react";
import { HiUsers, HiUserAdd, HiBookOpen, HiAcademicCap } from "react-icons/hi";
import { LuCalendarDays } from "react-icons/lu";

// Stat Card Component
const StatCard = ({ title, count, icon: Icon, color }) => (
  <div className="p-6 rounded-2xl shadow-sm border border-gray-100 bg-white flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{count}</h3>
    </div>
    <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-2xl`}>
      <Icon className={color.replace('bg-', 'text-')} />
    </div>
  </div>
);

export default function Dashboard() {
  const [courseData, setCourseData] = useState([]);
  const [upcomingCoursesData, setUpcomingCoursesData] = useState([]); // ✅ Upcoming-er jonno state
  const [newstudent, setNewStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [trainersCount, setTrainersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [studentRes, courseRes, userRes] = await Promise.all([
        fetch('/api/all-student'),
        fetch('/api/all-course'),
        fetch('/api/all-user')
      ]);

      const studentResult = await studentRes.json();
      const courseResult = await courseRes.json();
      const userResult = await userRes.json();

      // ১. স্টুডেন্ট প্রসেস
      if (studentResult.success) {
        setStudents(studentResult.data);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyAdmissions = studentResult.data.filter(student => {
          if (!student.admissionDate) return false;
          const admissionDate = new Date(student.admissionDate);
          return (
            admissionDate.getMonth() === currentMonth &&
            admissionDate.getFullYear() === currentYear
          );
        });
        setNewStudents(monthlyAdmissions);
      }

      // ২. কোর্স এবং আপকামিং কোর্স প্রসেস
      if (courseResult.success) {
        setCourseData(courseResult.data);
        
        // ✅ স্ট্যাটাস অনুযায়ী আপকামিং ফিল্টার করা হলো
        const filteredUpcoming = courseResult.data.filter(course => 
          course.status?.toLowerCase() === "upcoming"
        );
        setUpcomingCoursesData(filteredUpcoming);
      }

      // ৩. ট্রেইনার প্রসেস
      if (userResult.success) {
        const trainers = userResult.data.filter(user => user.role === "instructor");
        setTrainersCount(trainers.length);
      }

    } catch (error) {
      console.error("Dashboard Loading Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <div className="p-10 text-center font-black animate-pulse uppercase tracking-widest text-[#011e40]">Loading Dashboard...</div>;

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#011e40]">20 Minit School Overview</h1>
        <p className="text-gray-500 font-medium">Welcome back, Admin! Here's what's happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Students" count={students.length} color="bg-blue-600" icon={HiUsers} />
        <StatCard title="This Month Admission" count={newstudent.length} color="bg-emerald-600" icon={HiUserAdd} />
        <StatCard title="Total Courses" count={courseData.length} color="bg-violet-600" icon={HiBookOpen} />
        <StatCard title="Total Trainers" count={trainersCount} color="bg-amber-600" icon={HiAcademicCap} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <LuCalendarDays className="text-gray-400 text-xl" />
          <h2 className="text-lg font-black text-gray-800">Upcoming Courses</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4">Course Name</th>
                <th className="px-6 py-4">Trainer</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {upcomingCoursesData.length > 0 ? (
                upcomingCoursesData.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800 text-sm">
                      {course.courseName || course.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course.instructorName || course.trainer || "TBA"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course.startDate ? new Date(course.startDate).toLocaleDateString() : "TBA"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-yellow-50 text-yellow-600 border border-yellow-100">
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                    No Upcoming Courses Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}