import React from "react";

const Bannerbox = ({ img, className = "" }) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <img
        src={img}
        alt="Promotional banner"
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/placeholder-banner.jpg';
        }}
      />
    </div>
  );
};

export default Bannerbox;