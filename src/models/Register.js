import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      required: true,
      // Frontend-er lowercase value-er sathe match kora hoyeche
      enum: ["admin", "mgmt", "accounts", "hr", "instructor"],
      default: "admin",
    },
  },
  { timestamps: true }
);

// Model export (Next.js cache friendly)
const Register = mongoose.models.Register || mongoose.model("Register", RegisterSchema);
export default Register;