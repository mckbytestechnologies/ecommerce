import React, { useState, useEffect, useCallback } from 'react';

// Central data source
const BANNERS = [
    {
        id: 1,
        title: "The Ultimate Green T-Shirt Collection",
        subtitle: "Big Savings Day Sale: Up to 50% Off",
        price: "₹1,199.00",
        imageUrl: "https://serviceapi.spicezgold.com/download/1756273096312_1737036773579_sample-1.jpg",
        callToAction: "Shop Women's Wear",
    },
    {
        id: 2,
        title: "Apple iPhone 13 in Stunning Pink",
        subtitle: "Unbeatable Technology Mega Discount",
        price: "₹35,500.00",
        imageUrl: "https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg",
        callToAction: "Buy iPhone Now",
    },
    {
        id: 3,
        title: "Exclusive Summer Denim Jackets",
        subtitle: "Limited Stock | Upgrade Your Style",
        price: "₹3,499.00",
        imageUrl: "https://placehold.co/1920x1080/0f172a/ffffff?text=Denim+Fashion+Deal",
        callToAction: "View Denim Collection",
    },
    {
        id: 4,
        title: "Experience Entertainment in 4K",
        subtitle: "Smart TV: Cinematic Quality Guaranteed",
        price: "₹49,999.00",
        imageUrl: "https://placehold.co/1920x1080/470914/ffffff?text=4K+Smart+TV+Promo",
        callToAction: "Explore Electronics",
    },
];

const HomeSliderv2 = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = BANNERS.length;
    const slideDuration = 5000; // 5 seconds

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, [totalSlides]);

    // Auto-play effect
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, slideDuration);
        return () => clearInterval(timer);
    }, [nextSlide, slideDuration]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="w-full mx-auto font-sans">
            {/* The main container is now full width and uses a medium height banner */}
            <div className="relative w-full overflow-hidden shadow-2xl">
                {/* Responsive Height: h-[45vh] on mobile (less than 50vh), h-[400px] on desktop */}
                <div className="h-[45vh] md:h-[400px] relative">
                    
                    {BANNERS.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            {/* Background Image */}
                            <img
                                src={banner.imageUrl}
                                alt={banner.title}
                                className="w-full h-full object-cover transition-transform duration-1000"
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/1920x400/1e293b/ffffff?text=Full+Screen+Promo` }}
                            />
                            
                            {/* Dark Overlay for text contrast and premium feel */}
                            <div className="absolute inset-0 bg-black/40 backdrop-brightness-75"></div>
                            
                            {/* Content Block - Centered for Maximum Impact */}
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 sm:p-12">
                                
                                {/* Subtitle/Pre-Header */}
                                <span className="text-sm sm:text-lg font-medium tracking-widest uppercase text-red-300 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                                    {banner.subtitle}
                                </span>
                                
                                {/* Main Title */}
                                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-2 mb-3 leading-tight drop-shadow-lg max-w-4xl">
                                    {banner.title}
                                </h2>
                                
                                {/* Price/Offer */}
                                <h3 className="text-xl sm:text-2xl font-light text-white mb-6 flex items-center gap-3 justify-center">
                                    <span className="text-gray-300">Starting At</span>
                                    <span className="text-yellow-400 font-black text-3xl sm:text-4xl">{banner.price}</span>
                                </h3>
                                
                                {/* Call To Action Button */}
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-base sm:text-lg px-8 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-[1.05] transform uppercase tracking-wider"
                                    onClick={() => console.log(`Navigating to ${banner.title}`)}
                                >
                                    {banner.callToAction}
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
                        {BANNERS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${index === currentSlide ? 'bg-red-600 w-6' : 'bg-white/50 hover:bg-white'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSliderv2;
