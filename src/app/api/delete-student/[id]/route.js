import { NextResponse } from "next/server";
import Student from "@/models/Student"; // Tomar Student model er path check koro
import { connect } from "@/lib/db";     // Database connection path check koro

export async function DELETE(req, { params }) {
  try {
    // 1. Database connection check
    await connect();

    // 2. Params theke ID extract kora (Next.js 15+ rules)
    const { id } = await params;

    console.log("----------------------------");
    console.log("DELETING STUDENT ID:", id); 
    console.log("----------------------------");

    // 3. ID jodi na thake
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID missing in request" }, 
        { status: 400 }
      );
    }

    // 4. Database theke delete kora
    const deletedStudent = await Student.findByIdAndDelete(id);

    // 5. Jodi student database-e na thake
    if (!deletedStudent) {
      return NextResponse.json(
        { success: false, message: "Student not found in database" }, 
        { status: 404 }
      );
    }

    // 6. Success Response
    return NextResponse.json(
      { success: true, message: "Student deleted successfully" }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete Error Log:", error.message);
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}