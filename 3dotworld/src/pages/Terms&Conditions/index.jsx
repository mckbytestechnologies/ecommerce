import React from "react";
import { FileText, Mail, Phone } from "lucide-react";

const TermsConditions = () => {
  const sections = [
    {
      id: "01",
      title: "Acceptance of Terms",
      content:
        "By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.",
      items: [],
    },
    {
      id: "02",
      title: "Products and Services",
      content:
        "All products and services are subject to availability. We reserve the right to discontinue any product at any time.",
      items: [
        "Product descriptions and pricing are subject to change",
        "We strive to display accurate product information",
        "Colors and specifications may vary from actual products",
      ],
    },
    {
      id: "03",
      title: "Orders and Payment",
      content:
        "By placing an order, you agree to provide accurate and complete information.",
      items: [
        "All orders are subject to acceptance and availability",
        "Payment must be received before order processing",
        "We accept various payment methods as displayed at checkout",
      ],
    },
    {
      id: "04",
      title: "Shipping and Delivery",
      content:
        "We will make every effort to deliver products within the estimated timeframe; however, delivery times are not guaranteed.",
      items: [],
    },
    {
      id: "05",
      title: "Returns and Refunds",
      content:
        "Our return policy allows returns within a specified period from the date of purchase, subject to certain conditions.",
      items: [],
    },
    {
      id: "06",
      title: "Limitation of Liability",
      content:
        "In no event shall 3dotworld be liable for any indirect, incidental, special, or consequential damages arising from the use of our services.",
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
              <FileText size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-6 text-red-100 max-w-2xl mx-auto text-lg">
            Please read these terms carefully before using our website and services.
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
            Contact Information
          </h2>

          <p className="text-red-100 text-center mb-8">
            For any questions regarding these Terms & Conditions, please contact us.
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

        {/* Important Note */}
        <section className="bg-red-50 border-l-4 border-red-600 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Important Note
          </h3>
          <p className="text-gray-700 leading-relaxed">
            By using our website and services, you acknowledge that you have read,
            understood, and agree to be bound by these Terms & Conditions. 
            If you do not agree with any part of these terms, please do not use our services.
          </p>
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

export default TermsConditions;