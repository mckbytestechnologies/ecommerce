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
            e.target.src = "https://www.portronics.com/cdn/shop/articles/Massage_Guns_for_Runners_The_Secret_to_Faster_Recovery_Stronger_Muscles.png?v=1761811828&width=533";
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
        e.target.src = "https://www.portronics.com/cdn/shop/articles/Massage_Guns_for_Runners_The_Secret_to_Faster_Recovery_Stronger_Muscles.png?v=1761811828&width=533";
      }}
    />
  );
};

export default Bannerbox;
