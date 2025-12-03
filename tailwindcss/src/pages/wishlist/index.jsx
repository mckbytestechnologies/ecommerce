import React from "react";
import { FaHeart } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";

const sampleWishlist = [
  {
    id: 1,
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 299,
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/02/52/adult-1868750_960_720.jpg",
  },
  {
    id: 2,
    title: "Apple Watch Series 9",
    price: 399,
    image:
      "https://cdn.pixabay.com/photo/2016/12/06/09/31/apple-watch-1885265_960_720.jpg",
  },
];

const Wishlist = () => {
  return (
    <div className="px-6 py-10 container mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Wishlist ❤️</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleWishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 border border-gray-200 relative"
          >
            {/* Heart Icon */}
            <div className="absolute top-4 right-4 text-red-500">
              <FaHeart size={22} />
            </div>

            {/* Image */}
            <div className="w-full h-48 flex items-center justify-center mb-4">
              <img src={item.image} alt={item.title} className="h-full object-contain rounded-xl" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
              {item.title}
            </h3>

            {/* Price */}
            <p className="text-xl font-bold text-blue-600 mb-4">${item.price}</p>

            {/* Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-all">
              <MdAddShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
