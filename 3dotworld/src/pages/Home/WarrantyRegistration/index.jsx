import React, { useState } from "react";
import {
  FaFileInvoice,
  FaShieldAlt,
  FaLightbulb,
  FaEnvelope,
  FaMobileAlt,
  FaUser,
  FaCalendarAlt,
  FaBoxOpen,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const WarrantyRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [innovationLoading, setInnovationLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [innovationSuccess, setInnovationSuccess] = useState("");
  const [innovationError, setInnovationError] = useState("");

  // Form state for warranty registration
  const [warrantyForm, setWarrantyForm] = useState({
    productModel: "",
    purchaseDate: "",
    firstName: "",
    email: "",
    mobileNumber: "",
  });

  // Form state for innovation idea
  const [innovationForm, setInnovationForm] = useState({
    firstName: "",
    email: "",
    message: "",
  });

  // Handle warranty form input changes
  const handleWarrantyChange = (e) => {
    setWarrantyForm({
      ...warrantyForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle innovation form input changes
  const handleInnovationChange = (e) => {
    setInnovationForm({
      ...innovationForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle warranty form submission
  const handleWarrantySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${API_BASE_URL}/warranty/register`, warrantyForm);

      if (response.data.success) {
        setSuccess(response.data.message);
        // Reset form
        setWarrantyForm({
          productModel: "",
          purchaseDate: "",
          firstName: "",
          email: "",
          mobileNumber: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register warranty");
    } finally {
      setLoading(false);
    }
  };

  // Handle innovation form submission
  const handleInnovationSubmit = async (e) => {
    e.preventDefault();
    setInnovationLoading(true);
    setInnovationError("");
    setInnovationSuccess("");

    try {
      const response = await axios.post(`${API_BASE_URL}/warranty/innovation`, innovationForm);

      if (response.data.success) {
        setInnovationSuccess(response.data.message);
        // Reset form
        setInnovationForm({
          firstName: "",
          email: "",
          message: "",
        });
      }
    } catch (err) {
      setInnovationError(err.response?.data?.message || "Failed to submit idea");
    } finally {
      setInnovationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      {/* Header Section */}
      <div className="max-w-4xl text-center mb-16">
        <FaShieldAlt className="mx-auto text-6xl text-red-600 mb-4 animate-pulse" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
          Activate Your <span className="text-red-600 drop-shadow-lg">Premium Warranty</span>
        </h1>
        <p className="text-gray-600 mt-4 text-xl font-light">
          Official Product Registration for Full Coverage Activation.
        </p>

        {/* Important Alert Banner */}
        <div className="mt-8 bg-red-600 text-white p-4 rounded-xl shadow-2xl transition hover:shadow-red-500/50">
          <p className="text-lg font-semibold flex items-center justify-center gap-3">
            <FaCalendarAlt className="text-yellow-300 text-2xl" />
            **30-Day Limit:** Please register within **30 days** of purchase to ensure full warranty coverage.
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="max-w-6xl w-full mb-6">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-center">
            <FaCheckCircle className="mr-3 text-xl" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-6xl w-full mb-6">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
            <FaExclamationTriangle className="mr-3 text-xl" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* COLUMN 1: Primary Registration Form */}
        <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-[0_15px_60px_rgba(255,0,0,0.1)] border border-red-100">
          <h2 className="text-3xl font-bold text-red-700 mb-6 border-b pb-3 flex items-center gap-3">
            <FaFileInvoice className="text-red-500" /> Warranty Registration Form
          </h2>

          <form onSubmit={handleWarrantySubmit} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
              Product Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputGroup
                label="Product Model/Serial"
                icon={FaBoxOpen}
                name="productModel"
                value={warrantyForm.productModel}
                onChange={handleWarrantyChange}
                placeholder="Enter model or serial number"
                required
              />
              <InputGroup
                label="Purchase Date"
                icon={FaCalendarAlt}
                type="date"
                name="purchaseDate"
                value={warrantyForm.purchaseDate}
                onChange={handleWarrantyChange}
                placeholder="Select purchase date"
                required
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-2 border-t pt-4">
              Purchaser Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputGroup
                label="First Name"
                icon={FaUser}
                name="firstName"
                value={warrantyForm.firstName}
                onChange={handleWarrantyChange}
                placeholder="Enter your first name"
                required
              />
              <InputGroup
                label="Email"
                icon={FaEnvelope}
                type="email"
                name="email"
                value={warrantyForm.email}
                onChange={handleWarrantyChange}
                placeholder="Enter your email"
                required
              />
              <InputGroup
                label="Mobile Number"
                icon={FaMobileAlt}
                name="mobileNumber"
                value={warrantyForm.mobileNumber}
                onChange={handleWarrantyChange}
                placeholder="Enter your mobile number"
                required
              />
            </div>

            {/* Primary Action Button */}
            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-gradient-to-r from-red-700 to-red-500 text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:scale-105 hover:shadow-red-500/50 transition-all duration-300 flex items-center gap-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="text-2xl animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaShieldAlt className="text-2xl" />
                    Activate Warranty Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* COLUMN 2: Notes & Secondary Contact Form */}
        <div className="lg:col-span-1 space-y-8">
          {/* Notes Section */}
          <div className="bg-white/95 p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              Important Notes
            </h2>
            <ul className="space-y-3 text-gray-700 text-base leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-red-500 text-lg">●</span> Keep your **purchase receipt safe** for warranty claims.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 text-lg">●</span> Register your product **within 30 days** of purchase.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 text-lg">●</span> Warranty is valid only for **original purchasers**.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 text-lg">●</span> Improper use may **void the warranty**.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 text-lg">●</span> Contact support for any warranty-related issues.
              </li>
            </ul>
          </div>

          {/* Secondary Contact Form */}
          <div className="bg-red-50 p-6 rounded-2xl shadow-xl border border-red-200">
            <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
              <FaLightbulb className="text-yellow-500" /> Share Your Ideas
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Tell us about your innovation ideas. We value your feedback!
            </p>

            {/* Innovation success/error messages */}
            {innovationSuccess && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm">
                {innovationSuccess}
              </div>
            )}
            {innovationError && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
                {innovationError}
              </div>
            )}

            <form onSubmit={handleInnovationSubmit} className="space-y-4">
              <InputGroup
                label="First Name"
                icon={FaUser}
                name="firstName"
                value={innovationForm.firstName}
                onChange={handleInnovationChange}
                placeholder="Your name"
                required
              />
              <InputGroup
                label="Email"
                icon={FaEnvelope}
                type="email"
                name="email"
                value={innovationForm.email}
                onChange={handleInnovationChange}
                placeholder="Your email"
                required
              />

              {/* Message Area */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-red-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={innovationForm.message}
                  onChange={handleInnovationChange}
                  placeholder="Tell us about your innovation ideas..."
                  rows={4}
                  className="px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 shadow-inner"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={innovationLoading}
                className="w-full bg-red-400 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {innovationLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message ✉️"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for consistent input styling
const InputGroup = ({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  max,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        max={max}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 shadow-inner transition"
      />
    </div>
  </div>
);

export default WarrantyRegistration;