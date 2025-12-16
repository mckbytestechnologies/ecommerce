// Update your blog controller - FIXED VERSION:

import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create blog with image upload
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  
  if (!title || !content || !category) {
    return res.status(400).json({
      success: false,
      message: "Title, content, and category are required"
    });
  }

  // Handle image upload
  let imageData = null;
  if (req.file) {
    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Save file to uploads directory
    const fileName = Date.now() + '-' + req.file.originalname.replace(/\s+/g, '-');
    const uploadPath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(uploadPath, req.file.buffer);
    
    // Store as object to match your model
    imageData = {
      public_id: `uploads/${fileName}`,
      url: `/uploads/${fileName}`
    };
  }

  const blog = await Blog.create({
    title,
    content,
    category,
    image: imageData,
    author: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog
  });
});

// Get all blogs
export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

// Get single blog
export const getBlogById = asyncHandler(async (req, res) => {
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
});

// Update blog
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found"
    });
  }

  // Handle image update
  if (req.file) {
    // Delete old image if exists
    if (blog.image && blog.image.url) {
      try {
        const oldImagePath = path.join(__dirname, '..', blog.image.url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (error) {
        console.log("Error deleting old image:", error);
      }
    }
    
    // Save new image
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const fileName = Date.now() + '-' + req.file.originalname.replace(/\s+/g, '-');
    const uploadPath = path.join(uploadDir, fileName);
    fs.writeFileSync(uploadPath, req.file.buffer);
    
    req.body.image = {
      public_id: `uploads/${fileName}`,
      url: `/uploads/${fileName}`
    };
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('author', 'name email');

  res.json({
    success: true,
    message: "Blog updated successfully",
    data: updatedBlog
  });
});

// Delete blog
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found"
    });
  }

  // Delete image if exists
  if (blog.image && blog.image.url) {
    try {
      const imagePath = path.join(__dirname, '..', blog.image.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (error) {
      console.log("Error deleting image:", error);
    }
  }

  await blog.deleteOne();

  res.json({
    success: true,
    message: "Blog deleted successfully"
  });
});