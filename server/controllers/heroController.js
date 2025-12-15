import HeroSection from "../models/HeroSection.js";
import asyncHandler from "express-async-handler";
import { uploadImage } from "../Utilis/uploadHelper.js";

// @desc    Get all hero sections (admin only)
// @route   GET /api/hero
// @access  Private/Admin
export const getAllHeroSections = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [heroSections, total] = await Promise.all([
    HeroSection.find()
      .populate("createdBy", "name email")
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    HeroSection.countDocuments()
  ]);

  res.json({
    success: true,
    count: heroSections.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: heroSections
  });
});

// @desc    Get active hero sections for frontend - FIXED VERSION
// @route   GET /api/hero/active
// @access  Public
export const getActiveHeroSections = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date();
    
    console.log('Fetching active hero sections at:', currentDate);
    
    // SIMPLE AND RELIABLE QUERY
    const heroSections = await HeroSection.find({
      isActive: true
    })
    .select("title subtitle backgroundImage buttonText buttonLink displayOrder isActive endDate")
    .sort({ displayOrder: 1 })
    .lean(); // Convert to plain JS objects
    
    console.log(`Found ${heroSections.length} active sections before date filter`);
    
    // Filter out sections with expired endDate (done in JavaScript for clarity)
    const filteredSections = heroSections.filter(section => {
      if (!section.isActive) return false;
      
      if (section.endDate) {
        const endDate = new Date(section.endDate);
        if (endDate < currentDate) {
          console.log(`Section "${section.title}" expired on ${endDate}`);
          return false;
        }
      }
      
      return true;
    });
    
    console.log(`Returning ${filteredSections.length} sections after date filter`);
    
    // Remove internal fields before sending to frontend
    const publicSections = filteredSections.map(section => ({
      title: section.title,
      subtitle: section.subtitle,
      backgroundImage: section.backgroundImage,
      buttonText: section.buttonText,
      buttonLink: section.buttonLink,
      displayOrder: section.displayOrder
    }));
    
    // If no sections, create a default one
    if (publicSections.length === 0) {
      console.log('No active sections found, creating default');
      publicSections.push({
        title: "Welcome to Our Website",
        subtitle: "Add your first hero section in the admin panel",
        backgroundImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80",
        buttonText: "Go to Admin",
        buttonLink: "admin.html",
        displayOrder: 1
      });
    }
    
    res.json({
      success: true,
      count: publicSections.length,
      data: publicSections,
      timestamp: currentDate.toISOString()
    });
    
  } catch (error) {
    console.error('Error in getActiveHeroSections:', error);
    
    // Fallback: return sample data if everything fails
    res.json({
      success: true,
      count: 2,
      data: [
        {
          title: "Welcome to Our Website",
          subtitle: "Hero slider is working! Add your content in admin panel.",
          backgroundImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80",
          buttonText: "Go to Admin",
          buttonLink: "admin.html",
          displayOrder: 1
        },
        {
          title: "Amazing Products",
          subtitle: "Discover our collection of premium items",
          backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
          buttonText: "Shop Now",
          buttonLink: "#",
          displayOrder: 2
        }
      ],
      note: "Using fallback data due to error: " + error.message
    });
  }
});

// @desc    DEBUG: Get all hero sections with full details
// @route   GET /api/hero/debug
// @access  Public
export const debugHeroSections = asyncHandler(async (req, res) => {
  const allSections = await HeroSection.find()
    .select("title subtitle backgroundImage buttonText buttonLink displayOrder isActive endDate createdAt")
    .sort({ createdAt: -1 })
    .lean();
    
  const currentDate = new Date();
  
  const sectionsWithStatus = allSections.map(section => ({
    ...section,
    isCurrentlyActive: section.isActive && 
      (!section.endDate || new Date(section.endDate) >= currentDate),
    endDateFormatted: section.endDate ? new Date(section.endDate).toISOString() : null,
    createdAtFormatted: new Date(section.createdAt).toISOString()
  }));
  
  res.json({
    success: true,
    count: allSections.length,
    currentDate: currentDate.toISOString(),
    data: sectionsWithStatus,
    summary: {
      total: allSections.length,
      active: sectionsWithStatus.filter(s => s.isActive).length,
      currentlyActive: sectionsWithStatus.filter(s => s.isCurrentlyActive).length,
      hasEndDate: sectionsWithStatus.filter(s => s.endDate).length
    }
  });
});

