import { NextResponse } from "next/server";
import Student from "@/models/Student";
import { connect } from "@/lib/db";

export async function POST(req) {
  try {
    await connect()
    const body = await req.json();
    
    // Database-e create kora
    const newStudent = await Student.create(body);

    return NextResponse.json({ 
        success: true, 
        message: "Admission successful!", 
        data: newStudent 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
        success: false, 
        message: error.message 
    }, { status: 500 });
  }
}