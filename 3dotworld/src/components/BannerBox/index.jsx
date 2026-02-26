import React, { useState, useEffect } from "react";

const API_BASE = "https://server-kzwj.onrender.com";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop";

// Helper function to get correct image URL
const getImageUrl = (image) => {
  if (!image || image === null || image === "null") {
    return PLACEHOLDER;
  }

  if (typeof image === "string" && image.startsWith("http")) {
    return image;
  }

  if (typeof image === "object" && image.url) {
    if (image.url.startsWith("/uploads")) {
      return `${API_BASE}${image.url}`;
    }
    return image.url;
  }

  if (typeof image === "string" && image.startsWith("/uploads")) {
    return `${API_BASE}${image}`;
  }

  if (
    typeof image === "string" &&
    !image.includes("/") &&
    image.includes(".")
  ) {
    return `${API_BASE}/uploads/${image}`;
  }

  return PLACEHOLDER;
};

const Bannerbox = ({ img, className = "", blog = null }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const finalImage = blog
      ? getImageUrl(blog.image)
      : img
      ? getImageUrl(img)
      : PLACEHOLDER;

    setImageSrc(finalImage);
    setHasError(false);
  }, [blog, img]);

  const handleError = () => {
    setHasError(true);
  };

  if (!imageSrc) return null; // prevent rendering empty src

  return (
    <div className={`relative ${className}`}>
      <img
        src={hasError ? PLACEHOLDER : imageSrc}
        alt={blog?.title || "Banner"}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={handleError}
      />

      {blog && (
        <div className="absolute bottom-4 left-4 bg-black/60 text-white p-3 rounded-lg max-w-md">
          <h3 className="text-xl font-bold">{blog.title}</h3>
          <p className="text-sm mt-1">
            {blog.category} •{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Bannerbox;