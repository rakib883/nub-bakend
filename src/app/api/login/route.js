import { cookies } from "next/headers";
import { connect } from "@/lib/db";
import Register from "@/models/Register";

export async function POST(req) {
  try {
    await connect();
    const { email, password } = await req.json();

    const user = await Register.findOne({ email });

    if (!user || user.password !== password) {
      return Response.json({ success: false, message: "Invalid credentials! ❌" }, { status: 401 });
    }

    // Direct Cookie Set
    const cookieStore = await cookies();
    cookieStore.set("isLoggedIn", "true", {
      httpOnly: true, 
      secure: false,  
      maxAge: 60 * 60 * 24, 
      path: "/",
    });

    // ✅ Ekhane success response er sathe user email ta pathiye dilam
    return Response.json({ 
      success: true, 
      message: "Login Successful! 🚀",
      user: {
        email: user.email,
        // name: user.name // Jodi database e name thake shetao dite paro
      }
    });

  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

























// import { connect } from "@/lib/db";
// import Register from "@/models/Register";

// export async function POST(req) {
//   try {
//     await connect();
//     const { email, password } = await req.json();

//     // 1. Email check kora database-e
//     const user = await Register.findOne({ email });

//     if (!user) {
//       return Response.json({ success: false, message: "User not found! ❌" }, { status: 404 });
//     }

//     // 2. Password match kora
//     // Note: Database-e password plain text thakle eivabe kaj korbe
//     if (user.password !== password) {
//       return Response.json({ success: false, message: "Invalid password! ❌" }, { status: 401 });
//     }

//     // Login successful
//     return Response.json({
//       success: true,
//       message: "Welcome back! 🚀",
//       user: { email: user.email, role: user.role }
//     });

//   } catch (error) {
//     return Response.json({ success: false, message: error.message }, { status: 500 });
//   }
// }