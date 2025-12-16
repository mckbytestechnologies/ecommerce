import React from 'react'
// Importing social media icons
import { FaShippingFast, FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa"; 

const Footer = () => {
    return(
       // Use a deep black background for the footer section
       <footer className="bg-gray-900 text-white"> 
        
        {/* Newsletter Section (Kept as a striking top element) */}
        <div className="px-6 md:px-12 py-12 bg-white text-gray-900 border-b border-gray-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    {/* Red accent icon */}
                    <FaShippingFast className="text-3xl text-red-600" />
                    <h3 className="text-xl font-bold">Fast & Free Shipping</h3>
                </div>
                <div className="text-center md:text-left">
                    <h4 className="text-2xl font-extrabold">Join Our Community!</h4>
                    <p className="text-gray-600 mt-1">
                        Sign up for our newsletter to get the latest updates and deals.
                    </p>
                </div>
                <div className="flex w-full md:w-auto">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="px-4 py-3 w-full rounded-l-lg border-2 border-red-600 focus:outline-none text-gray-900"
                    />
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-r-lg font-bold transition duration-300">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>

        {/* Footer Links Section - Using new content */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Brand and Mission Statement */}
            <div className="col-span-2 md:col-span-1">
                <h3 className="text-2xl font-extrabold text-white"> 3Dot <span className="text-red-600">World</span></h3>
                <p className="text-gray-400 mt-4 text-sm">
                    Your trusted partner for **premium electronics** and innovative solutions that enhance your everyday life.
                </p>
            </div>

            {/* Quick Links */}
            <div>
                <h4 className="text-md font-bold text-red-600 mb-4">Quick Links</h4>
                <ul className="space-y-3 text-gray-400 text-sm">
                    <li className="hover:text-white cursor-pointer transition duration-200">Home</li>
                    <li className="hover:text-white cursor-pointer transition duration-200">Shop</li>
                    <li className="hover:text-white cursor-pointer transition duration-200">About</li>
                    <li className="hover:text-white cursor-pointer transition duration-200">Contact</li>
                </ul>
            </div>

            {/* Legal Links */}
            <div>
                <h4 className="text-md font-bold text-red-600 mb-4">Legal</h4>
                <ul className="space-y-3 text-gray-400 text-sm">
                    <li className="hover:text-white cursor-pointer transition duration-200">Privacy Policy</li>
                    <li className="hover:text-white cursor-pointer transition duration-200">Terms & Conditions</li>
                    <li className="hover:text-white cursor-pointer transition duration-200">Shipping Policy</li>
                    <li className="hover:text-white cursor-pointer transition duration-200">Refund Policy</li>
                </ul>
            </div>

            {/* Follow Us */}
            <div>
                <h4 className="text-md font-bold text-red-600 mb-4">Follow Us</h4>
                <p className="text-gray-400 text-sm mb-4">
                    Stay connected with us on social platforms for updates and offers.
                </p>
                <div className="flex gap-4">
                    {/* Social Media Icons */}
                    <a href="#" className="text-gray-400 hover:text-red-600 transition duration-300">
                        <FaTwitter className="text-xl" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-red-600 transition duration-300">
                        <FaFacebookF className="text-xl" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-red-600 transition duration-300">
                        <FaInstagram className="text-xl" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-red-600 transition duration-300">
                        <FaLinkedinIn className="text-xl" />
                    </a>
                </div>
            </div>
        </div>

        {/* Copyright Section */}
        <div className="bg-gray-800 py-4">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} 3DotWorld. All rights reserved.
            </div>
        </div>
       </footer>
    )
}

export default Footer;