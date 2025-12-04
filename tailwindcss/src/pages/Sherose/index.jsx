import React, { useState } from "react";
import { 
  FaRocket, 
  FaShieldAlt, 
  FaUsers, 
  FaChartLine, 
  FaMoneyBillWave,
  FaTruck,
  FaGift,
  FaCrown,
  FaFemale,
  FaStar,
  FaCheckCircle,
  FaWhatsapp,
  FaPhone,
  FaArrowRight,
  FaHandshake,
  FaLightbulb,
  FaAward
} from "react-icons/fa";
import { GiTakeMyMoney, GiQueenCrown } from "react-icons/gi";

export default function SheroesPage() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="font-sans bg-gradient-to-b from-white to-pink-50 text-gray-900">

      {/* HERO BANNER WITH IMAGE */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/90 via-purple-900/80 to-red-900/90 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center z-[-1] opacity-30"></div>
        
        {/* Animated Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-600/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mr-6 border-2 border-white/30 shadow-2xl">
              <GiQueenCrown className="text-4xl text-white" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-2 tracking-tight">
                <span className="bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                  SHEROES BY 3 DOT
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-light tracking-wide text-pink-100">
                A Women Entrepreneurship Initiative by 3 DOT
              </p>
            </div>
          </div>
          
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                The Zero-Risk Revolution
                <br />
                <span className="text-amber-300">For Women Who Build Empires!</span>
              </h2>
              <p className="text-lg text-pink-100 leading-relaxed">
                Because every woman deserves to rule her dreams—without spending a rupee first.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold inline-flex items-center">
                <FaRocket className="mr-2" /> Zero Investment
              </div>
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-full font-semibold inline-flex items-center">
                <FaChartLine className="mr-2" /> High Commissions
              </div>
              <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold inline-flex items-center">
                <FaShieldAlt className="mr-2" /> No Risk
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              🚀 SHEROES – Sell Smart. Earn Fearlessly.
            </span>
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            At 3 DOT, we don't just empower women, we arm them with innovation. 
            No inventory. No investment. Just your influence + our game-changing 
            products = unstoppable success.
          </p>
        </div>

        {/* How It Works Steps */}
        <div className="max-w-5xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            💡 How It Works?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: <FaUsers className="text-4xl" />,
                title: "YOU PROMOTE",
                description: "Share our premium products with your friends, family, clients, gym members, social circles.",
                color: "from-pink-500 to-rose-500"
              },
              {
                step: 2,
                icon: <FaTruck className="text-4xl" />,
                title: "THEY ORDER",
                description: "Direct payments—Receive your incentive. We'll even handle delivery (or you can deliver personally for extra trust).",
                color: "from-purple-500 to-violet-500"
              },
              {
                step: 3,
                icon: <FaMoneyBillWave className="text-4xl" />,
                title: "YOU EARN",
                description: "Keep your profit, zero strings attached. Your network = your empire.",
                color: "from-amber-500 to-orange-500"
              }
            ].map((item) => (
              <div 
                key={item.step}
                className={`relative bg-gradient-to-br ${item.color} text-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2`}
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 font-bold text-xl shadow-lg">
                  {item.step}
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-bold mb-4 text-center">{item.title}</h4>
                <p className="text-white/90 leading-relaxed text-center">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why SHEROES? Benefits Grid */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-10 mb-16 border border-pink-200 shadow-xl">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            ✨ Why SHEROES?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <GiTakeMyMoney className="text-3xl" />,
                title: "NO MONEY, ONLY MAGIC",
                description: "Start today without spending a single rupee.",
                color: "bg-pink-100 text-pink-700"
              },
              {
                icon: <FaGift className="text-3xl" />,
                title: "FUTURISTIC PRODUCTS",
                description: "Be the first to bring 3 DOT's genius to your tribe.",
                color: "bg-purple-100 text-purple-700"
              },
              {
                icon: <FaCrown className="text-3xl" />,
                title: "FLEXIBLE POWER",
                description: "Fit it around your existing work or build it as your main gig.",
                color: "bg-amber-100 text-amber-700"
              },
              {
                icon: <FaHandshake className="text-3xl" />,
                title: "BACKED LIKE A BOSS",
                description: "We train, support, and celebrate YOU.",
                color: "bg-rose-100 text-rose-700"
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mb-4`}>
                  {benefit.icon}
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900">{benefit.title}</h4>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Perfect For Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              🔥 Perfect For
            </span>
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Aspiring Queens",
              "Wellness Warriors", 
              "Fitness Gurus",
              "Side Hustlers",
              "Parlour Enthusiasts",
              "Social Media Influencers",
              "Homemakers",
              "College Students"
            ].map((role, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 px-6 py-3 rounded-full font-semibold text-gray-800 hover:from-pink-200 hover:to-purple-200 transition-all duration-300 hover:scale-105"
              >
                {role}
              </div>
            ))}
          </div>
          
          <p className="text-center text-xl font-bold mt-10 text-gray-800 max-w-2xl mx-auto">
            This isn't just a program—it's a movement for women who trade limits for legacy.
          </p>
        </div>

        {/* Additional Opportunity */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 mb-16 border border-amber-200 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <FaStar className="text-4xl text-amber-600 mr-4" />
            <h3 className="text-3xl font-bold text-amber-900">
              You can earn by selling other branded products as well!!
            </h3>
          </div>
          <p className="text-center text-gray-700 text-lg">
            Expand your portfolio and maximize your earnings with our diverse product range.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-10 shadow-xl mb-16 border border-gray-200">
          <div className="flex items-center mb-8">
            <FaLightbulb className="text-4xl text-purple-600 mr-4" />
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                💬 But what if I've never sold before?
              </h3>
              <p className="text-xl text-gray-700">
                Hey Shero— if you can talk, you can conquer. We'll teach you the rest.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {[
              {
                question: "No experience needed?",
                answer: "We provide complete training and support to help you succeed."
              },
              {
                question: "How much can I earn?",
                answer: "Earnings depend on your efforts - some sheroes earn ₹10,000+ monthly!"
              },
              {
                question: "When do I get paid?",
                answer: "Instantly! Your commission is transferred immediately after sale."
              },
              {
                question: "Is there any hidden cost?",
                answer: "Absolutely not! Zero investment, zero hidden charges."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-100"
              >
                <h4 className="font-bold text-lg mb-2 text-gray-900">{faq.question}</h4>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900 via-purple-900 to-red-900"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-pink-500 rounded-2xl flex items-center justify-center mr-6 border-2 border-white/30 shadow-2xl">
              <FaRocket className="text-4xl text-white" />
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                Ready to <span className="text-amber-300">Launch?</span>
              </h3>
              <p className="text-xl text-pink-100">
                Join SHEROES by 3 DOT—where your ambition meets our innovation.
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 mb-8 max-w-2xl mx-auto">
            <h4 className="text-2xl font-bold text-white mb-6">📞 Contact Now:</h4>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="tel:+917200426094"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
              >
                <FaWhatsapp className="mr-3 text-xl" />
                +91 72004 26094
              </a>
              <a 
                href="tel:+919842320212"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
              >
                <FaPhone className="mr-3 text-xl" />
                +91 98423 20212
              </a>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-12">
            <div className="inline-flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full shadow-xl">
              <FaAward className="mr-3 text-2xl" />
              <span className="text-xl font-bold">🌟 Powered by SKY World – 25 Years of Trust 🌟</span>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN NOW SECTION */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="bg-gradient-to-br from-white to-pink-50 rounded-3xl p-12 shadow-2xl border border-pink-200 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-200/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Innovate?
              </span>
            </h2>
            <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join our ecosystem where imagination meets industry. Every innovator receives a 
              factory ID card for continued access to our labs and development facilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold px-12 py-5 rounded-full text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center group">
                Get Started Today 
                <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              <button className="bg-white border-2 border-pink-600 text-pink-700 font-bold px-12 py-5 rounded-full text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center">
                <FaFemale className="mr-3" />
                Join SHEROES Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[
                {
                  icon: <FaCheckCircle className="text-3xl" />,
                  title: "Zero Investment",
                  description: "Start without spending a single rupee"
                },
                {
                  icon: <FaCheckCircle className="text-3xl" />,
                  title: "Flexible Timing",
                  description: "Work around your existing schedule"
                },
                {
                  icon: <FaCheckCircle className="text-3xl" />,
                  title: "Full Support",
                  description: "Training, marketing materials & mentorship"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our <span className="text-purple-600">SHEROES</span> Journey
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Women Empowered" },
              { number: "₹50L+", label: "Total Earnings" },
              { number: "1000+", label: "Products Sold" },
              { number: "50+", label: "Cities Covered" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}