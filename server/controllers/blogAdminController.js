import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";
import { uploadImage } from "../Utilis/uploadHelper.js";
import slugify from "slugify";

// @desc    Get all blogs for admin (with filters)
// @route   GET /api/admin/blogs
// @access  Private/Admin
export const getAdminBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};

  // Filter by status
  if (req.query.status && req.query.status !== 'all') {
    query.status = req.query.status;
  }

  // Filter by category
  if (req.query.category && req.query.category !== 'all') {
    query.category = req.query.category;
  }

  // Search by keyword
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { excerpt: { $regex: req.query.search, $options: "i" } },
      { tags: { $regex: req.query.search, $options: "i" } },
      { slug: { $regex: req.query.search, $options: "i" } }
    ];
  }

  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(query)
  ]);

  // Get counts by status
  const draftCount = await Blog.countDocuments({ status: "draft" });
  const publishedCount = await Blog.countDocuments({ status: "published" });
  const archivedCount = await Blog.countDocuments({ status: "archived" });

  res.json({
    success: true,
    count: blogs.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    counts: {
      draft: draftCount,
      published: publishedCount,
      archived: archivedCount,
      total: total
    },
    data: blogs
  });
});

// @desc    Get blog by ID for admin
// @route   GET /api/admin/blogs/:id
// @access  Private/Admin
export const getAdminBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate("author", "name email avatar bio");

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.json({
    success: true,
    data: blog
  });
});

// @desc    Create new blog
// @route   POST /api/admin/blogs
// @access  Private/Admin
export const createAdminBlog = asyncHandler(async (req, res) => {
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
    readTime,
    status,
    metaData
  } = req.body;

  // Validate required fields
  if (!title || !excerpt || !content || !category) {
    res.status(400);
    throw new Error("Title, excerpt, content, and category are required");
  }

  // Generate slug from title
  const slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true
  });

  // Check if slug already exists
  const existingBlog = await Blog.findOne({ slug });
  if (existingBlog) {
    res.status(400);
    throw new Error("A blog with similar title already exists");
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
  const processedTags = tags ? tags.split(",").map(tag => tag.trim()).filter(tag => tag) : [];

  // Process SEO keywords
  const processedKeywords = seoKeywords ? seoKeywords.split(",").map(kw => kw.trim()).filter(kw => kw) : [];

  const blog = await Blog.create({
    title,
    slug,
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
    seoKeywords: processedKeywords,
    readTime: readTime || 5,
    status: status || "draft",
    metaData: metaData ? JSON.parse(metaData) : {},
    publishedAt: (isPublished || status === "published") ? new Date() : null
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
// @route   PUT /api/admin/blogs/:id
// @access  Private/Admin
export const updateAdminBlog = asyncHandler(async (req, res) => {
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

  // Update slug if title changed
  let slug = blog.slug;
  if (req.body.title && req.body.title !== blog.title) {
    slug = slugify(req.body.title, {
      lower: true,
      strict: true,
      trim: true
    });

    // Check if new slug already exists (excluding current blog)
    const existingBlog = await Blog.findOne({ slug, _id: { $ne: blog._id } });
    if (existingBlog) {
      res.status(400);
      throw new Error("A blog with similar title already exists");
    }
  }

  // Update fields
  const updates = { ...req.body };
  
  // Process tags if provided
  if (req.body.tags) {
    updates.tags = req.body.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
  }
  
  // Process SEO keywords if provided
  if (req.body.seoKeywords) {
    updates.seoKeywords = req.body.seoKeywords.split(",").map(kw => kw.trim()).filter(kw => kw);
  }

  // Handle publishedAt
  if (req.body.isPublished === true && !blog.isPublished) {
    updates.publishedAt = new Date();
    updates.status = "published";
  }

  if (req.body.status === "published" && blog.status !== "published") {
    updates.publishedAt = new Date();
    updates.isPublished = true;
  }

  // Parse metaData if provided
  if (req.body.metaData) {
    try {
      updates.metaData = JSON.parse(req.body.metaData);
    } catch (error) {
      updates.metaData = blog.metaData;
    }
  }

  updates.featuredImage = imageUrl;
  updates.slug = slug;

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

// @desc    Delete blog (soft delete)
// @route   DELETE /api/admin/blogs/:id
// @access  Private/Admin
export const deleteAdminBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Soft delete by updating status
  blog.status = "archived";
  blog.isActive = false;
  await blog.save();

  res.json({
    success: true,
    message: "Blog archived successfully",
    data: blog
  });
});

// @desc    Permanently delete blog
// @route   DELETE /api/admin/blogs/:id/permanent
// @access  Private/Admin
export const deleteAdminBlogPermanent = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  await blog.deleteOne();

  res.json({
    success: true,
    message: "Blog permanently deleted successfully"
  });
});

// @desc    Update blog status
// @route   PATCH /api/admin/blogs/:id/status
// @access  Private/Admin
export const updateBlogStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["draft", "published", "archived"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const updates = { status };

  if (status === "published" && blog.status !== "published") {
    updates.publishedAt = new Date();
    updates.isPublished = true;
  } else if (status !== "published") {
    updates.isPublished = false;
  }

  if (status === "archived") {
    updates.isActive = false;
  } else {
    updates.isActive = true;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true }
  );

  res.json({
    success: true,
    message: `Blog status updated to ${status}`,
    data: updatedBlog
  });
});

