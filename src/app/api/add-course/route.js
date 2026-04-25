import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connect } from "@/lib/db";

export async function POST(req) {
  try {
    // 1. Database Connection
    await connect()

    // 2. Parse Body Data
    const body = await req.json();
    
    // 3. Destructure (Optional check)
    const { courseName, price, instructorPicLink, thumbnailLink, seats } = body;

    if (!courseName || !price || !instructorPicLink || !thumbnailLink || !seats) {
      return NextResponse.json({ success: false, message: "Missing required fields!" }, { status: 400 });
    }

    // 4. Create New Course in DB
    const newCourse = await Course.create(body);

    return NextResponse.json({ 
      success: true, 
      message: "Course saved to database! 🚀",
      data: newCourse 
    }, { status: 201 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error" 
    }, { status: 500 });
  }
}