import React, { useState, useEffect } from "react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");

  // Check if API is reachable
  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/health", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("API Status:", data);
          setApiStatus("online");
        } else {
          setApiStatus("offline");
          setError("API server is not responding. Please make sure the backend server is running.");
        }
      } catch (err) {
        console.error("API check failed:", err);
        setApiStatus("offline");
        setError("Cannot connect to server. Please check if the backend is running on port 5000.");
      }
    };

    checkApi();
  }, []);

  const validate = () => {
    if (!email) return "Please enter your email.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Please enter a valid email address.";
    if (!password) return "Please enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (apiStatus === "offline") {
      setError("Server is offline. Please start the backend server first.");
      return;
    }

    setLoading(true);

    try {
      // First, check if preflight works
      const preflight = await fetch("http://localhost:5000/api/auth/login", {
        method: "OPTIONS",
        mode: "cors",
        credentials: "include",
        headers: {
          "Origin": "http://localhost:5173",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type",
        },
      });
      
      console.log("Preflight status:", preflight.status);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries([...response.headers]));

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("CORS error: Access forbidden. Please check server configuration.");
        }
        const text = await response.text();
        console.log("Error response text:", text);
        throw new Error(text || `HTTP Error ${response.status}`);
      }

      const data = await response.json();
      console.log("Login response data:", data);

      if (!data.token) {
        throw new Error("No authentication token received");
      }

      // Save token
      if (remember) {
        localStorage.setItem("authToken", data.token);
      } else {
        sessionStorage.setItem("authToken", data.token);
      }

      // Show success message
      setSuccess("Login successful! Redirecting...");
      setError("");

      // Redirect after 1.5 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

      if (onLogin) onLogin(data);

    } catch (err) {
      console.error("Login error details:", err);
      setError(err.message || "Login failed. Please try again.");
      
      // If it's a network error, suggest checking the server
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Cannot connect to server. Please ensure: 1) Backend is running on port 5000, 2) No CORS errors in browser console, 3) Server is not blocked by firewall.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        {/* API Status Indicator */}
        <div className={`rounded-lg p-3 text-sm border ${
          apiStatus === "online" 
            ? "bg-green-50 text-green-700 border-green-200" 
            : apiStatus === "offline"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-yellow-50 text-yellow-700 border-yellow-200"
        }`}>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              apiStatus === "online" ? "bg-green-500" : 
              apiStatus === "offline" ? "bg-red-500" : "bg-yellow-500 animate-pulse"
            }`}></div>
            <span>
              {apiStatus === "online" ? "✅ Backend server is online" : 
               apiStatus === "offline" ? "❌ Backend server is offline" : 
               "⏳ Checking server connection..."}
            </span>
          </div>
          {apiStatus === "offline" && (
            <div className="mt-2 text-xs">
              Make sure your backend server is running at <code className="bg-gray-100 px-1 py-0.5 rounded">http://localhost:5000</code>
            </div>
          )}
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Enter your email"
              disabled={loading || apiStatus === "offline"}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Enter your password"
              disabled={loading || apiStatus === "offline"}
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                disabled={loading || apiStatus === "offline"}
              />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>

            <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              <div className="font-medium">Error</div>
              <div>{error}</div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
              <div className="font-medium">Success</div>
              <div>{success}</div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || apiStatus === "offline"}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="relative flex items-center py-3">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-sm text-gray-500">Or continue with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition"
            disabled={loading || apiStatus === "offline"}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition"
            disabled={loading || apiStatus === "offline"}
          >
            <svg className="w-5 h-5 mr-2" fill="#000000" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Create one
          </a>
        </p>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
          <div className="font-medium mb-1">Debug Info:</div>
          <div>Frontend: {window.location.origin}</div>
          <div>Backend: http://localhost:5000</div>
          <div>Status: {apiStatus}</div>
        </div>
      </div>
    </main>
  );
}