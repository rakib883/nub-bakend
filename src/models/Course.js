import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  price: { type: Number, required: true },
  instructorName: { type: String, required: true },
  instructorPicLink: { type: String, required: true },
  thumbnailLink: { type: String, required: true },
  duration: { type: String, default: "3 Months" },
  status: { type: String, enum: ["Upcoming", "Running"], default: "Upcoming" },
  upcomingDate: { type: String }, // Optional: Sudhu upcoming hole thakbe
  seats: { type: Number, required: true },
  description: { type: String },
  students: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);