"use client";
import React, { useState, useEffect } from 'react';
import { FaLink, FaFileSignature, FaArrowRight, FaTrash, FaPenToSquare, FaEye } from 'react-icons/fa6';

export default function PostManagementUI() {
  const [loading, setLoading] = useState(false);
  const [imageLink, setImageLink] = useState("");
  const [posts, setPosts] = useState([]); // ডেটাবেস থেকে আসা পোস্টগুলো এখানে থাকবে

  // ১. সব পোস্ট লোড করার ফাংশন
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/all-posts'); // আপনার GET এপিআই অনুযায়ী নাম পরিবর্তন করতে পারেন
      const result = await res.json();
      if (result.success) setPosts(result.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const postData = {
      title: e.target.title.value,
      description: e.target.description.value,
      imageLink: imageLink,
    };

    try {
      const response = await fetch('/api/add-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Post Published Successfully!");
        setImageLink("");
        e.target.reset();
        fetchPosts(); // নতুন পোস্ট করার পর টেবিল অটো আপডেট হবে
      }
    } catch (error) {
      alert("Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  // ২. ডিলিট লজিক
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        const res = await fetch(`/api/delete-blog/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
          alert("Blog Deleted!");
          fetchPosts(); // ডিলিট হওয়ার পর লিস্ট আপডেট
        }
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 space-y-12">
      
      {/* --- পোস্ট আপলোড ফর্ম --- */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="bg-[#002147] p-5 text-center">
          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-3 uppercase tracking-widest">
            <FaFileSignature /> Create New Blog
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Blog Title</label>
              <input name="title" type="text" placeholder="Title here..." className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Image Link (URL)</label>
              <div className="relative">
                <FaLink className="absolute left-3 top-4 text-gray-400" />
                <input type="text" value={imageLink} onChange={(e) => setImageLink(e.target.value)} placeholder="Paste link..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" required />
              </div>
            </div>
            {imageLink && (
              <div className="relative rounded-lg overflow-hidden border h-32 bg-gray-50">
                <img src={imageLink} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description</label>
              <textarea name="description" rows="6" placeholder="Write details..." className="w-full p-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none" required></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#002147] hover:bg-[#003366] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 disabled:opacity-50">
              {loading ? "Publishing..." : <>Publish Post <FaArrowRight /></>}
            </button>
          </div>
        </form>
      </div>

      {/* --- ব্লগ লিস্ট টেবিল --- */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-black text-[#002147] uppercase tracking-tight">Manage Blogs</h3>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Live Posts: {posts.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#002147] text-white text-[11px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Blog Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.length > 0 ? posts.map((post) => (
                <tr key={post._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-20 h-12 rounded shadow-sm overflow-hidden border bg-white">
                      <img src={post.imageLink} alt="blog" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{post.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-400 line-clamp-1">{post.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-all" title="View">
                        <FaEye size={16} />
                      </button>
                      <button className="p-2 text-amber-500 hover:bg-amber-100 rounded-lg transition-all" title="Edit">
                        <FaPenToSquare size={16} />
                      </button>
                      <button onClick={() => handleDelete(post._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all" title="Delete">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-300 font-bold uppercase tracking-widest text-xs">No blogs found in database</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}