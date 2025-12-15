import React, { useState } from "react";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaPaperPlane,
  FaClock,
  FaHeadset,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaArrowRight,
  FaCheckCircle,
  FaBuilding
} from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    mobile: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: "",
        email: "",
        mobile: "",
        message: ""
      });
    }, 3000);
  };

  return (
    <div className="font-sans bg-gradient-to-b from-white to-gray-50 text-gray-900">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-red-900 via-red-700 to-amber-700 text-white py-24 px-6 text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-red-600/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-600/20 to-transparent rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-6 border border-white/20">
              <MdSupportAgent className="text-4xl text-white" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                  Contact Us
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-light tracking-wide text-amber-100">
                Get in touch with our innovation team
              </p>
            </div>
          </div>
          
          <div className="mt-10 max-w-2xl mx-auto bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <p className="text-lg md:text-xl leading-relaxed">
              We're here to help you innovate, create, and transform your ideas into reality. 
              Reach out to our team for any inquiries, support, or collaboration opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email Card */}
          <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group">
            <div className="h-2 bg-gradient-to-r from-red-500 to-amber-500"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
                <FaEnvelope className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-red-700 transition-colors">
                Email Us
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Get detailed responses and support documentation
              </p>
              <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 rounded-xl border border-red-100">
                <a 
                  href="mailto:support@3dotworld.in" 
                  className="text-xl font-bold text-red-700 hover:text-red-800 transition-colors break-all"
                >
                  support@3dotworld.in
                </a>
                <p className="text-sm text-gray-500 mt-2">Response time: 24 hours</p>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
                <FaPhone className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-red-700 transition-colors">
                Call Us
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Speak directly with our innovation specialists
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                <a 
                  href="tel:+919842320212" 
                  className="text-2xl font-bold text-blue-700 hover:text-red-800 transition-colors"
                >
                  +91 9842320212
                </a>
                <div className="flex items-center mt-2">
                  <FaHeadset className="text-blue-500 mr-2" />
                  <p className="text-sm text-gray-500">Available Mon-Sat, 9AM-6PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Card */}
          <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-amber-700 transition-colors">
                Visit Us
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Experience our innovation lab firsthand
              </p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                <div className="flex items-start">
                  <FaBuilding className="text-amber-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-amber-800 text-lg">3 dot world</p>
                    <p className="text-sm text-gray-600 mt-1">Innovation Hub & Manufacturing Facility</p>
                    <button className="text-sm text-amber-700 font-semibold mt-3 hover:text-amber-800 flex items-center">
                      Get Directions <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Info */}
          <div>
            <div className="bg-gradient-to-br from-red-50 to-amber-50 p-8 rounded-3xl border-2 border-red-100 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why <span className="text-red-700">Contact</span> Us?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <FaClock className="text-xl text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Quick Response</h4>
                    <p className="text-gray-600">Get responses within 24 hours for all inquiries</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <FaHeadset className="text-xl text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Expert Support</h4>
                    <p className="text-gray-600">Connect with innovation specialists and engineers</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <FaPaperPlane className="text-xl text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Comprehensive Solutions</h4>
                    <p className="text-gray-600">From product inquiries to collaboration opportunities</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-10 pt-8 border-t border-red-200">
                <h4 className="font-bold text-gray-900 mb-4">Follow Our Innovation Journey</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center transition-colors">
                    <FaLinkedin className="text-red-700 text-xl" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center transition-colors">
                    <FaInstagram className="text-red-700 text-xl" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center transition-colors">
                    <FaTwitter className="text-red-700 text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <FaClock className="text-red-600 mr-3" />
                Operating Hours
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-semibold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-semibold text-red-600">By Appointment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 relative overflow-hidden">
              {/* Success Message */}
              {isSubmitted && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/95 to-emerald-600/95 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl animate-fadeIn">
                  <div className="text-center p-8">
                    <FaCheckCircle className="text-white text-6xl mx-auto mb-6" />
                    <h3 className="text-3xl font-bold text-white mb-4">Message Sent!</h3>
                    <p className="text-white/90 text-lg">Our innovation team will contact you within 24 hours.</p>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Send us a <span className="text-red-700">Message</span>
                </h2>
                <p className="text-gray-600 mt-2">Fill out the form below and we'll get back to you</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                      👤
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-gray-50/50"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                      ✉️
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-gray-50/50"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                      📱
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-gray-50/50"
                      required
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-6 text-gray-400 group-focus-within:text-red-500 transition-colors">
                      💭
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your innovation ideas..."
                      rows={6}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-gray-50/50 resize-none"
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white py-4 px-8 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Send Message
                    <FaPaperPlane className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>

              <p className="text-sm text-gray-500 text-center mt-6">
                By submitting this form, you agree to our privacy policy and consent to being contacted by our innovation team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-3xl p-8 shadow-xl border border-red-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Visit Our <span className="text-red-700">Innovation Hub</span>
              </h3>
              <p className="text-gray-600 mb-6">
                Experience our state-of-the-art facilities and see innovation in action. 
                Schedule a guided tour to explore our labs, manufacturing units, and incubation centers.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-red-600 mr-3" />
                  <span className="font-semibold">3 dot world Innovation Center</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-amber-600 mr-3" />
                  <span>Guided tours available on weekdays by appointment</span>
                </div>
                <button className="inline-flex items-center text-red-700 font-bold hover:text-red-800 transition-colors">
                  Schedule a Tour <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-red-200 to-amber-200 rounded-2xl h-64 md:h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <FaMapMarkerAlt className="text-6xl text-red-600 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-700 font-semibold">Interactive Map Coming Soon</p>
                  <p className="text-sm text-gray-500 mt-2">We're working on an interactive experience for you!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to <span className="text-amber-300">Innovate</span> Together?
          </h3>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Join our ecosystem of innovators, creators, and entrepreneurs. Let's build something amazing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-700 font-bold px-10 py-4 rounded-full shadow-2xl hover:bg-amber-50 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 text-lg">
              Book a Consultation <FaHeadset />
            </button>
            <button className="bg-transparent border-2 border-white text-white font-bold px-10 py-4 rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 text-lg">
              Join Innovation Program <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Add custom styles for animations */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}