import React from "react";
import { RotateCcw, Mail, Phone } from "lucide-react";

const RefundPolicy = () => {
  const sections = [
    {
      id: "01",
      title: "Returns & Exchanges",
      content:
        "Your satisfaction is our priority. We want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a comprehensive returns and exchange policy to ensure your peace of mind.",
      items: [],
    },
    {
      id: "02",
      title: "7 Days Easy Return Policy",
      content:
        "We offer a 7 days free return policy from the date your original order is delivered.",
      items: [
        "Products must be unused, unworn, and original tags must be intact",
        "Customer must self-ship the product via courier or post",
        "7-day policy starts when your first original order is delivered",
        "Policy is not applicable on exchange or refund orders",
      ],
    },
    {
      id: "03",
      title: "Refund Process",
      content:
        "Approved refunds will be credited to the customer's account within 4–5 business days through the original payment method.",
      items: [],
    },
    {
      id: "04",
      title: "Damaged or Wrong Product",
      content:
        "If you receive a damaged or incorrect product, please share the package unboxing video as proof for verification.",
      items: [],
    },
    {
      id: "05",
      title: "Exchange Policy",
      content:
        "Exchanged products will be delivered within 5–7 business days after approval.",
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
              <RotateCcw size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Refund Policy
          </h1>
          <p className="mt-6 text-red-100 max-w-2xl mx-auto text-lg">
            Your satisfaction is our priority. Please read our return and refund terms carefully.
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
            Contact Support
          </h2>

          <p className="text-red-100 text-center mb-8">
            If you have any questions about our refund policy or need assistance with a return, please contact our customer support team.
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
            We are committed to making your shopping experience smooth and hassle-free.
            If you face any issues with your order, please reach out to us immediately
            so we can assist you as quickly as possible.
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

export default RefundPolicy;