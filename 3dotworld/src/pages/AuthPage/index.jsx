import React, { useState, useEffect } from "react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
    apiOnline: false,
    checking: true,
  });

  const BACKEND_URL = "https://ecommerce-server-fhna.onrender.com";

  // -------------------------------
  // API Health Check (Production Safe)
  // -------------------------------
  useEffect(() => {
    const verifyApi = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/health`);
        if (res.ok) {
          setStatus((p) => ({ ...p, apiOnline: true, checking: false }));
        } else {
          throw new Error();
        }
      } catch {
        setStatus((p) => ({
          ...p,
          apiOnline: false,
          checking: false,
          error: "Backend server is offline.",
        }));
      }
    };
    verifyApi();
  }, []);

  // -------------------------------
  // Validation
  // -------------------------------
  const validate = () => {
    if (!email.trim()) return "Enter your email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email address.";
    if (!password) return "Enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  // -------------------------------
  // Submit Handler (Production Ready)
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validate();

    if (errorMsg)
      return setStatus((p) => ({ ...p, error: errorMsg, success: "" }));

    if (!status.apiOnline)
      return setStatus((p) => ({
        ...p,
        error: "Backend is offline. Start the server first.",
      }));

    setStatus((p) => ({ ...p, loading: true, error: "", success: "" }));

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
      }

      const data = await res.json();
      if (!data.token) throw new Error("Invalid response from server.");

      // Save token
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("authToken", data.token);

      setStatus((p) => ({
        ...p,
        success: "Login successful. Redirecting...",
        loading: false,
      }));

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

      onLogin && onLogin(data);
    } catch (err) {
      setStatus((p) => ({
        ...p,
        loading: false,
        error: err.message || "Login failed.",
      }));
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600 text-sm">Sign in to your account</p>
        </div>

        {/* Server Status */}
        {!status.checking && (
          <div
            className={`p-3 text-sm rounded-lg border ${
              status.apiOnline
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {status.apiOnline
              ? "Backend server is online"
              : "Backend server is offline"}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email Address
            </label>
            <input
              disabled={status.loading}
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              disabled={status.loading}
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>

            <a href="/forgot-password" className="text-indigo-600 font-medium">
              Forgot password?
            </a>
          </div>

          {/* Error */}
          {status.error && (
            <div className="p-3 text-sm rounded-lg bg-red-50 text-red-700 border border-red-200">
              {status.error}
            </div>
          )}

          {/* Success */}
          {status.success && (
            <div className="p-3 text-sm rounded-lg bg-green-50 text-green-700 border border-green-200">
              {status.success}
            </div>
          )}

          <button
            disabled={status.loading || !status.apiOnline}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg"
          >
            {status.loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
