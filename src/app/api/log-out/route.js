import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Login korar somoy je namer cookie set korechhilo (dhore nichhi 'isLoggedIn')
    cookieStore.delete("isLoggedIn");
    console.log("done")

    return Response.json({
      success: true,
      message: "Logged out successfully! 👋"
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      message: "Error during logout" 
    }, { status: 500 });
  }
}