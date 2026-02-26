import React from "react";
import { Truck, Mail, Phone } from "lucide-react";

const ShippingPolicy = () => {
  const sections = [
    {
      id: "01",
      title: "Shipping Coverage",
      content:
        "We currently offer shipping services within India. International shipping may be available upon request or through select products.",
      items: [],
    },
    {
      id: "02",
      title: "Order Processing",
      content:
        "All orders are processed within 1–2 business days. Orders placed on weekends or holidays will be processed on the next working day.",
      items: [
        "Processing time may vary during peak periods",
        "Delays due to address verification or payment issues may occur",
      ],
    },
    {
      id: "03",
      title: "Delivery Timeframes",
      content:
        "Estimated delivery times range from 3 to 7 business days depending on your location and selected shipping method.",
      items: [
        "Standard shipping: 5–7 business days",
        "Express shipping: 2–4 business days",
        "Rural or remote areas may experience longer delivery times",
      ],
    },
    {
      id: "04",
      title: "Shipping Charges",
      content:
        "Shipping fees are calculated at checkout based on the delivery location and selected method.",
      items: [
        "Free shipping may be offered for orders above a certain value",
        "Express shipping may incur additional charges",
      ],
    },
    {
      id: "05",
      title: "Tracking and Updates",
      content:
        "Once your order is shipped, you will receive a tracking number via email or SMS. You can track your order directly on the courier's website.",
      items: [],
    },
    {
      id: "06",
      title: "Undeliverable Packages",
      content:
        "If a package is returned due to an incorrect address or failed delivery attempt, we will contact you to arrange re-shipment.",
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
              <Truck size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Shipping Policy
          </h1>
          <p className="mt-6 text-red-100 max-w-2xl mx-auto text-lg">
            Everything you need to know about our shipping process and delivery timelines.
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
            If you have any questions about your order or our Shipping Policy, please contact us.
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
            We strive to deliver your orders on time and in perfect condition.
            If you experience any issues with your shipment, please contact our
            customer support team immediately for assistance.
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

export default ShippingPolicy;