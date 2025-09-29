import React from "react";

const BannerBoxv2 = () => {
  return (
    <>
      {/* Banner 1 */}
      <div className="BannerBoxv2 relative rounded-lg overflow-hidden shadow-lg group cursor-pointer">
        <img
          src="https://serviceapi.spicezgold.com/download/1741664665391_1741497254110_New_Project_50.jpg"
          className="w-full h-auto transform group-hover:scale-105 transition duration-500"
          alt="Men's Footwear"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-start justify-end p-5">
          <h3 className="text-white text-lg font-medium">
            Buy Men's Footwear with low price
          </h3>
          <span className="text-yellow-400 text-2xl font-bold">₹500</span>
        </div>
      </div>

      {/* Banner 2 */}
      <div className="BannerBoxv2 relative rounded-lg overflow-hidden shadow-lg group cursor-pointer mt-6">
        <img
          src="https://serviceapi.spicezgold.com/download/1757183705017_1737020250515_New_Project_47.jpg"
          className="w-full h-auto transform group-hover:scale-105 transition duration-500"
          alt="Apple iPhone"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-start justify-end p-5">
          <h3 className="text-white text-lg font-medium">Buy Apple iPhone</h3>
          <span className="text-red-400 text-2xl font-bold">₹75,000</span>
        </div>
      </div>
    </>
  );
};

export default BannerBoxv2;
