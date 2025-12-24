
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import path from "path";
import { fileURLToPath } from 'url';
import connectDb from "./config/connectDb.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";


// Initialize environment
dotenv.config();

// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Debug middleware to log all requests (only in development)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

/*
// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: [
        "'self'", 
        "data:", 
        "https:", 
        "http:", 
        "blob:", 
        "https://ecommerce-server-fhna.onrender.com",
        "http://127.0.0.1:5000"],
    },
  },
}));
*/

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://ecommerce-server-fhna.onrender.com",
          "http://127.0.0.1:5000"
        ],
      },
    },
  })
);


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: {
    error: true,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Compression
app.use(compression());

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  exposedHeaders: ["Set-Cookie", "Authorization"]
}));

// Handle preflight requests
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Logging
app.use(morgan("dev"));

// Serve static files from multiple directories
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/hero-images", express.static(path.join(__dirname, "hero-images")));
app.use("/blog-images", express.static(path.join(__dirname, "blog-images")));

// Ensure directories exist
import fs from 'fs';
const directories = ['uploads', 'hero-images', 'blog-images'];
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-commerce API is running 🚀",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "2.0.0",
    features: [
      "Authentication & Authorization",
      "Product Management",
      "Order Processing",
      "Hero Section Management",
      "Blog Management",
      "Image Uploads",
      "Payment Integration"
    ],
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      products: "/api/products",
      categories: "/api/categories",
      orders: "/api/orders",
      cart: "/api/cart",
      hero: "/api/hero",
      blogs: "/api/blogs",
      reviews: "/api/reviews",
      wishlist: "/api/wishlist",
      payments: "/api/payments"
    }
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to E-commerce API with Hero & Blog Management",
    documentation: "Check /api/health for available endpoints",
    version: "2.0.0"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);

// NEW: Hero and Blog Routes
app.use("/api/hero", heroRoutes);
app.use("/api/blogs", blogRoutes);

// Test route for CORS
app.options("/api/auth/login", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: true,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      "/api/health",
      "/api/auth/register",
      "/api/auth/login", 
      "/api/auth/logout",
      "/api/auth/me",
      "/api/products",
      "/api/products/:id",
      "/api/categories",
      "/api/users",
      "/api/users/profile",
      "/api/orders",
      "/api/orders/myorders",
      "/api/cart",
      "/api/cart/my-cart",
      "/api/reviews",
      "/api/reviews/product/:productId",
      "/api/addresses",
      "/api/addresses/my-addresses",
      "/api/wishlist",
      "/api/wishlist/my-wishlist",
      "/api/coupons",
      "/api/coupons/validate",
      "/api/payments",
      "/api/payments/create-intent",
      "/api/hero",
      "/api/hero/active",
      "/api/hero/:id",
      "/api/blogs",
      "/api/blogs/slider",
      "/api/blogs/:slug",
      "/api/blogs/categories",
      "/api/blogs/tags/popular",
      // Blogs (Admin) ✅ ADD THESE
      "/api/admin/blogs",
      "/api/admin/blogs/stats",
      "/api/admin/blogs/:id",
      "/api/admin/blogs/:id/status",
      "/api/admin/blogs/bulk-status",
      "/api/admin/blogs/:id/slider"


    ],
    note: "Use GET /api/health for complete endpoint documentation"
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("❌ Error:", error.message);
  console.error("Stack:", error.stack);

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: true,
      message: "Validation Error",
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    return res.status(400).json({
      success: false,
      error: true,
      message: `Duplicate field value: ${field} '${value}' already exists`,
      field: field,
      value: value
    });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: true,
      message: "Invalid token. Please log in again.",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: true,
      message: "Token expired. Please log in again.",
    });
  }

  // CORS errors
  if (error.message && error.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: true,
      message: "CORS Error: " + error.message,
      allowedOrigins: allowedOrigins
    });
  }

  // File upload errors
  if (error.message && error.message.includes('File')) {
    return res.status(400).json({
      success: false,
      error: true,
      message: error.message,
    });
  }

  // Multer errors
  if (error.name === 'MulterError') {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'File too large. Maximum size is 10MB.',
      });
    }
    if (error.code === 'LIMIT_FILE_TYPE') {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid file type. Only images are allowed.',
      });
    }
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    error: true,
    message: message,
    ...(process.env.NODE_ENV === "development" && { 
      stack: error.stack,
      fullError: error.toString() 
    }),
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    await connectDb();
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log( );
      
      console.log(`🌐 Allowed Origins:`);
      allowedOrigins.forEach(origin => console.log(`   • ${origin}`));
      
      console.log(`
📋 API Endpoints Overview:
   • GET    /api/hero/active      - Get active hero sections
   • GET    /api/blogs/slider     - Get blogs for slider
   • POST   /api/hero             - Create hero section (Admin)
   • POST   /api/blogs            - Create blog (Admin)
      `);
    });

    // Handle graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      server.close(() => {
        console.log('💤 Server shut down gracefully.');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", err);
      // Don't exit in production, just log
      if (process.env.NODE_ENV === "production") {
        console.error("Continuing in production despite unhandled rejection");
      } else {
        server.close(() => {
          process.exit(1);
        });
      }
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};


// Start the server
startServer();

export default app;