import React from 'react'

import { FaShippingFast } from "react-icons/fa";

const Footer = () => {
    return(
       <footer className="bg-[#fef9f4]">
      {/* Newsletter Section */}


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
