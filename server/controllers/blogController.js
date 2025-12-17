// controllers/blogController.js - COMPLETE WORKING VERSION
import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get full image URL
const getFullImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// Create blog with image upload - SIMPLIFIED
export const createBlog = asyncHandler(async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    // Validation
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and category are required"
      });
    }

    console.log("📝 Creating blog with data:", {
      title,
      category,
      file: req.file ? `File: ${req.file.filename}` : "No file"
    });

    let imageUrl = null;
    
    // Handle image upload
    if (req.file) {
      console.log("📁 File details:", {
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
      
      // Store full URL for easy access
      imageUrl = getFullImageUrl(req, req.file.filename);
      console.log("🖼️ Image URL:", imageUrl);
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      image: imageUrl, // Store as simple string URL
      author: req.user._id
    });

    console.log("✅ Blog created successfully:", blog._id);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog
    });
  } catch (error) {
    console.error("❌ Create blog error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create blog"
    });
  }
});

// Get all blogs
export const getBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`📚 Found ${blogs.length} blogs`);
    
    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error("❌ Get blogs error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single blog
export const getBlogById = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error("❌ Get blog by id error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update blog
export const updateBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    console.log("🔄 Updating blog:", req.params.id);
    
    // Handle image update
    let updateData = { ...req.body };
    
    if (req.file) {
      console.log("📁 New file uploaded:", req.file.filename);
      updateData.image = getFullImageUrl(req, req.file.filename);
    } else if (req.body.removeImage === 'true') {
      updateData.image = null;
    }
    
    // Remove the removeImage field from update data
    delete updateData.removeImage;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    console.log("✅ Blog updated successfully");

    res.json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog
    });
  } catch (error) {
    console.error("❌ Update blog error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete blog
export const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    await blog.deleteOne();
    
    console.log("🗑️ Blog deleted:", req.params.id);

    res.json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    console.error("❌ Delete blog error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get blog by slug (optional)
export const getBlogBySlug = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error("❌ Get blog by slug error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});