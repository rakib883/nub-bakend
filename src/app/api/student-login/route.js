import { NextResponse } from "next/server";
import Student from "@/models/Student"; 
import { connect } from "@/lib/db";

export async function POST(req) {
  try {
    await connect();
    const { email, password } = await req.json();

    // 1. Email lowercase kore find koro jate case mismatch na hoy
    const student = await Student.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Ei email-e kono student paowa jayni!" }, 
        { status: 404 }
      );
    }

    // 2. Password (Mobile Number) String-e convert kore match kora safe
    const isPasswordCorrect = student.mobileNumber.toString() === password.toString();

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Password (Mobile Number) vul!" }, 
        { status: 401 }
      );
    }

    // 3. Login Success
    return NextResponse.json({
      success: true,
      message: "Login successful 🎉",
      student: {
        id: student._id,
        name: student.studentName,
        email: student.email,
        // Pro-tip: Ekhane role ba status-o pathate paro (e.g., student.status)
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error!" }, 
      { status: 500 }
    );
  }
}