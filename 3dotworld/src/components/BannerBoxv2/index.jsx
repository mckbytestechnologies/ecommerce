/* BannerBoxv2.jsx */
import React from "react";

const BannerBoxv2 = () => {
  const miniBanners = [
    {
      title: "Buy Men's Footwear",
      price: "₹500",
      imageUrl: "https://serviceapi.spicezgold.com/download/1741664665391_1741497254110_New_Project_50.jpg",
    },
    {
      title: "Buy Apple iPhone",
      price: "₹75,000",
      imageUrl: "https://serviceapi.spicezgold.com/download/1757183705017_1737020250515_New_Project_47.jpg",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {miniBanners.map((banner, index) => (
        <div key={index} className="relative w-full h-40 rounded-xl overflow-hidden shadow-lg group cursor-pointer">
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
            <h3 className="text-white text-lg">{banner.title}</h3>
            <span className="text-yellow-400 text-xl font-bold">{banner.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerBoxv2;
