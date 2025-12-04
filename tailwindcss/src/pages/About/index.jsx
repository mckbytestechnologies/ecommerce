import React from "react";
// FIX: Switched from 'react-icons/fa6' (which failed to resolve) to the standard 'react-icons/fa'
import { FaTools, FaLightbulb, FaHandshake, FaShieldAlt, FaUserTie, FaArrowRight, FaBuilding, FaGrinHearts, FaFemale } from "react-icons/fa";

// Helper component for standard program cards
const ProgramCard = ({ icon: Icon, title, description, delay }) => (
    <div
        className="relative p-8 bg-white rounded-xl shadow-xl transition duration-500 border border-gray-100 
                   hover:shadow-3xl hover:-translate-y-1 hover:border-red-400/50"
        style={{ animationDelay: `${delay}s` }} // Subtle animation effect
    >
        <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-xl bg-red-500/10 rounded-tr-xl"></div>
        <Icon className="text-red-700 text-5xl mb-4" />
        <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
);

// Helper component for the unique SHEROES card
const SheroesCard = ({ title, description }) => (
    <div
        className="lg:col-span-3 lg:mx-auto lg:w-2/3 p-10 rounded-2xl shadow-2xl transition duration-500 border-4 border-red-500
                   bg-gradient-to-br from-pink-100 to-red-100 text-gray-900"
    >
        <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Using a suitable replacement icon for FaWomenDress */}
            <FaFemale className="text-6xl text-red-600 flex-shrink-0 drop-shadow-md" /> 
            <div>
                <h3 className="text-3xl font-extrabold text-red-800 mb-2 border-b-2 border-red-300 pb-1">{title}</h3>
                <p className="text-lg leading-relaxed font-medium">
                    {description}
                </p>
            </div>
        </div>
    </div>
);


export default function About3DotWorld() {
    return (
        <div className="font-sans bg-gray-50 text-gray-900">

            {/* 1. HERO SECTION - Deep, Professional Look */}
            <section className="bg-red-800 text-white py-28 px-6 text-center shadow-2xl">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">About 3DOTWORLD</h1>
                    <p className="text-xl md:text-2xl font-light opacity-90">
                        Pioneering the future of electronics through grassroots innovation.
                    </p>
                </div>
            </section>

            {/* 2. MISSION & VALUE STATEMENT */}
            <section className="max-w-6xl mx-auto py-20 px-6 text-center">
                <FaBuilding className="text-red-600 text-5xl mx-auto mb-6" />
                <h2 className="text-4xl font-bold mb-8 text-gray-800">Our Core Mission</h2>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto border-l-4 border-red-400 pl-4 italic">
                    At 3dotworld, we empower innovation through hands-on experience and cutting-edge technology. 
                    We're not just an electronics company — we are a platform for nurturing the next generation 
                    of innovators, creators, and entrepreneurs.
                </p>
            </section>

            {/* 3. PROGRAMS SECTION - Visually appealing grid */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Innovation Ecosystem</h2>
                    
                    {/* Program Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        <ProgramCard 
                            icon={FaUserTie} 
                            title="Sales Internship" 
                            description="Step into innovation with real-world experience. Learn communication, customer interaction, and become an ambassador of innovation."
                        />

                        <ProgramCard 
                            icon={FaTools} 
                            title="Manufacturing Internship" 
                            description="Learn by doing, build by thinking. Hands-on experience assembling and testing our cutting-edge electronics products."
                        />

                        <ProgramCard 
                            icon={FaLightbulb} 
                            title="Product Incubation" 
                            description="Create, Customize, Credit. Get workspace, tools, and expert guidance to turn your ideas into real products."
                        />
                        
                        <ProgramCard 
                            icon={FaShieldAlt} 
                            title="Patenting & Royalty Program" 
                            description="Protect your ideas, profit from innovation. We help you file patents under your name and earn royalties."
                        />
                        
                        <ProgramCard 
                            icon={FaHandshake} 
                            title="Innovation Sponsorship" 
                            description="Big ideas deserve big support. We provide funding and resources for breakthrough concepts and prototypes."
                        />

                         {/* Placeholder Card - Filling the 6-slot grid visually */}
                        <div className="flex flex-col justify-center items-center p-8 bg-red-50 rounded-xl border border-red-200">
                             <h4 className="text-xl font-semibold text-red-600 mb-2">Build Your Future</h4>
                             <p className="text-center text-gray-700">Explore all possibilities with 3DOTWORLD.</p>
                             <button className="mt-4 text-red-700 font-semibold inline-flex items-center gap-2 hover:underline">
                                 View All Opportunities <FaArrowRight size={14} />
                             </button>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* 4. SHEROES SECTION - Distinctive Callout Card */}
            <section className="py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <SheroesCard
                        title="🔥 SHEROES BY 3 DOT: Singapenney Initiative"
                        description="Singapenney — A Women Entrepreneurship Initiative by 3 DOT. Empowering women to design, create, and grow their own ideas, leading the charge in electronics innovation."
                    />
                </div>
            </section>


            {/* 5. CTA SECTION - Bold and Actionable */}
            <section className="bg-red-800 text-white py-20 text-center px-6">
                <h3 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Ready to Innovate?</h3>
                <p className="text-xl max-w-3xl mx-auto mb-8 font-light opacity-90">
                    Join our ecosystem where imagination meets industry. Every innovator receives a factory ID card 
                    for continued access to our labs and development facilities.
                </p>
                <button 
                    className="bg-white text-red-700 font-bold px-10 py-4 rounded-full text-lg shadow-2xl shadow-red-500/40 
                                hover:bg-red-100 hover:scale-[1.05] transition-all inline-flex items-center gap-3">
                    Apply Now <FaArrowRight />
                </button>
            </section>
        </div>
    );
}