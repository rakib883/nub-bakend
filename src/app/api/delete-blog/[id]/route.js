import { NextResponse } from "next/server";
import Post from "@/models/Post";
import { connect } from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    await connect();
    
    // ✅ Next.js 15 এ params কে await করতে হয়
    const { id } = await params; 

    if (!id) {
      return NextResponse.json({ success: false, message: "ID পাওয়া যায়নি" }, { status: 400 });
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ 
        success: false, 
        message: "এই আইডি দিয়ে কোনো ব্লগ পাওয়া যায়নি!" 
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