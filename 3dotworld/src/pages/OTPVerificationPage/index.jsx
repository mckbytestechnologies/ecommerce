import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const BACKEND_URL = "https://ecommerce-server-fhna.onrender.com";

  // Get email from navigation state or localStorage
  const email = location.state?.email || localStorage.getItem("pendingVerificationEmail") || "";
  const userName = location.state?.name || "";
  const fromLogin = location.state?.fromLogin || false;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const inputRefs = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      console.warn("No email found for OTP verification");
      navigate(fromLogin ? "/login" : "/register");
      return;
    }
    
    console.log("OTP Verification for email:", email, "fromLogin:", fromLogin);
    
    // Store email in localStorage for backup
    localStorage.setItem("pendingVerificationEmail", email);
  }, [email, navigate, fromLogin]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle OTP input change
  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (pasteData.length === 6 && !isNaN(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Verifying OTP for:", email);
      
      const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();
      console.log("OTP Verification Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Save tokens if provided
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.data));
        
        // Clear pending email
        localStorage.removeItem("pendingVerificationEmail");
      }

      setSuccess("Email verified successfully! Redirecting to dashboard...");
      setAttempts(0);

      // Redirect after delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError(err.message);
      setAttempts(prev => prev + 1);
      
      // Block after too many attempts
      if (attempts >= 4) {
        setCountdown(300); // 5 minutes
        setError("Too many failed attempts. Please wait 5 minutes or request a new OTP.");
      }
      
      // Clear OTP fields on error
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0 || resendCount >= 3) return;

    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Resending OTP to:", email);
      
      const response = await fetch(`${BACKEND_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Resend OTP Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setResendCount(prev => prev + 1);
      setSuccess(data.message || "New OTP sent to your email!");
      setCountdown(60); // 1 minute cooldown
      setAttempts(0);
      
      // Clear OTP fields
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }

    } catch (err) {
      console.error("Resend OTP Error:", err);
      setError(err.message);
      if (resendCount >= 2) {
        setError("Too many resend attempts. Please try again later.");
        setCountdown(300);
      }
    } finally {
      setResendLoading(false);
    }
  };

  // Format countdown time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <div className="text-2xl font-bold text-gray-900">YourStore</div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {fromLogin ? "Verify to Login" : "Verify Your Email"}
          </h1>
          <p className="text-gray-600">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-blue-600">{email}</span>
          </p>
          {userName && (
            <p className="text-sm text-gray-500 mt-1">Welcome, {userName}!</p>
          )}
        </div>

        {/* OTP Verification Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                6-Digit Verification Code
              </label>
              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    disabled={loading || countdown > 0}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>
              
              <p className="text-xs text-gray-500 text-center mb-4">
                Click on the first box and enter the code from your email
              </p>
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

            {/* Attempts Warning */}
            {attempts > 0 && attempts < 3 && (
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700 text-center">
                  ⚠️ {attempts} failed attempt{attempts > 1 ? 's' : ''}. {5 - attempts} attempts remaining.
                </p>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || countdown > 0 || otp.join("").length !== 6}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                loading || countdown > 0 || otp.join("").length !== 6
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
                  Verifying...
                </div>
              ) : (
                "Verify & Continue"
              )}
            </button>

            {/* Resend OTP Section */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading || countdown > 0 || resendCount >= 3}
                  className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              </p>
              
              {countdown > 0 && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Wait {formatTime(countdown)}</span> before requesting new code
                </p>
              )}

              {resendCount >= 2 && (
                <p className="text-xs text-yellow-600">
                  ⚠️ You can resend OTP {3 - resendCount} more time(s)
                </p>
              )}
            </div>

            {/* Navigation Links */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => navigate(fromLogin ? "/login" : "/register")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Back to {fromLogin ? "Login" : "Register"}
                </button>
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Already verified? Sign in →
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Help Information */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium">Need help?</p>
              <p className="text-xs text-blue-600 mt-1">
                • Check your spam/junk folder<br/>
                • The OTP expires in 10 minutes<br/>
                • Contact support if you don't receive the email
              </p>
            </div>
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Debug Info:</strong><br/>
              Email: {email}<br/>
              From Login: {fromLogin ? "Yes" : "No"}<br/>
              Attempts: {attempts} | Resends: {resendCount}<br/>
              OTP: {otp.join("")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}