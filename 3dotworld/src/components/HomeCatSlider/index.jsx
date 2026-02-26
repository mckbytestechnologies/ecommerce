import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from "swiper/modules";
import axios from 'axios';

const HomeCatSlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        console.log("Categories API Response:", res.data);
        // Assuming API returns { data: [...] }
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Default placeholder image if category image is not available
  const getCategoryImage = (category) => {
    if (category.image?.url) {
      return category.image.url;
    }
    
    // You can set default images based on category name
    const defaultImages = {
      'Mobiles': '/homecat/phone.jpg',
      'Laptops': '/homecat/laptop.jpg',
      'Mens Fashion': '/homecat/men.jpg',
      'Womens Fashion': '/homecat/women.jpg',
      'Kids Fashion': '/homecat/kids.jpg',
      'Footwear': '/homecat/shoe.jpg',
      'Beauty': '/homecat/beauty.jpg',
      'Furniture': '/homecat/furniteris.jpg',
      'Kitchen & Dining': '/homecat/dining.jpg',
      'Appliances': '/homecat/Appliances (TV, Refrigerator, AC, Washing Machine).jpg',
      'Sports & Fitness': '/homecat/Sports & Fitness.jpg',
      'Books & Stationery': '/homecat/Books & Stationery.jpg',
      'Toys & Baby Products': '/homecat/toy.jpg',
      'Watches': '/homecat/watch.jpg',
      'Jewelry': '/homecat/jellwary.jpg'
    };
    
    return defaultImages[category.name] || '/homecat/default.jpg';
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="homeCatSlider mt-10">
        <div className="containers">
          <Swiper
            spaceBetween={15}
            modules={[Navigation]}
            className="mySwiper"
            grabCursor={false}
            breakpoints={{
              0: { slidesPerView: 2 },
              480: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 7 },
            }}
          >
            {[...Array(8)].map((_, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-40 rounded-lg overflow-hidden shadow-md bg-gray-200 animate-pulse">
                  <div className="w-full h-full"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    );
  }

  return (
    <div className="homeCatSlider mt-10">
      <div className="containers">
        {categories.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          <Swiper
            spaceBetween={15}
            modules={[Navigation]}
            className="mySwiper"
            grabCursor={false}
            breakpoints={{
              0: { slidesPerView: 2 },
              480: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 7 },
            }}
          >
            {categories.map((category) => (
              <SwiperSlide key={category._id}>
                <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md cursor-pointer">
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/homecat/default.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <h3 className="absolute bottom-2 left-2 text-white text-sm md:text-base font-semibold tracking-wide group-hover:text-gray-300 transition">
                    {category.name}
                  </h3>
                  
                  {/* Optional: Category product count */}
                  {category.productCount && (
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {category.productCount}+
                    </span>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default HomeCatSlider;