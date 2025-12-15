import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Blog title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, "Excerpt is required"],
    trim: true,
    maxlength: [300, "Excerpt cannot exceed 300 characters"]
  },
  content: {
    type: String,
    required: [true, "Content is required"]
  },
  featuredImage: {
    type: String,
    required: [true, "Featured image is required"],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    enum: ["Technology", "Fashion", "Lifestyle", "Health", "Business", "Other"],
    default: "Other"
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  seoTitle: {
    type: String,
    trim: true
  },
  seoDescription: {
    type: String,
    trim: true
  },
  seoKeywords: [{
    type: String,
    trim: true
  }],
  featuredInSlider: {
    type: Boolean,
    default: false
  },
  sliderOrder: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metaData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted date
blogSchema.virtual("formattedDate").get(function() {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(this.publishedAt || this.createdAt);
});

// Pre-save middleware to generate slug
blogSchema.pre("save", function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/gi, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  }
  
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  if (this.isPublished) {
    this.status = "published";
  }
  
  next();
});

// Indexes for efficient queries
blogSchema.index({ slug: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ featuredInSlider: 1, sliderOrder: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ isActive: 1 });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;