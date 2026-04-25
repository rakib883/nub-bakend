import { connect } from "@/lib/db";
import Register from "@/models/Register";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();
    
    // Database theke shob user-ke tule ana (Password chara security-r jonno)
    const users = await Register.find({}).select("-password");

    return NextResponse.json({ 
      success: true, 
      data: users 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}