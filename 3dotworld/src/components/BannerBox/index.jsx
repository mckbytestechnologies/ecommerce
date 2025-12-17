// Bannerbox.jsx
import React from "react";

const API_BASE = "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "/placeholder-image.jpg";
  if (image.startsWith("http")) return image;
  return `${API_BASE}/uploads/${image}`;
};

const Bannerbox = ({ img, className = "", blog = null }) => {
  // Blog mode
  if (blog) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={getImageUrl(blog.image)}
          alt={blog.title || "Blog image"}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            console.error("❌ Blog image failed:", blog.image);
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </div>
    );
  }

  // Normal banner mode
  return (
    <img
      src={getImageUrl(img)}
      alt="Banner"
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
      onError={(e) => {
        console.error("❌ Banner image failed:", img);
        e.target.src = "/placeholder-image.jpg";
      }}
    />
  );
};

export default Bannerbox;
