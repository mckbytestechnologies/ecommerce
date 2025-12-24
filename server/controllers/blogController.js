import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";

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

    console.log("📤 Request body:", req.body);
    console.log("📁 Request file:", req.file ? req.file.filename : "No file");

    // Handle image upload - STORE AS STRING ONLY
    let imageUrl = null;
    if (req.file) {
      console.log("✅ File uploaded:", {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      });
      
      // Store only the path as string
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      image: imageUrl, // String, not object
      author: req.user._id
    });

    console.log("✅ Blog created:", {
      id: blog._id,
      title: blog.title,
      image: blog.image
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog
    });
  } catch (error) {
    console.error("❌ Create blog error:", error);
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

    console.log("📝 Update request:", {
      body: req.body,
      file: req.file ? req.file.filename : "No file"
    });

    // Handle image update
    if (req.file) {
      console.log("🖼️ New image uploaded:", req.file.filename);
      req.body.image = `/uploads/${req.file.filename}`; // String, not object
    } else if (req.body.removeImage === 'true') {
      req.body.image = null;
    }

    // Remove the removeImage field
    if (req.body.removeImage) {
      delete req.body.removeImage;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    console.log("✅ Blog updated:", updatedBlog.title);

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