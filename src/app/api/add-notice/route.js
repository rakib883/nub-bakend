import { NextResponse } from "next/server";
import Notice from "@/models/Notice";
import { connect } from "@/lib/db";

export async function POST(req) {
  try {
    await connect()
    
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Notice title is required" },
        { status: 400 }
      );
    }

    const newNotice = await Notice.create({ title });

    return NextResponse.json(
      { 
        success: true, 
        message: "Notice added successfully!", 
        data: newNotice 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Notice Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error, please try again" },
      { status: 500 }
    );
  }
}