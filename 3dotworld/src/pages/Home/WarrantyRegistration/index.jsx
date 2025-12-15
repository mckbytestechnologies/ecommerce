import React from "react";
import { FaFileInvoice, FaShieldAlt, FaLightbulb, FaEnvelope, FaMobileAlt, FaUser, FaCalendarAlt, FaBoxOpen } from "react-icons/fa";

const WarrantyRegistration = () => {
  return (
    // Background: Clean white with subtle red/gray gradient for depth
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">

      {/* 1. Header Section - Primary Branding */}
      <div className="max-w-4xl text-center mb-16">
        <FaShieldAlt className="mx-auto text-6xl text-red-600 mb-4 animate-pulse-slow" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
          Activate Your <span className="text-red-600 drop-shadow-lg">Premium Warranty</span>
        </h1>
        <p className="text-gray-600 mt-4 text-xl font-light">
          Official Product Registration for Full Coverage Activation.
        </p>

        {/* Important Alert Banner - Prominent & Contrasting */}
        <div className="mt-8 bg-red-600 text-white p-4 rounded-xl shadow-2xl transition hover:shadow-red-500/50">
          <p className="text-lg font-semibold flex items-center justify-center gap-3">
            <FaCalendarAlt className="text-yellow-300 text-2xl"/>
            **30-Day Limit:** Please register within **30 days** of purchase to ensure full warranty coverage.
          </p>
        </div>
      </div>
      
      {/* --- Main Content Container (Registration Form + Notes/Secondary Form) --- */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* COLUMN 1: Primary Registration Form (Simplified placeholder for structure) */}
        <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-[0_15px_60px_rgba(255,0,0,0.1)] border border-red-100">
            <h2 className="text-3xl font-bold text-red-700 mb-6 border-b pb-3 flex items-center gap-3">
                <FaFileInvoice className="text-red-500"/> Warranty Registration Form
            </h2>

            {/* This is the new, clean form section */}
            <form className="space-y-6">
                
                <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">Product Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Placeholder for Product Model */}
                    <InputGroup label="Product Model/Serial" icon={FaBoxOpen} placeholder="Enter model or serial number" />
                    {/* Placeholder for Purchase Date */}
                    <InputGroup label="Purchase Date" icon={FaCalendarAlt} type="date" placeholder="Select purchase date" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-2 border-t pt-4">Purchaser Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* First Name */}
                    <InputGroup label="First Name" icon={FaUser} placeholder="Enter your first name" />
                    {/* Email */}
                    <InputGroup label="Email" icon={FaEnvelope} type="email" placeholder="Enter your email" />
                    {/* Mobile Number */}
                    <InputGroup label="Mobile Number" icon={FaMobileAlt} placeholder="Enter your mobile number" />
                </div>

                {/* Primary Action Button */}
                <div className="pt-6 flex justify-center">
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-gradient-to-r from-red-700 to-red-500 text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:scale-105 hover:shadow-red-500/50 transition-all duration-300 flex items-center gap-3 justify-center"
                    >
                        <FaShieldAlt className="text-2xl"/>
                        Activate Warranty Now
                    </button>
                </div>
            </form>
        </div>

        {/* COLUMN 2: Notes & Secondary Contact Form */}
        <div className="lg:col-span-1 space-y-8">
            
            {/* Notes Section - Clean & Detailed */}
            <div className="bg-white/95 p-6 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Important Notes</h2>
                <ul className="space-y-3 text-gray-700 text-base leading-relaxed">
                    <li className="flex items-start gap-2"><span className="text-red-500 text-lg">●</span> Keep your **purchase receipt safe** for warranty claims.</li>
                    <li className="flex items-start gap-2"><span className="text-red-500 text-lg">●</span> Register your product **within 30 days** of purchase.</li>
                    <li className="flex items-start gap-2"><span className="text-red-500 text-lg">●</span> Warranty is valid only for **original purchasers**.</li>
                    <li className="flex items-start gap-2"><span className="text-red-500 text-lg">●</span> Improper use may **void the warranty**.</li>
                    <li className="flex items-start gap-2"><span className="text-red-500 text-lg">●</span> Contact support for any warranty-related issues.</li>
                </ul>
            </div>

            {/* Secondary Contact Form (Innovation/Message) - Distinct Look */}
            <div className="bg-red-50 p-6 rounded-2xl shadow-xl border border-red-200">
                <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
                    <FaLightbulb className="text-yellow-500"/> Share Your Ideas
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                    Tell us about your innovation ideas. We value your feedback!
                </p>

                <form className="space-y-4">
                    <InputGroup label="First Name" icon={FaUser} placeholder="Your name" />
                    <InputGroup label="Email" icon={FaEnvelope} type="email" placeholder="Your email" />
                    
                    {/* Message Area */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-red-700 mb-2">Message</label>
                        <textarea
                            placeholder="Tell us about your innovation ideas..."
                            rows={4}
                            className="px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 shadow-inner"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-400 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-500 transition duration-300"
                    >
                        Send Message ✉️
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for consistent input styling
const InputGroup = ({ label, icon: Icon, placeholder, type = "text" }) => (
    <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400" />
            <input
                type={type}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 shadow-inner transition"
            />
        </div>
    </div>
);


export default WarrantyRegistration;