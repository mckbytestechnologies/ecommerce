import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import routes from "./routes/index.js";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", routes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    error: true,
    success: false,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  // Multer errors
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File too large. Maximum size is 5MB.",
      error: true,
      success: false,
    });
  }

  if (error.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      message: "Too many files. Maximum is 5 files.",
      error: true,
      success: false,
    });
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      message: "Unexpected field",
      error: true,
      success: false,
    });
  }

  // Default error
  res.status(500).json({
    message: error.message || "Internal server error",
    error: true,
    success: false,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});