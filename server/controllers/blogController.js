// controllers/blogController.js - UPDATED & SIMPLIFIED
import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create blog with image upload
export const createBlog = asyncHandler(async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and category are required"
      });
    }

    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request user:", req.user);

    // Handle image upload
    let imageData = null;
    if (req.file) {
      console.log("File received:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      // Create image data object matching your model
      imageData = {
        public_id: `blog-${Date.now()}`,
        url: `/uploads/${req.file.filename}`
      };
      console.log("Image data to save:", imageData);
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      image: imageData,
      author: req.user._id
    });

    console.log("Blog created:", blog);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all blogs
export const getBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    console.log("Blogs found:", blogs.length);
    
    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single blog
export const getBlogById = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    
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
    console.error("Get blog by id error:", error);
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

    console.log("Update request:", {
      body: req.body,
      file: req.file ? "File exists" : "No file"
    });

    // Handle image update
    if (req.file) {
      console.log("New file received:", req.file.filename);
      
      // Update image data
      req.body.image = {
        public_id: `blog-${Date.now()}`,
        url: `/uploads/${req.file.filename}`
      };
    } else if (req.body.removeImage === 'true') {
      // If removeImage flag is set
      req.body.image = null;
    }

    // Remove the removeImage field from body to prevent schema validation error
    if (req.body.removeImage) {
      delete req.body.removeImage;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    console.log("Blog updated:", updatedBlog);

    res.json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog
    });
  } catch (error) {
    console.error("Update blog error:", error);
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

    res.json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});