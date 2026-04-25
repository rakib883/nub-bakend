import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  lastStudyLevel: { type: String, required: true },
  address: { type: String, required: true },
  purchaseCourse: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  cashPaid: { type: Number, required: true },
  dueAmount: { type: Number, required: true },
  admissionDate: { type: Date, default: Date.now }
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);