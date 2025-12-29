import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const BACKEND_URL = "https://ecommerce-server-fhna.onrender.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    agreeToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check API health
  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/health`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          setApiStatus("online");
        } else {
          setApiStatus("offline");
        }
      } catch (err) {
        console.error("API Health Check Error:", err);
        setApiStatus("offline");
      }
    };
    checkApi();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle mobile number input
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, mobile: value.slice(0, 10) }));
  };

  // Form validation
  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("Name is required");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) errors.push("Email is required");
    else if (!emailRegex.test(formData.email))
      errors.push("Enter a valid email address");

    if (!formData.password) errors.push("Password is required");
    else if (formData.password.length < 6)
      errors.push("Password must be at least 6 characters");
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      errors.push("Password must contain uppercase, lowercase letters and numbers");

    if (formData.password !== formData.confirmPassword)
      errors.push("Passwords do not match");

    if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile))
      errors.push("Enter a valid 10-digit mobile number");

    if (!formData.agreeToTerms)
      errors.push("You must agree to the Terms of Service and Privacy Policy");

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(". "));
      return;
    }

    if (apiStatus === "offline") {
      setError("Backend server is offline. Please start it first.");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        mobile: formData.mobile || undefined,
      };

      console.log("Registering user:", userData);

      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (!response.ok) {
        throw new Error(data.message || `Registration failed (${response.status})`);
      }

      // Check if verification is required
      if (data.requiresVerification) {
        setSuccess("Registration successful! Redirecting to OTP verification...");
        
        // Store email in localStorage for backup
        localStorage.setItem("pendingVerificationEmail", userData.email);
        
        // Navigate to OTP verification page
        setTimeout(() => {
          navigate("/otp-verify", {
            state: { 
              email: userData.email,
              name: userData.name,
              fromRegister: true
            },
          });
        }, 1500);
      } else {
        // Direct login if no verification required
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("user", JSON.stringify(data.data));
        }
        
        setSuccess("Registration successful! Redirecting to dashboard...");
        setTimeout(() => navigate("/dashboard"), 2000);
      }

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <div className="text-2xl font-bold text-gray-900">YourStore</div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our community today</p>
        </div>

        {/* API Status Indicator */}
        <div className={`mb-6 p-3 rounded-lg text-center text-sm font-medium ${
          apiStatus === "online" 
            ? "bg-green-50 text-green-700 border border-green-200"
            : apiStatus === "offline"
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
        }`}>
          {apiStatus === "online" && "✅ Backend server is online"}
          {apiStatus === "offline" && "❌ Backend server is offline"}
          {apiStatus === "checking" && "🔄 Checking server status..."}
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="john@example.com"
                required
                disabled={loading}
              />
            </div>

            {/* Mobile Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number (Optional)
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleMobileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="9876543210"
                maxLength="10"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-12"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-12"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
                disabled={loading}
                id="termsCheckbox"
              />
              <label htmlFor="termsCheckbox" className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-700">{success}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || apiStatus === "offline"}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                loading || apiStatus === "offline"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Debug Info:</strong> API: {apiStatus} | Email: {formData.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}