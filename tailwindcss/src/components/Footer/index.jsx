import React from 'react'

import { FaShippingFast } from "react-icons/fa";

const Footer = () => {
    return(
       <footer className="bg-[#fef9f4]">
      {/* Newsletter Section */}
      <div className="bg-[#fcd9b6] py-10 px-6 md:px-12 rounded-lg mx-4 md:mx-10 -mt-10 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">
              Subscribe To Our Newsletter
            </h2>
            <p className="text-gray-700 mt-2">
              Sign up to get daily updates & news about our new products and
              features.
            </p>
            {/* Input */}
            <div className="mt-4 flex w-full max-w-md mx-auto md:mx-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none"
              />
              <button className="bg-gray-900 text-white px-5 rounded-r-md font-medium">
                Subscribe
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end flex-1">
            <img
              src="/footer.jpg"
              alt="Product"
              className="w-40 md:w-56 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-5 gap-8 border-t border-gray-200 mt-10">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-bold text-gray-900">WONDER VALLEY</h3>
          <p className="text-gray-600 mt-2">
            No need to worry, we’ll help you make sense of it all.
          </p>
          <div className="mt-4 flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 w-full rounded-l-md border border-gray-300 focus:outline-none"
            />
            <button className="bg-orange-500 text-white px-4 rounded-r-md font-semibold">
              →
            </button>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">About</h4>
          <ul className="space-y-2 text-gray-600">
            <li>What We Offer</li>
            <li>Features</li>
            <li>Pricing</li>
            <li>Leadership</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Solutions</h4>
          <ul className="space-y-2 text-gray-600">
            <li>Careers</li>
            <li>Management</li>
            <li>Workflow</li>
            <li>Finance</li>
            <li>Resources</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Personal</h4>
          <ul className="space-y-2 text-gray-600">
            <li>Features</li>
            <li>Accounts</li>
            <li>Payments</li>
            <li>Profile</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Social</h4>
          <ul className="space-y-2 text-gray-600">
            <li>Twitter</li>
            <li>Facebook</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>
    </footer>
       
    )
}

export default Footer;
