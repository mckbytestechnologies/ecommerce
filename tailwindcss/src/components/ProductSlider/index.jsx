import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import ProductItem from "../ProductItem";

const ProductSlider = () => {
  const products = [
    {
      imageFront: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg",
      imageBack: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
      category: "Headphones",
      title: "Sony WH-1000XM5 Noise Cancelling Headphones",
      rating: 5,
      oldPrice: 499.0,
      newPrice: 429.0,
    },
    {
    imageFront: "https://images.unsplash.com/photo-1728877055062-ddfa96a8fa25?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1728877055062-ddfa96a8fa25?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Sandals",
    title: "Birkenstock Arizona Soft Footbed Sandals",
    rating: 4,
    oldPrice: 139.0,
    newPrice: 109.0,
  },
    {
    // Diamond Rings
    imageFront: "https://images.unsplash.com/photo-1627293509201-cd0c780043e6?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1627293509201-cd0c780043e6?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Rings",
    title: "1.5 Carat Solitaire Diamond Ring (Platinum)",
    rating: 5,
    oldPrice: 4500.0,
    newPrice: 3999.0,
  },
  {
      imageFront: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Laptops",
      title: "Apple MacBook Pro M3 16” (2024)",
      rating: 5,
      oldPrice: 2499.0,
      newPrice: 2199.0,
    },
    {
    imageFront: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Chairs",
    title: "Ergonomic Office Chair with Lumbar Support",
    rating: 4,
    oldPrice: 299.0,
    newPrice: 249.0,
  },
   {
    imageFront: "https://images.unsplash.com/photo-1677326768050-7d437347ca70?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageBack: "https://images.unsplash.com/photo-1677326768050-7d437347ca70?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Leather Bags",
    title: "Fossil Haskell Leather Messenger Bag",
    rating: 5,
    oldPrice: 279.0,
    newPrice: 229.0,
  },
  {
      imageFront: "https://images.unsplash.com/photo-1621476737725-9530d664a0f4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://images.unsplash.com/photo-1621476737725-9530d664a0f4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Accessories",
      title: "Wireless Charging Pad Stand",
      rating: 3,
      oldPrice: 30.0,
      newPrice: 25.0,
    },
    {
      imageFront: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageBack: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Headphones",
      title: "Noise Cancelling Bluetooth Headphones",
      rating: 4,
      oldPrice: 80.0,
      newPrice: 70.0,
    },
  ];

  return (
    <div className="productslider py-8 bg-gray-50 rounded-xl shadow-lg">
      <Swiper
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        breakpoints={{
          0: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="mySwiper"
      >
        {products.map((product, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <ProductItem {...product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
