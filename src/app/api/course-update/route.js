import { connect } from "@/lib/db";
import Course from "@/models/Course"; // আপনার কোর্স মডেলের নাম ও পাথ চেক করে নিবেন
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    // ১. ডাটাবেজ কানেক্ট করা
    await connect();

    // ২. ফ্রন্টএন্ড থেকে পাঠানো ডাটা রিসিভ করা
    const body = await req.json();
    const { id, courseName, price, status, instructorName, seats, description } = body;

    // ৩. আইডি আছে কিনা চেক করা
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: "Course ID provide kora hoy ni!" 
      }, { status: 400 });
    }

    // ৪. Mongoose দিয়ে আপডেট করা (findByIdAndUpdate ব্যবহার করলে কোড ছোট হয়)
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        courseName,
        price,
        status,
        instructorName,
        seats,
        description,
      },
      { new: true } // এটি দিলে আপডেট হওয়া নতুন ডাটাটি রিটার্ন করবে
    );

    if (!updatedCourse) {
      return NextResponse.json({ 
        success: false, 
        message: "Course-ti khuje paoya jay ni!" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Course Updated Successfully! 🚀",
      data: updatedCourse 
    }, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}