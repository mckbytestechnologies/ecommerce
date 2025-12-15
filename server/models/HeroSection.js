import mongoose from "mongoose";

const heroSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Hero title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  subtitle: {
    type: String,
    required: [true, "Hero subtitle is required"],
    trim: true,
    maxlength: [500, "Subtitle cannot exceed 500 characters"]
  },
  backgroundImage: {
    type: String,
    required: [true, "Background image is required"],
    trim: true
  },
  buttonText: {
    type: String,
    default: "Get Started",
    trim: true,
    maxlength: [50, "Button text cannot exceed 50 characters"]
  },
  buttonLink: {
    type: String,
    default: "#",
    trim: true
  },
  displayOrder: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// Indexes
heroSectionSchema.index({ isActive: 1, displayOrder: 1 });
heroSectionSchema.index({ createdBy: 1 });

// Ensure isActive is always set
heroSectionSchema.pre('save', function(next) {
  if (this.isActive === undefined || this.isActive === null) {
    this.isActive = true;
  }
  if (!this.endDate || this.endDate === '') {
    this.endDate = null;
  }
  next();
});

// Virtual for checking if section is currently active
heroSectionSchema.virtual('isCurrentlyActive').get(function() {
  if (!this.isActive) return false;
  
  const now = new Date();
  if (this.endDate && new Date(this.endDate) < now) {
    return false;
  }
  
  return true;
});

const HeroSection = mongoose.model("HeroSection", heroSectionSchema);
export default HeroSection;