// @desc    Create new hero section
// @route   POST /api/hero
// @access  Private/Admin
export const createHeroSection = asyncHandler(async (req, res) => {
  const {
    title,
    subtitle,
    backgroundImage,
    buttonText,
    buttonLink,
    displayOrder,
    isActive,
    endDate
  } = req.body;

  // Validate required fields
  if (!title || !subtitle) {
    res.status(400);
    throw new Error("Title and subtitle are required");
  }

  // Handle image upload if file is present
  let imageUrl = backgroundImage;
  if (req.file) {
    try {
      const uploadResult = await uploadImage(req.file, "hero-images");
      imageUrl = uploadResult.url;
    } catch (error) {
      res.status(400);
      throw new Error("Failed to upload image: " + error.message);
    }
  }

  // If no image provided
  if (!imageUrl) {
    res.status(400);
    throw new Error("Background image is required");
  }

  const heroSection = await HeroSection.create({
    title,
    subtitle,
    backgroundImage: imageUrl,
    buttonText: buttonText || "Get Started",
    buttonLink: buttonLink || "#",
    displayOrder: displayOrder || 0,
    isActive: isActive !== undefined ? isActive : true,
    endDate: endDate ? new Date(endDate) : null,
    createdBy: req.user._id
  });

  const populatedHero = await HeroSection.findById(heroSection._id)
    .populate("createdBy", "name email");

  console.log(`Created new hero section: ${heroSection.title}, Active: ${heroSection.isActive}`);

  res.status(201).json({
    success: true,
    message: "Hero section created successfully",
    data: populatedHero
  });
});

// @desc    Update hero section
// @route   PUT /api/hero/:id
// @access  Private/Admin
export const updateHeroSection = asyncHandler(async (req, res) => {
  const heroSection = await HeroSection.findById(req.params.id);

  if (!heroSection) {
    res.status(404);
    throw new Error("Hero section not found");
  }

  // Handle image upload if new file is present
  let imageUrl = req.body.backgroundImage || heroSection.backgroundImage;
  if (req.file) {
    try {
      const uploadResult = await uploadImage(req.file, "hero-images");
      imageUrl = uploadResult.url;
    } catch (error) {
      res.status(400);
      throw new Error("Failed to upload image: " + error.message);
    }
  }

  // Update fields
  const updates = {};
  const fields = ["title", "subtitle", "buttonText", "buttonLink", "displayOrder", "isActive", "endDate"];
  
  fields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  updates.backgroundImage = imageUrl;
  
  // Ensure isActive is boolean
  if (updates.isActive !== undefined) {
    updates.isActive = Boolean(updates.isActive);
  }
  
  // Handle endDate
  if (updates.endDate === '' || updates.endDate === null) {
    updates.endDate = null;
  } else if (updates.endDate) {
    updates.endDate = new Date(updates.endDate);
  }

  const updatedHero = await HeroSection.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate("createdBy", "name email");

  console.log(`Updated hero section: ${updatedHero.title}, Active: ${updatedHero.isActive}`);

  res.json({
    success: true,
    message: "Hero section updated successfully",
    data: updatedHero
  });
});

// @desc    Delete hero section
// @route   DELETE /api/hero/:id
// @access  Private/Admin
export const deleteHeroSection = asyncHandler(async (req, res) => {
  const heroSection = await HeroSection.findById(req.params.id);

  if (!heroSection) {
    res.status(404);
    throw new Error("Hero section not found");
  }

  await heroSection.deleteOne();

  res.json({
    success: true,
    message: "Hero section deleted successfully"
  });
});

// @desc    Reorder hero sections
// @route   PUT /api/hero/reorder
// @access  Private/Admin
export const reorderHeroSections = asyncHandler(async (req, res) => {
  const { order } = req.body;

  if (!Array.isArray(order)) {
    res.status(400);
    throw new Error("Order array is required");
  }

  const bulkOps = order.map((item, index) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { displayOrder: index }
    }
  }));

  await HeroSection.bulkWrite(bulkOps);

  res.json({
    success: true,
    message: "Hero sections reordered successfully"
  });
});