import React from "react";
import { FaGift, FaTag, FaPalette, FaTruck, FaHeadset, FaArrowRight } from "react-icons/fa";

const CorporateGiftingPage = () => {
    const PRIMARY = "text-red-700";
    const ACCENT_BTN = "bg-red-600 hover:bg-red-700";
    const FEATURES = [
        { icon: FaTag, title: "Tailored Gifting Solutions", description: "Curated gifts aligned with your brand culture and values." },
        { icon: FaPalette, title: "Premium Customization", description: "Luxury branding options that ensure lasting brand recall." },
        { icon: FaTruck, title: "Pan-India Fast Delivery", description: "Timely deliveries across India with guaranteed safety." },
        { icon: FaHeadset, title: "Dedicated Support", description: "From selection to shipping, we manage everything for you." },
    ];

    const InputField = ({ label, placeholder, type = "text", rows }) => (
        <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">{label}</label>
            {rows ? (
                <textarea
                    placeholder={placeholder}
                    rows={rows}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-white">

            {/* Navbar */}
            <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-red-700">3DOT Gifting</h1>
                    <button className="text-gray-800 font-medium hover:text-red-600 transition">
                        Browse Collection
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center text-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082349259-4c7b5c000000?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-30"></div>

                <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-white/90"></div>

                <div className="relative z-10 max-w-4xl px-4">
                   <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug drop-shadow-sm">
  Impactful <span className="text-red-700">Corporate Gifting</span>
</h2>


                    <p className="mt-6 text-2xl text-gray-700 font-light max-w-2xl mx-auto">
                        Premium. Personalized. Powerful.  
                        Make your brand unforgettable with high-end corporate gifting.
                    </p>

                    <button className={`mt-10 px-12 py-4 rounded-full text-xl font-semibold text-white shadow-xl hover:scale-[1.05] transition-all duration-300 ${ACCENT_BTN}`}>
                        Get Started Today <FaArrowRight className="inline ml-2" />
                    </button>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-4xl font-extrabold text-center text-red-700 mb-4">
                        Gifting Beyond Expectations
                    </h3>

                    <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-16">
                        Premium gifting is more than a gesture—it's an experience that carries your brand’s identity.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {FEATURES.map((item, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-red-600 hover:shadow-red-300/50 hover:scale-[1.03] transition-all duration-300"
                            >
                                <item.icon className="text-4xl text-red-600 mb-4" />
                                <h5 className="text-xl font-bold text-gray-900 mb-2">
                                    {item.title}
                                </h5>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Secondary CTA + Form */}
            <section className="py-20 bg-red-50 border-t border-b border-red-200">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left */}
                    <div className="flex flex-col justify-center">
                        <h4 className="text-4xl font-extrabold text-red-700 mb-6">
                            Let’s Build Memorable Gifting Experiences
                        </h4>
                        <p className="text-lg text-gray-700 mb-8">
                            Whether it's employee recognition, event gifting, festive hampers, or onboarding kits — we deliver premium excellence.
                        </p>

                        <button className="px-8 py-3 rounded-full border border-red-600 text-red-600 font-semibold hover:bg-red-100 transition">
                            Browse Collection
                        </button>
                    </div>

                    {/* Right - Form */}
                    <div className="bg-white p-10 rounded-3xl shadow-2xl border border-red-200">
                        <h4 className="text-3xl font-bold text-red-700 mb-6">Send Us a Message</h4>

                        <form className="space-y-5">
                            <InputField label="Full Name" placeholder="Enter your full name" />
                            <InputField label="Email" type="email" placeholder="Enter your email address" />
                            <InputField label="Mobile Number" placeholder="Enter your phone number" />
                            <InputField label="Message" rows={4} placeholder="Tell us about your gifting requirement..." />

                            <button
                                type="submit"
                                className={`w-full py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 ${ACCENT_BTN}`}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-red-700 py-14">
                <div className="text-center text-white">
                    <p className="text-4xl font-bold">
                        Professional. Personal. <span className="text-white/80">Powerful.</span>
                    </p>
                    <p className="mt-4 text-lg text-red-100">
                        The Art of Premium Corporate Gifting.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CorporateGiftingPage;
