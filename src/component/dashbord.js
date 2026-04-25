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
  const upcomingCourses = [
    { id: 1, name: "Advanced Next.js", trainer: "Tanvir Hossain", date: "15 May, 2026", status: "Upcoming" },
    { id: 2, name: "UI/UX Design Masterclass", trainer: "Sabbir Ahmed", date: "22 May, 2026", status: "Opening" },
    { id: 3, name: "Full Stack MERN", trainer: "Arif Rayhan", date: "01 June, 2026", status: "Upcoming" },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">20 Minit School Overview</h1>
        <p className="text-gray-500">Welcome back, Admin! Here's what's happening today.</p>
      </div>
      
      {/* 🚀 Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Students" count="1,420" color="bg-blue-600" icon={HiUsers} />
        <StatCard title="New Admission" count="128" color="bg-emerald-600" icon={HiUserAdd} />
        <StatCard title="Total Courses" count="24" color="bg-violet-600" icon={HiBookOpen} />
        <StatCard title="Total Trainers" count="18" color="bg-amber-600" icon={HiAcademicCap} />
      </div>

      {/* 📅 Upcoming Courses Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <LuCalendarDays className="text-gray-400 text-xl" />
          <h2 className="text-lg font-bold text-gray-800">Upcoming Courses</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Course Name</th>
                <th className="px-6 py-4 font-semibold">Trainer</th>
                <th className="px-6 py-4 font-semibold">Start Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {upcomingCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{course.name}</td>
                  <td className="px-6 py-4 text-gray-600">{course.trainer}</td>
                  <td className="px-6 py-4 text-gray-600">{course.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}