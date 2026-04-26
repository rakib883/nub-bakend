import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Next.js-এর জন্য এই চেকটি খুবই জরুরি
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;