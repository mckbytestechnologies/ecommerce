import React from "react";
import { ShieldCheck, Mail, Phone } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      id: "01",
      title: "Information We Collect",
      content:
        "We collect information you provide directly to us when creating an account, making a purchase, or contacting support.",
      items: [
        "Personal information (name, email, phone number)",
        "Payment details",
        "Shipping & billing addresses",
        "Order and purchase history",
      ],
    },
    {
      id: "02",
      title: "How We Use Your Information",
      content: "We use collected information to:",
      items: [
        "Process and fulfill orders",
        "Provide customer service",
        "Send order updates",
        "Improve user experience",
        "Send marketing emails (only with consent)",
      ],
    },
    {
      id: "03",
      title: "Information Sharing",
      content:
        "We do not sell your data. We may share information only with trusted partners required to operate our services.",
      items: [],
    },
    {
      id: "04",
      title: "Data Security",
      content:
        "We implement strict technical and organizational security measures to protect your data.",
      items: [],
    },
  ];

  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-red-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur">
              <ShieldCheck size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-6 text-red-100 max-w-2xl mx-auto text-lg">
            Your privacy is important to us. This policy explains how we collect,
            use, and protect your personal information.
          </p>
          <p className="text-sm text-red-200 mt-4">
            Last updated: February 26, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        {sections.map((section) => (
          <section
            key={section.id}
            className="bg-white rounded-2xl shadow-md border border-red-100 p-8 hover:shadow-xl transition duration-300"
          >
            <span className="text-red-600 font-bold text-sm">
              {section.id}
            </span>
            <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-4">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {section.content}
            </p>

            {section.items.length > 0 && (
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                {section.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-xl p-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Contact Us
          </h2>

          <p className="text-red-100 text-center mb-8">
            If you have any questions regarding this policy, feel free to reach out.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <a
              href="mailto:support@3dotworld.in"
              className="flex items-center gap-3 hover:underline justify-center"
            >
              <Mail size={18} /> support@3dotworld.in
            </a>

            <a
              href="tel:+919842320212"
              className="flex items-center gap-3 hover:underline justify-center"
            >
              <Phone size={18} /> +91 98423 20212
            </a>
          </div>
        </section>
      </main>

    

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition"
      >
        ↑
      </button>
    </div>
  );
};

export default PrivacyPolicy;