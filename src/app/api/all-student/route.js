import { NextResponse } from "next/server";
import Student from "@/models/Student";
import { connect } from "@/lib/db";

// --- 1. GET: Shob Student-er list niye asha ---
export async function GET() {
  try {
    await connect(); // Database connection ensure kora
    
    // Database theke shob student data fetch kora (Latest gulo agey thakbe)
    const students = await Student.find().sort({ admissionDate: -1 });

    return NextResponse.json({
      success: true,
      data: students
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Data ante somossa hoyeche: " + error.message
    }, { status: 500 });
  }
}