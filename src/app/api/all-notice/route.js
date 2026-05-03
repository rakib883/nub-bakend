import { NextResponse } from "next/server";
import Notice from "@/models/Notice";
import { connect } from "@/lib/db";

export async function GET() {
  try {
    await connect()
    // নতুন নোটিশ সবার আগে দেখানোর জন্য sort({ createdAt: -1 }) ব্যবহার করা হয়েছে
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}