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
      enum: ["admin", "mgmt", "accounts", "hr", "instructor"],
      default: "admin",
    },

    // --- Ekhon egulo Database-e 'null' hoye joma hobe ---
    name: {
      type: String,
      default: null, 
    },
    profilePicture: {
      type: String,
      default: null, 
    },
    education: {
      type: String,
      default: null,
    },
    experience: {
      type: String,
      default: null,
    },
    course: {
      type: String,
      default: null,
    },
    lastEducation: {
      type: String,
      default: null,
    },
    summary: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Register = mongoose.models.Register || mongoose.model("Register", RegisterSchema);
export default Register;