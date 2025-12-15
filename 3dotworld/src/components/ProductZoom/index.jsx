import React, { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductZoom = () => {
  const product = {
    name: "Premium Wireless Headphones",
    brand: "SoundMax",
    price: 199.99,
    rating: 4.5,
    reviews: [
      {
        name: "Rohit Sharma",
        rating: 5,
        comment: "Amazing sound quality and very comfortable to wear!",
      },
      {
        name: "Anita Verma",
        rating: 4,
        comment: "Battery life is great, but ear cushions could be softer.",
      },
      {
        name: "John Doe",
        rating: 5,
        comment: "Noise cancellation works really well in crowded places.",
      },
    ],
    description:
      "Experience crystal-clear sound with deep bass and advanced noise cancellation technology. Designed for professionals and music enthusiasts. Wireless freedom with 20 hours of battery life and a comfortable fit for all-day use.",
    highlights: [
      "Wireless with up to 20 hours of battery life",
      "Noise cancellation with ambient mode",
      "Comfort-fit ear cushions",
      "1-year warranty included",
    ],
    images: [
      "https://i.pinimg.com/1200x/58/e7/be/58e7be9ae1415500b933214bd8d6b9fc.jpg",
      "https://i.pinimg.com/1200x/1b/b2/f7/1bb2f753ff2b8632a863e6060e86f851.jpg",
      "https://i.pinimg.com/736x/12/ac/48/12ac48e8963393fdb198358fbc4d8cbd.jpg",
    ],
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT SECTION - IMAGES */}
      <div className="flex gap-4">
        {/* Thumbnails */}
        <div className="flex flex-col gap-3">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Thumbnail"
              className={`w-20 h-20 object-cover rounded-md cursor-pointer border 
                ${selectedImage === img ? "border-orange-500" : "border-gray-300"}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>

        {/* Main Zoom Image */}
        <div className="flex-1">
          <Zoom>
            <img
              src={selectedImage}
              alt={product.name}
              className="rounded-lg w-full max-h-[450px] object-cover shadow-md cursor-zoom-in"
            />
          </Zoom>
        </div>
      </div>

      {/* RIGHT SECTION – PRODUCT DETAILS */}
      <div>
        <h2 className="text-sm text-gray-500 uppercase tracking-wide">
          {product.brand}
        </h2>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400 text-lg">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>
                {i < Math.round(product.rating) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <span className="ml-2 text-gray-600 text-sm">
            {product.rating} / 5 ({product.reviews.length} reviews)
          </span>
        </div>

        {/* Price */}
        <p className="text-orange-600 text-3xl font-semibold mt-4">
          ₹{product.price}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-orange-600 shadow-md transition">
            Add to Cart
          </button>
          <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-300 transition">
            Buy Now
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-4 py-2 font-medium ${
                activeTab === "description"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-600"
              }`}
            >
              Description
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 font-medium ${
                activeTab === "reviews"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-600"
              }`}
            >
              Reviews
            </button>
          </div>

          {/* Description Tab */}
          {activeTab === "description" && (
            <div className="mt-4">
              <p className="text-gray-700">{product.description}</p>

              <h3 className="font-semibold mt-6 mb-2">Highlights:</h3>
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {product.highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="mt-4 space-y-4">
              {product.reviews.map((review, i) => (
                <div key={i} className="border p-4 rounded-md bg-gray-50 shadow-sm">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <span className="text-yellow-400">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductZoom;
