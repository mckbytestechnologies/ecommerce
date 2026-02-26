import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import './HomeSlider.css';

const API_BASE = 'http://localhost:5000';
const HERO_API = `${API_BASE}/api/hero/active`;

const HomeSlider = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getFallbackSlides = () => [
        {
            _id: '1',
            backgroundImage:
                "https://images.unsplash.com/photo-1542435503-921d58fb3e74?q=80&w=2670&auto=format&fit=crop",
            buttonLink: "/red-collection",
            displayOrder: 1
        },
        {
            _id: '2',
            backgroundImage:
                "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=2670&auto=format&fit=crop",
            buttonLink: "/white-tech",
            displayOrder: 2
        },
        {
            _id: '3',
            backgroundImage:
                "https://images.unsplash.com/photo-1517649763962-e6210e309a7a?q=80&w=2670&auto=format&fit=crop",
            buttonLink: "/products",
            displayOrder: 3
        }
    ];

    const fetchSlides = async () => {
        try {
            setLoading(true);

            const response = await fetch(HERO_API, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data?.length > 0) {
                setSlides(result.data);
            } else {
                setSlides(getFallbackSlides());
                setError('Using fallback slides');
            }

        } catch (err) {
            console.error(err);
            setError('Connection error. Showing fallback slides.');
            setSlides(getFallbackSlides());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    if (loading) {
        return (
            <div className="hero-slider-loading">
                <div className="spinner"></div>
                <p>Loading slider...</p>
            </div>
        );
    }

    if (!slides.length) {
        return (
            <div className="hero-slider-empty">
                <h3>No slides available</h3>
            </div>
        );
    }

    const sortedSlides = [...slides].sort(
        (a, b) => a.displayOrder - b.displayOrder
    );

    return (
        <div className="home-hero-slider">

            {error && <div className="fallback-warning">{error}</div>}

            <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={true}
                speed={1000}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                pagination={{ clickable: true }}
                className="hero-main-swiper"
            >
                {sortedSlides.map(slide => (
                    <SwiperSlide key={slide._id}>
                        <a
                            href={slide.buttonLink || '#'}
                            className="hero-slide-link"
                        >
                            <div
                                className="hero-slide"
                                style={{
                                    backgroundImage: `url(${slide.backgroundImage})`
                                }}
                            />
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HomeSlider;