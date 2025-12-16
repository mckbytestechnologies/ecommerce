// Bannerbox.jsx
import React from "react";

const Bannerbox = ({ img, className = "", blog = null }) => {
  // If blog object is provided, use blog data
  if (blog) {
    return (
      <div className={`relative ${className}`}>
        <img 
          src={blog.image} 
          alt={blog.title || "Blog image"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder-image.jpg"; // Fallback image
          }}
        />
        {/* You can add blog-specific content here */}
      </div>
    );
  }

  // Original behavior for simple images
  return (
    <img 
      src={img} 
      alt="Banner"
      className={`w-full h-full object-cover ${className}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/placeholder-image.jpg";
      }}
    />
  );
};

export default Bannerbox;