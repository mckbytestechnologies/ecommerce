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
import mongoose from 'mongoose';

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
import warrantyRoutes from "./routes/warrantyRoutes.js";

// Initialize environment
dotenv.config();

// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==================== PRODUCTION OPTIMIZATIONS ====================

// 1. Connection pooling and keep-alive
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 30000);

// 2. Trust proxy (important for Render)
app.set('trust proxy', 1);

// 3. Disable in production logs
if (process.env.NODE_ENV === 'production') {
  console.log = function() {}; // Disable console.log in production
  console.debug = function() {};
}

// 4. Optimize JSON parsing
app.use(express.json({ 
  limit: "5mb", // Reduced from 10mb
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// 5. Cookie parser with secure settings
app.use(cookieParser(process.env.COOKIE_SECRET));

// 6. Compression with optimal settings
app.use(compression({
  level: 6, // Balanced compression
  threshold: 1024, // Compress responses > 1kb
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// 7. Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// 8. Production-ready rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 1000, // Stricter in production
  message: {
    success: false,
    error: true,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health' || req.path === '/';
  }
});

// Apply rate limiting to API routes only
app.use("/api", limiter);

// 9. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://3dotworld.mckbytes.in',
  'https://admin-c26e.onrender.com',
  
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || process.env.NODE_ENV !== 'production') return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 600 // Cache preflight requests for 10 minutes
}));

// Handle preflight requests efficiently
app.options('*', cors());

// 10. Conditional logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", {
    skip: (req, res) => res.statusCode < 400 // Log only errors in production
  }));
}

// ==================== STATIC FILES ====================

// Serve static files with caching
const staticOptions = {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: false,
  lastModified: true
};

app.use("/uploads", express.static(path.join(__dirname, "uploads"), staticOptions));
app.use("/hero-images", express.static(path.join(__dirname, "hero-images"), staticOptions));
app.use("/blog-images", express.static(path.join(__dirname, "blog-images"), staticOptions));

// Ensure directories exist
import fs from 'fs';
const directories = ['uploads', 'hero-images', 'blog-images'];
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// ==================== HEALTH CHECK ENDPOINTS ====================

// Lightweight health check for Render
app.get("/health", (req, res) => {
  res.status(200).send('OK');
});

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';
  
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbStatus,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-commerce API",
    version: "2.0.0",
    status: "operational"
  });
});

// ==================== API ROUTES ====================

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
app.use("/api/warranty", warrantyRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/blogs", blogRoutes);

// ==================== 404 HANDLER ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: true,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ==================== GLOBAL ERROR HANDLER ====================

app.use((error, req, res, next) => {
  // Log only in development or if it's a server error
  if (process.env.NODE_ENV === 'development' || error.statusCode >= 500) {
    console.error("❌ Error:", error.message);
  }

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
    return res.status(400).json({
      success: false,
      error: true,
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: true,
      message: "Authentication failed. Please login again.",
    });
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    error: true,
    message: process.env.NODE_ENV === 'production' && statusCode === 500 
      ? "Internal Server Error" 
      : message,
  });
});

// ==================== SERVER START ====================

const startServer = async () => {
  try {
    // Connect to database with optimized settings
    await connectDb();
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('HTTP server closed.');
      });

      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    };

    // Handle termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught errors
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      // Don't exit, just log
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      // Don't exit, just log
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
