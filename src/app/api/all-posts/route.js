import { NextResponse } from "next/server";
import Post from "@/models/Post";     // আপনার Post মডেল পাথ
import { connect } from "@/lib/db";

export async function GET() {
  try {
    // ১. ডাটাবেস কানেক্ট করা
    await connect();

    // ২. সব পোস্ট ডাটাবেস থেকে নিয়ে আসা (সবচেয়ে নতুনটা আগে দেখাবে)
    const allPosts = await Post.find({}).sort({ createdAt: -1 });

    // ৩. সফল হলে ডাটা পাঠানো
    return NextResponse.json({
      success: true,
      data: allPosts,
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Error:", error);
    
    // ৪. কোনো এরর হলে সেটি পাঠানো
    return NextResponse.json({
      success: false,
      message: "Data fetch করতে সমস্যা হয়েছে!",
      error: error.message,
    }, { status: 500 });
  }
}

// এই রুটটি ক্যাশ করবে না যাতে আপনি সবসময় লেটেস্ট ডেটা পান
export const revalidate = 0;