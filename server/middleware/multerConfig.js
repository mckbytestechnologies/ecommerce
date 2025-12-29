// server/middleware/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const heroUploadDir = 'uploads/hero-images';
if (!fs.existsSync(heroUploadDir)) {
  fs.mkdirSync(heroUploadDir, { recursive: true });
}

// Configure storage for hero images
const heroStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, heroUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'hero-' + uniqueSuffix + ext);
  }
});

// File filter to accept only images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Create multer instance for hero images
const heroUpload = multer({
  storage: heroStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter
});

module.exports = {
  heroUpload
};