// @desc    Update blog slider status
// @route   PATCH /api/admin/blogs/:id/slider
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

// @desc    Bulk update blog status
// @route   PATCH /api/admin/blogs/bulk-status
// @access  Private/Admin
export const bulkUpdateBlogStatus = asyncHandler(async (req, res) => {
  const { blogIds, status } = req.body;

  if (!blogIds || !Array.isArray(blogIds) || blogIds.length === 0) {
    res.status(400);
    throw new Error("Blog IDs are required");
  }

  if (!["draft", "published", "archived"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const updates = { status };

  if (status === "published") {
    updates.publishedAt = new Date();
    updates.isPublished = true;
    updates.isActive = true;
  } else if (status !== "published") {
    updates.isPublished = false;
  }

  if (status === "archived") {
    updates.isActive = false;
  } else {
    updates.isActive = true;
  }

  const result = await Blog.updateMany(
    { _id: { $in: blogIds } },
    { $set: updates }
  );

  res.json({
    success: true,
    message: `${result.modifiedCount} blogs updated to ${status}`,
    modifiedCount: result.modifiedCount
  });
});

// @desc    Get blog statistics
// @route   GET /api/admin/blogs/stats
// @access  Private/Admin
export const getBlogStats = asyncHandler(async (req, res) => {
  const stats = await Blog.aggregate([
    {
      $group: {
        _id: null,
        totalBlogs: { $sum: 1 },
        totalViews: { $sum: "$views" },
        avgReadTime: { $avg: "$readTime" },
        publishedBlogs: {
          $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] }
        },
        draftBlogs: {
          $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] }
        },
        archivedBlogs: {
          $sum: { $cond: [{ $eq: ["$status", "archived"] }, 1, 0] }
        }
      }
    }
  ]);

  const categoryStats = await Blog.aggregate([
    { $group: { 
      _id: "$category", 
      count: { $sum: 1 },
      totalViews: { $sum: "$views" }
    }},
    { $sort: { count: -1 } }
  ]);

  const monthlyStats = await Blog.aggregate([
    {
      $match: {
        publishedAt: { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$publishedAt" },
          month: { $month: "$publishedAt" }
        },
        count: { $sum: 1 },
        totalViews: { $sum: "$views" }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 12 }
  ]);

  res.json({
    success: true,
    data: {
      overall: stats[0] || {},
      categories: categoryStats,
      monthly: monthlyStats
    }
  });
});