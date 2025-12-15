// HomeSlider.js
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import only the necessary modules: Autoplay and EffectFade
import { Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles (keep these, but we override their look)
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

import './HomeSlider.css';

// Your backend API URL - update this to match your actual backend
const API_BASE = 'http://localhost:5000';
const HERO_API = `${API_BASE}/api/hero/active`;

const HomeSlider = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch slides (kept mostly the same for data fetching)
    const fetchSlides = async () => {
        try {
            setLoading(true);
            const response = await fetch(HERO_API, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data?.length > 0) {
                setSlides(result.data);
            } else {
                // Use fallback if API returns error or no data
                setSlides(getFallbackSlides());
                if (result.success === false) {
                    setError(result.message || 'Failed to load slides, using fallback.');
                }
            }
        } catch (error) {
            console.error('Error fetching slides from backend:', error);
            setError('Connection error, using fallback slides.');
            // Use fallback on error
            setSlides(getFallbackSlides());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    // Fallback slides in case backend is not available
    const getFallbackSlides = () => {
        // Updated fallback to use more modern/attractive images
        return [
            {
                _id: '1',
                title: "Exclusive Red Collection: 20% Off",
                subtitle: "Experience the passion of our curated red and white exclusive products. Limited stock available!",
                backgroundImage: "https://images.unsplash.com/photo-1542435503-921d58fb3e74?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                buttonText: "Shop The Red Drop",
                buttonLink: "/red-collection",
                displayOrder: 1,
                isActive: true,
                isFeatured: true
            },
            {
                _id: '2',
                title: "New White Tech Line Launched",
                subtitle: "Sleek design meets powerful performance. Explore the future of technology in pristine white.",
                backgroundImage: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                buttonText: "Explore White Tech",
                buttonLink: "/white-tech",
                displayOrder: 2,
                isActive: true,
                isFeatured: false
            },
            {
                _id: '3',
                title: "Free Shipping on All Orders Today!",
                subtitle: "A gift from us to you. No minimum purchase required, just for today.",
                backgroundImage: "https://images.unsplash.com/photo-1517649763962-e6210e309a7a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                buttonText: "Start Shopping",
                buttonLink: "/products",
                displayOrder: 3,
                isActive: true,
                isFeatured: true
            }
        ];
    };

    // --- State Handling (Kept as is for robustness) ---
    if (loading) {
        // ... (Loading state HTML remains the same)
        return (
            <div className="hero-slider-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading hero slider...</p>
                </div>
            </div>
        );
    }

    if (slides.length === 0) {
        // ... (Empty state HTML remains the same)
        return (
            <div className="hero-slider-empty">
                <div className="empty-content">
                    <i className="fas fa-images"></i>
                    <h3>No slides available</h3>
                    <p>Hero slider content will appear here when added</p>
                </div>
            </div>
        );
    }
    // --- End State Handling ---

    const sortedSlides = [...slides].sort((a, b) => a.displayOrder - b.displayOrder);

    return (
        <div className="home-hero-slider">
            {/* Display error message discreetly if using fallback */}
            {error && <div className="fallback-warning">{error}</div>}

            <Swiper
                // Only use Autoplay and EffectFade
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={true}
                speed={1000} // Slightly slower transition
                // Configuration for automatic sliding
                autoplay={{
                    delay: 5000, // 5 seconds per slide
                    disableOnInteraction: false, // Continue autoplay after user interaction
                    pauseOnMouseEnter: true, // Pause on hover for better UX
                }}
                className="hero-main-swiper"
            >
                {sortedSlides.map((slide) => (
                    <SwiperSlide key={slide._id}>
                        <div
                            className="hero-slide"
                            style={{ backgroundImage: `url('${slide.backgroundImage}')` }}
                        >
                            {/* Slightly lighter overlay to complement Red/White theme */}
                            <div className="slide-overlay"></div>

                            <div className="slide-content-container">
                                <div className="slide-content">
                                    {/* Featured badge in RED theme */}
                                    {slide.isFeatured && (
                                        <span className="featured-badge">
                                            <i className="fas fa-star"></i> Featured Deal
                                        </span>
                                    )}

                                    <h1 className="slide-title">{slide.title}</h1>
                                    <p className="slide-subtitle">{slide.subtitle}</p>

                                    {slide.buttonText && (
                                        <div className="slide-actions">
                                            {/* Primary Button in RED theme */}
                                            <a
                                                href={slide.buttonLink || '#'}
                                                className="btn-primary-slide"
                                                onClick={(e) => {
                                                    if (!slide.buttonLink || slide.buttonLink === '#') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                {slide.buttonText}
                                                <i className="fas fa-arrow-right"></i>
                                            </a>

                                            {/* Secondary Ghost Button in RED theme */}
                                            <a href="/products" className="btn-secondary-slide">
                                                <i className="fas fa-shopping-bag"></i>
                                                Browse All
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Navigation Arrows removed as per request, but a subtle progress bar is added */}
            </Swiper>
            
            {/* Global Progress Bar (Simplified and Red-Themed) */}
            <div className="swiper-progress-bar">
                {/* The progress-fill CSS is modified to use an animation for automatic progression */}
                <div className="progress-fill"></div>
            </div>

            
        </div>
    );
};

export default HomeSlider;