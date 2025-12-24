import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./swiper.css";
import { Pagination, Autoplay } from "swiper/modules";
import Bannerbox from "../BannerBox";

const AdsBannerSlider = ({ items = 3 }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API configuration
  const API_URL = "https://ecommerce-server-fhna.onrender.com/api/blogs";

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.success) {
          // Filter blogs that have images
          const blogsWithImages = data.data.filter(blog => blog.image);
          setBlogs(blogsWithImages);
        } else {
          setError(data.message || "Failed to load blogs");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Error loading blogs: " + err.message);
        // Fallback to static banners if API fails
        setBlogs([
          { _id: 1, title: "Fashion Trends 2024", image: "/ad_banner/banner1.jpg", category: "Fashion" },
          { _id: 2, title: "Tech Innovations", image: "/ad_banner/banner2.jpg", category: "Technology" },
          { _id: 3, title: "Healthy Lifestyle", image: "/ad_banner/banner3.jpg", category: "Health" },
          { _id: 4, title: "Business Insights", image: "/ad_banner/banner4.jpg", category: "Business" },
          { _id: 5, title: "Modern Design", image: "/ad_banner/banner5.jpg", category: "Lifestyle" },
          { _id: 6, title: "Creative Arts", image: "/ad_banner/banner6.jpg", category: "Other" },
          { _id: 7, title: "Travel Guide", image: "/ad_banner/banner7.jpg", category: "Lifestyle" },
          { _id: 8, title: "Food & Recipes", image: "/ad_banner/banner8.jpg", category: "Health" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Static fallback banners if no blogs with images are available
  const fallbackBanners = [
    "/ad_banner/banner1.jpg",
    "/ad_banner/banner2.jpg",
    "/ad_banner/banner3.jpg",
    "/ad_banner/banner4.jpg",
    "/ad_banner/banner5.jpg",
    "/ad_banner/banner6.jpg",
    "/ad_banner/banner7.jpg",
    "/ad_banner/banner8.jpg",
  ];

  // Determine which data to display
  const displayItems = blogs.length > 0 ? blogs : fallbackBanners.map((img, idx) => ({ 
    _id: idx + 1, 
    image: img, 
    title: `Featured Collection ${idx + 1}`,
    category: "Featured"
  }));

  if (loading) {
    return (
      <div className="w-full bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
              Featured Collections
            </h2>
            <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] bg-gray-200 animate-pulse rounded-none"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && blogs.length === 0) {
    console.warn(error);
  }

  return (
    <div className="w-full bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
            {blogs.length > 0 ? "Featured Blogs" : "Featured Collections"}
          </h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4"></div>
        </div>

        {/* Slider Container */}
        <div className="relative">
          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              el: '.custom-pagination',
              bulletClass: 'custom-bullet',
              bulletActiveClass: 'custom-bullet-active',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Pagination, Autoplay]}
            className="adsBannerSwiper"
            breakpoints={{
              320: {
                slidesPerView: 1.1,
                spaceBetween: 16
              },
              480: {
                slidesPerView: 1.5,
                spaceBetween: 20
              },
              640: {
                slidesPerView: 2.1,
                spaceBetween: 24
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 24
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32
              },
              1280: {
                slidesPerView: items,
                spaceBetween: 32
              },
              1536: {
                slidesPerView: Math.min(4, items),
                spaceBetween: 32
              }
            }}
            speed={800}
            loop={true}
            grabCursor={false}
            centeredSlides={false}
            slideToClickedSlide={false}
          >
            {displayItems.map((item) => (
              <SwiperSlide key={item._id}>
                <div className="h-full flex">
                  <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-none shadow-sm hover:shadow-md transition-all duration-500 group relative">
                    {/* Blog Image */}
                    <Bannerbox 
                      img={item.image} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Blog Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Category Badge */}
                    {item.category && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-800 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.category}
                      </div>
                    )}
                    
                    {/* Blog Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-white font-medium text-sm lg:text-base line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 pointer-events-none" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Minimal Pagination */}
          <div className="custom-pagination flex justify-center gap-1.5 mt-8 lg:mt-12 !relative" />
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 lg:mt-8">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{blogs.length > 0 ? "Explore featured blogs" : "Scroll to explore"}</span>
            <div className="w-12 h-px bg-gray-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-px bg-gray-500 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Error Message (Hidden but logged) */}
        {error && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Showing featured collections</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsBannerSlider;