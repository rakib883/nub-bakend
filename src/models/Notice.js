import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a notice title"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// যদি মডেলটি আগে থেকে তৈরি থাকে তবে সেটি ব্যবহার করবে, নাহলে নতুন তৈরি করবে
export default mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);