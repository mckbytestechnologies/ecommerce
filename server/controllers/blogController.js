import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";
import { uploadImage } from "../Utilis/uploadHelper.js";


// @desc    Get all blogs with filtering
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  // Build query
  let query = { isPublished: true };
  
  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // Filter by tag
  if (req.query.tag) {
    query.tags = req.query.tag;
  }
  
  // Search by keyword
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { excerpt: { $regex: req.query.search, $options: "i" } },
      { tags: { $regex: req.query.search, $options: "i" } }
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .populate("author", "name email avatar")
      .select("-content")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(query)
  ]);

  res.json({
    success: true,
    count: blogs.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: blogs
  });
});

// @desc    Get blogs for slider
// @route   GET /api/blogs/slider
// @access  Public
export const getBlogSlider = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const blogs = await Blog.find({
    isPublished: true,
    featuredInSlider: true
  })
  .populate("author", "name")
  .select("title excerpt featuredImage slug formattedDate readTime category")
  .sort({ sliderOrder: 1, publishedAt: -1 })
  .limit(limit);

  res.json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug })
    .populate("author", "name email bio avatar");

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Increment view count
  blog.views += 1;
  await blog.save();

  res.json({
    success: true,
    data: blog
  });
});

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    excerpt,
    content,
    category,
    tags,
    isPublished,
    featuredInSlider,
    sliderOrder,
    seoTitle,
    seoDescription,
    seoKeywords,
    readTime
  } = req.body;

  // Validate required fields
  if (!title || !excerpt || !content || !category) {
    res.status(400);
    throw new Error("Title, excerpt, content, and category are required");
  }

  // Handle image upload if file is present
  let imageUrl = req.body.featuredImage;
  if (req.file) {
    try {
      const uploadResult = await uploadImage(req.file, "blog-images");
      imageUrl = uploadResult.url;
    } catch (error) {
      res.status(400);
      throw new Error("Failed to upload image: " + error.message);
    }
  }

  if (!imageUrl) {
    res.status(400);
    throw new Error("Featured image is required");
  }

  // Process tags
  const processedTags = tags ? tags.split(",").map(tag => tag.trim()) : [];

  const blog = await Blog.create({
    title,
    excerpt,
    content,
    featuredImage: imageUrl,
    author: req.user._id,
    category,
    tags: processedTags,
    isPublished: isPublished || false,
    featuredInSlider: featuredInSlider || false,
    sliderOrder: sliderOrder || 0,
    seoTitle: seoTitle || title,
    seoDescription: seoDescription || excerpt.substring(0, 160),
    seoKeywords: seoKeywords ? seoKeywords.split(",").map(kw => kw.trim()) : [],
    readTime: readTime || 5
  });

  const populatedBlog = await Blog.findById(blog._id)
    .populate("author", "name email");

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: populatedBlog
  });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Handle image upload if new file is present
  let imageUrl = req.body.featuredImage || blog.featuredImage;
  if (req.file) {
    try {
      const uploadResult = await uploadImage(req.file, "blog-images");
      imageUrl = uploadResult.url;
    } catch (error) {
      res.status(400);
      throw new Error("Failed to upload image: " + error.message);
    }
  }

  // Update fields
  const updates = { ...req.body };
  
  // Process tags if provided
  if (req.body.tags) {
    updates.tags = req.body.tags.split(",").map(tag => tag.trim());
  }
  
  // Process SEO keywords if provided
  if (req.body.seoKeywords) {
    updates.seoKeywords = req.body.seoKeywords.split(",").map(kw => kw.trim());
  }
  
  updates.featuredImage = imageUrl;

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate("author", "name email");

  res.json({
    success: true,
    message: "Blog updated successfully",
    data: updatedBlog
  });
});

// @desc    Update blog slider status
// @route   PUT /api/blogs/:id/slider
// @access  Private/Admin
export const updateBlogSliderStatus = asyncHandler(async (req, res) => {
  const { featuredInSlider, sliderOrder } = req.body;
  
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  
  const updates = {};
  if (featuredInSlider !== undefined) updates.featuredInSlider = featuredInSlider;
  if (sliderOrder !== undefined) updates.sliderOrder = sliderOrder;
  
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true }
  );
  
  res.json({
    success: true,
    message: "Blog slider status updated",
    data: updatedBlog
  });
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  await blog.deleteOne();

  res.json({
    success: true,
    message: "Blog deleted successfully"
  });
});

// @desc    Get blog categories
// @route   GET /api/blogs/categories
// @access  Public
export const getBlogCategories = asyncHandler(async (req, res) => {
  const categories = await Blog.aggregate([
    { $match: { isPublished: true } },
    { $group: { 
      _id: "$category", 
      count: { $sum: 1 },
      latest: { $max: "$publishedAt" }
    }},
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: categories
  });
});

// @desc    Get popular tags
// @route   GET /api/blogs/tags/popular
// @access  Public
export const getPopularTags = asyncHandler(async (req, res) => {
  const tags = await Blog.aggregate([
    { $match: { isPublished: true } },
    { $unwind: "$tags" },
    { $group: { 
      _id: "$tags", 
      count: { $sum: 1 }
    }},
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]);

  res.json({
    success: true,
    data: tags
  });
});