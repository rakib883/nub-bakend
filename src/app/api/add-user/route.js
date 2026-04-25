import { connect } from "@/lib/db";
import Register from "@/models/Register";

// POST Request: Notun User Create Korar Jonno
export async function POST(req) {
  try {
    await connect();

    const body = await req.json();
    const { email, password, role } = body;

    // ১. Email check (User agei ache ki na)
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return Response.json({
        success: false,
        message: "E-mail already registered! ⚠️",
      }, { status: 400 });
    }

    // ২. Notun User Save kora
    const newUser = await Register.create({
      email,
      password, // Note: Real project-e ekhane bcrypt use kora bhalo
      role,
    });

    return Response.json({
      success: true,
      message: "User saved successfully! 🚀",
      data: newUser,
    });

  } catch (error) {
    return Response.json({
      success: false,
      message: error.message || "Internal Server Error ❌",
    }, { status: 500 });
  }
}

// GET Request: Sob User-der List Dekhar Jonno
export async function GET() {
  try {
    await connect();
    const users = await Register.find({}).sort({ createdAt: -1 });

    return Response.json({
      success: true,
      data: users,
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}