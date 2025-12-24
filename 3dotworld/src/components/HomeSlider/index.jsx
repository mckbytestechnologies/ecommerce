import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import './HomeSlider.css';

const API_BASE = 'https://ecommerce-server-fhna.onrender.com';
const HERO_API = `${API_BASE}/api/hero/active`;

const HomeSlider = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSlides = async () => {
        try {
            setLoading(true);
            const response = await fetch(HERO_API, {
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            if (result.success && result.data?.length > 0) {
                setSlides(result.data);
            } else {
                setSlides(getFallbackSlides());
                if (result.success === false) setError(result.message || 'Using fallback slides');
            }
        } catch (err) {
            console.error(err);
            setError('Connection error, using fallback slides');
            setSlides(getFallbackSlides());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSlides(); }, []);

    const getFallbackSlides = () => [
        {
            _id: '1',
            title: "Exclusive Red Collection: 20% Off",
            subtitle: "Experience the passion of our curated red and white exclusive products.",
            backgroundImage: "https://images.unsplash.com/photo-1542435503-921d58fb3e74?q=80&w=2670&auto=format&fit=crop",
            buttonText: "Shop The Red Drop",
            buttonLink: "/red-collection",
            displayOrder: 1,
            isFeatured: true
        },
        {
            _id: '2',
            title: "New White Tech Line Launched",
            subtitle: "Sleek design meets powerful performance in pristine white.",
            backgroundImage: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=2670&auto=format&fit=crop",
            buttonText: "Explore White Tech",
            buttonLink: "/white-tech",
            displayOrder: 2,
            isFeatured: false
        },
        {
            _id: '3',
            title: "Free Shipping on All Orders Today!",
            subtitle: "A gift from us to you. No minimum purchase required.",
            backgroundImage: "https://images.unsplash.com/photo-1517649763962-e6210e309a7a?q=80&w=2670&auto=format&fit=crop",
            buttonText: "Start Shopping",
            buttonLink: "/products",
            displayOrder: 3,
            isFeatured: true
        }
    ];

    if (loading) return (
        <div className="hero-slider-loading">
            <div className="loading-spinner"><div className="spinner"></div><p>Loading slider...</p></div>
        </div>
    );

    if (!slides.length) return (
        <div className="hero-slider-empty">
            <h3>No slides available</h3>
        </div>
    );

    const sortedSlides = [...slides].sort((a, b) => a.displayOrder - b.displayOrder);

    return (
        <div className="home-hero-slider">
            {error && <div className="fallback-warning">{error}</div>}
            <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={true}
                speed={1200}
                autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                className="hero-main-swiper"
            >
                {sortedSlides.map(slide => (
                    <SwiperSlide key={slide._id}>
                        <div
                            className="hero-slide"
                            style={{
                                backgroundImage: `url('${slide.backgroundImage}')`,
                                borderRadius: '0px' // No rounded corners
                            }}
                        >
                            <div className="slide-overlay"></div>
                            <div className="slide-content-container">
                                <div className="slide-content">
                                    {slide.isFeatured && <span className="featured-badge">★ Featured Deal</span>}
                                    <h1 className="slide-title">{slide.title}</h1>
                                    <p className="slide-subtitle">{slide.subtitle}</p>
                                    {slide.buttonText && (
                                        <a href={slide.buttonLink || '#'} className="btn-primary-slide">
                                            {slide.buttonText} →
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HomeSlider;
