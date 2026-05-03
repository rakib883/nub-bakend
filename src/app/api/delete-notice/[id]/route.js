import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Notice from "@/models/Notice";


export async function DELETE(req, { params }) {
  try {
    await connect();
    
    // ✅ Next.js 15 এ params কে await করতে হয়
    const { id } = await params; 

    if (!id) {
      return NextResponse.json({ success: false, message: "ID পাওয়া যায়নি" }, { status: 400 });
    }

    const deletedPost = await Notice.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ 
        success: false, 
        message: "!" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Blog deleted successfully!" 
    }, { status: 200 });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}