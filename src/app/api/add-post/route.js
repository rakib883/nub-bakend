import { NextResponse } from 'next/server';
import Post from '@/models/Post';
import { connect } from '@/lib/db';

export async function POST(req) {
  try {
    // ১. ডেটাবেস কানেক্ট করুন
    await connect();

    // ২. রিকোয়েস্ট বডি থেকে ডাটা নিন
    const { title, description, imageLink } = await req.json();

    // ৩. ডাটাবেসে সেভ করুন
    const newPost = await Post.create({
      title,
      description,
      imageLink,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Post created successfully!", 
      data: newPost 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Something went wrong", 
      error: error.message 
    }, { status: 500 });
  }
}

// চাইলে আপনি সব পোস্ট দেখার জন্য GET মেথডও এখানে রাখতে পারেন
export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}