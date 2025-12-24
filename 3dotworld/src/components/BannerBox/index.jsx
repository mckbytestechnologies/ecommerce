import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

// Helper function to get correct image URL
const getImageUrl = (image) => {
  console.log("🖼️ Processing image:", image);
  
  if (!image || image === null || image === 'null') {
    console.log("⚠️ No image provided, using placeholder");
    return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop";
  }
  
  // If it's already a full URL (including localhost)
  if (typeof image === 'string' && image.startsWith('http')) {
    console.log("✅ Already a full URL:", image);
    return image;
  }
  
  // If it's stored as an object (legacy format)
  if (typeof image === 'object' && image.url) {
    console.log("🔧 Object format detected:", image);
    if (image.url.startsWith('/uploads')) {
      return `${API_BASE}${image.url}`;
    }
    return image.url;
  }
  
  // If it's a relative path starting with /uploads
  if (typeof image === 'string' && image.startsWith('/uploads')) {
    console.log("📁 Relative path detected:", image);
    return `${API_BASE}${image}`;
  }
  
  // If it's just a filename (without /uploads prefix)
  if (typeof image === 'string' && !image.includes('/') && image.includes('.')) {
    console.log("📄 Filename detected:", image);
    return `${API_BASE}/uploads/${image}`;
  }
  
  // Default fallback
  console.log("❓ Unknown image format, using fallback");
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop";
};

const Bannerbox = ({ img, className = "", blog = null }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (blog) {
      setImageSrc(getImageUrl(blog.image));
    } else if (img) {
      setImageSrc(getImageUrl(img));
    } else {
      setImageSrc(getImageUrl(null));
    }
    setHasError(false);
  }, [blog, img]);

  const handleError = (e) => {
    console.error("❌ Image failed to load:", imageSrc);
    setHasError(true);
    e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop";
  };

  // Blog mode
  if (blog) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={hasError ? "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop" : imageSrc}
          alt={blog.title || "Blog image"}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={handleError}
        />
        <div className="absolute bottom-4 left-4 bg-black/60 text-white p-3 rounded-lg max-w-md">
          <h3 className="text-xl font-bold">{blog.title}</h3>
          <p className="text-sm mt-1">{blog.category} • {new Date(blog.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    );
  }

  // Normal banner mode
  return (
    <div className={`relative ${className}`}>
      <img
        src={hasError ? "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop" : imageSrc}
        alt="Banner"
        className="w-full h-full object-cover"
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
};

export default Bannerbox;