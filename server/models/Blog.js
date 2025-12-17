import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Technology", "Fashion", "Lifestyle", "Health", "Business", "Other"],
    default: "Other"
  },
  image: {
    type: String, // Store as simple string URL
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "published"
  }
}, {
  timestamps: true
});

// Create text index for searching
blogSchema.index({ title: 'text', content: 'text', category: 'text' });

export default mongoose.model('Blog', blogSchema);