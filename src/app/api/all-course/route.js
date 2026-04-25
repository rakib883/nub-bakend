import { NextResponse } from "next/server";
import Course from "@/models/Course";
import { connect } from "@/lib/db";

export async function GET() {
  try {
    await connect()
    // Database theke shob course find kora (latest gulo upore thakbe)
    const courses = await Course.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}