// models/Blog.js - UPDATE THIS
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Technology", "Fashion", "Lifestyle", "Health", "Business", "Other"]
  },
  image: {
    public_id: String,
    url: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;