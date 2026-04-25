import { NextResponse } from "next/server";
import Register from "@/models/Register";
import { connect } from "@/lib/db";

export async function PUT(req) {
  try {
    await connect();

    // Frontend theke data ana
    const body = await req.json();
    const { 
      email, 
      name, 
      profilePicture, 
      education, 
      experience, 
      course, 
      lastEducation, 
      summary 
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required to update!" },
        { status: 400 }
      );
    }

    // Database-e find ebong update kora
    const updatedUser = await Register.findOneAndUpdate(
      { email: email }, // Filter: kar data update hobe
      { 
        $set: { 
          name, 
          profilePicture, 
          education, 
          experience, 
          course, 
          lastEducation, 
          summary 
        } 
      },
      { new: true, runValidators: true } // updated data-tai return korbe ebong validation check korbe
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Profile updated successfully! 🎉", 
        data: updatedUser 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Update API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error!" },
      { status: 500 }
    );
  }
}