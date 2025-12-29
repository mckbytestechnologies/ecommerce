import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmailFun from "../config/sendEmail.js";

// OTP email templates
import { otpEmailTemplate, otpVerificationSuccessTemplate } from "../Utilis/otpEmailTemplate.js";

// Other email templates
import { verificationEmailTemplate, passwordResetTemplate } from "../Utilis/verificationEmailTemplate.js";

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT
// Generate JWT with error handling
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRE || "7d" 
  });
};

const generateRefreshToken = (id) => {
  // Use JWT_REFRESH_SECRET if available, otherwise fallback to JWT_SECRET
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("No JWT secret found in environment variables");
  }
  const expiresIn = process.env.JWT_REFRESH_EXPIRE || process.env.JWT_EXPIRE || "30d";
  return jwt.sign({ id }, secret, { 
    expiresIn: expiresIn
  });
};

// Send OTP Email
const sendOTPEmail = async (user, otp) => {
  const emailTemplate = otpEmailTemplate(user.name, otp);
  await sendEmailFun(user.email, "Verify Your Email - OTP Required", emailTemplate.text, emailTemplate.html);
};

// Send Token Response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  user.refresh_token = refreshToken;
  user.save({ validateBeforeSave: false });

  res.status(statusCode)
    .cookie("token", token, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      token,
      refreshToken,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
};

// ==================== CONTROLLERS ====================

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but is not verified, allow resending OTP
      if (!existingUser.isVerified) {
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;
        
        existingUser.otp = { code: otp, expiresAt: otpExpires };
        existingUser.otpAttempts = 0;
        await existingUser.save({ validateBeforeSave: false });
        
        try {
          await sendOTPEmail(existingUser, otp);
          return res.status(200).json({ 
            success: true, 
            message: "User exists but not verified. New OTP sent to email.", 
            data: { 
              id: existingUser._id, 
              name: existingUser.name, 
              email: existingUser.email, 
              requiresVerification: true 
            } 
          });
        } catch (emailError) {
          console.error("OTP email error:", emailError);
          return res.status(200).json({ 
            success: true, 
            message: "User exists but not verified. Contact support for OTP.", 
            data: { 
              id: existingUser._id, 
              name: existingUser.name, 
              email: existingUser.email, 
              requiresVerification: true 
            }, 
            warning: "OTP email could not be sent" 
          });
        }
      }
      return res.status(400).json({ success: false, error: true, message: "Email already registered and verified" });
    }

    // Create new user
    const user = await User.create({ 
      name, 
      email, 
      password, 
      mobile, 
      isVerified: false 
    });

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    // Store OTP in user document
    user.otp = { code: otp, expiresAt: otpExpires };
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    // Send OTP email
    try {
      await sendOTPEmail(user, otp);
      res.status(201).json({ 
        success: true, 
        message: "Registration successful! Check email for OTP.", 
        data: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          requiresVerification: true 
        } 
      });
    } catch (emailError) {
      console.error("OTP email error:", emailError);
      res.status(201).json({ 
        success: true, 
        message: "Registration successful! Contact support for OTP.", 
        data: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          requiresVerification: true 
        }, 
        warning: "OTP email could not be sent" 
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, error: true, message: "Server error during registration" });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ADD THIS LOG
    console.log("🔐 Login attempt for email:", email, "Password length:", password?.length);
    
    if (!email || !password) return res.status(400).json({ success: false, error: true, message: "Provide email and password" });

    const user = await User.findOne({ email }).select("+password");
    
    // ADD THIS LOG
    console.log("👤 User lookup result:", {
      found: !!user,
      email: user?.email,
      hasPassword: !!user?.password,
      passwordLength: user?.password?.length,
      isVerified: user?.isVerified
    });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(401).json({ success: false, error: true, message: "Invalid credentials" });
    }
    
    // ADD THIS LOG
    console.log("🔑 Checking password...");
    const isMatch = await user.matchPassword(password);
    console.log("Password match result:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Password doesn't match for user:", email);
      return res.status(401).json({ success: false, error: true, message: "Invalid credentials" });
    }
    
    // Rest of your function remains the same...
    // ... [keep the rest of your loginUser function as is]
    
    // If user is not verified, send special response
    if (!user.isVerified) {
      return res.status(200).json({
        success: false,
        error: true,
        message: "Please verify your email first.",
        requiresVerification: true,
        email: user.email,
        canResendOTP: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: false
        }
      });
    }

    // User is verified, proceed with login
    user.last_login = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: true, message: "Server error during login" });
  }
};

// RESEND OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: true, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: true, message: "User not found" });
    
    // If user is already verified, tell them
    if (user.isVerified) {
      return res.status(200).json({ 
        success: true, 
        message: "Email is already verified. You can login directly.",
        isVerified: true
      });
    }

    // Check if OTP resend is blocked
    if (user.otpBlockedUntil && user.otpBlockedUntil > Date.now()) {
      const remainingTime = Math.ceil((user.otpBlockedUntil - Date.now()) / 60000);
      return res.status(429).json({ 
        success: false, 
        error: true, 
        message: `Too many OTP attempts. Try again in ${remainingTime} minutes.` 
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 };
    user.otpAttempts = 0; // Reset attempts when resending
    await user.save({ validateBeforeSave: false });

    // Send OTP email
    try {
      await sendOTPEmail(user, otp);
      res.status(200).json({ 
        success: true, 
        message: "New OTP sent to your email", 
        expiresIn: "10 minutes" 
      });
    } catch (emailError) {
      console.error("Resend OTP email error:", emailError);
      res.status(500).json({ success: false, error: true, message: "Failed to send OTP email" });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, error: true, message: "Server error" });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        error: true, 
        message: "Email and OTP are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: true, 
        message: "User not found" 
      });
    }
    
    console.log("OTP Verification Attempt:", {
      email: user.email,
      hasOTP: !!user.otp,
      otpCode: user.otp?.code,
      otpAttempts: user.otpAttempts,
      isVerified: user.isVerified,
      otpExpiresAt: user.otp?.expiresAt,
      currentTime: new Date()
    });

    // If user is already verified, just log them in
    if (user.isVerified) {
      console.log("User already verified, logging in directly");
      // Check if OTP matches (for re-verification if needed)
      if (user.otp && user.otp.code === otp && new Date(user.otp.expiresAt) > new Date()) {
        user.otp = undefined;
        user.otpAttempts = 0;
        await user.save({ validateBeforeSave: false });
      }
      
      // Send token response
      return sendTokenResponse(user, 200, res);
    }

    // Check if OTP verification is blocked
    if (user.otpBlockedUntil && new Date(user.otpBlockedUntil) > new Date()) {
      const remainingTime = Math.ceil((new Date(user.otpBlockedUntil) - new Date()) / 60000);
      return res.status(429).json({ 
        success: false, 
        error: true, 
        message: `OTP verification blocked. Try again in ${remainingTime} minutes.` 
      });
    }

    // Check if OTP exists and is valid
    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      console.log("No OTP found for user:", email);
      return res.status(400).json({ 
        success: false, 
        error: true, 
        message: "No OTP found. Please request a new one." 
      });
    }

    // Convert expiresAt to Date object if it's a string
    const expiresAt = new Date(user.otp.expiresAt);
    if (expiresAt < new Date()) {
      console.log("OTP expired for user:", email, "Expired at:", expiresAt, "Current:", new Date());
      return res.status(400).json({ 
        success: false, 
        error: true, 
        message: "OTP expired. Request new one." 
      });
    }

    // Verify OTP
    console.log("Comparing OTPs - Expected:", user.otp.code, "Type:", typeof user.otp.code, 
                "Received:", otp, "Type:", typeof otp);
    
    // Convert both to strings for comparison
    const expectedOTP = String(user.otp.code).trim();
    const receivedOTP = String(otp).trim();
    
    console.log("Trimmed - Expected:", expectedOTP, "Received:", receivedOTP);
    
    if (expectedOTP !== receivedOTP) {
      console.log("Invalid OTP entered");
      
      // Ensure otpAttempts is a number
      let attempts = parseInt(user.otpAttempts) || 0;
      attempts += 1;
      user.otpAttempts = attempts;
      await user.save({ validateBeforeSave: false });
      
      console.log("Updated attempts:", attempts);
      
      if (attempts >= 5) {
        user.otpBlockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        await user.save({ validateBeforeSave: false });
        return res.status(429).json({ 
          success: false, 
          error: true, 
          message: "Too many failed attempts. OTP blocked for 30 minutes." 
        });
      }
      
      const remainingAttempts = 5 - attempts;
      return res.status(400).json({ 
        success: false, 
        error: true, 
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.` 
      });
    }

    // OTP is correct - verify user
    console.log("OTP is correct! Verifying user...");
    user.isVerified = true;
    user.email_verified = true;
    user.status = "active";
    user.verifiedAt = new Date();
    user.otp = undefined;
    user.otpAttempts = 0;
    user.otpBlockedUntil = undefined;
    
    await user.save({ validateBeforeSave: false });

    console.log("User verified successfully:", user.email);

    // Send verification success email
    try {
      const successTemplate = otpVerificationSuccessTemplate(user.name);
      await sendEmailFun(user.email, "Email Verified Successfully!", successTemplate.text, successTemplate.html);
      console.log("Verification success email sent to:", user.email);
    } catch (emailError) {
      console.error("Success email error:", emailError);
    }
    
    // Send token response
    sendTokenResponse(user, 200, res);
    
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ 
      success: false, 
      error: true, 
      message: "Server error during OTP verification" 
    });
  }
};

// CHECK VERIFICATION STATUS
export const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: true, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: true, message: "User not found" });

    res.status(200).json({
      success: true,
      data: {
        isVerified: user.isVerified,
        email: user.email,
        name: user.name,
        canResendOTP: !user.isVerified,
        otpBlockedUntil: user.otpBlockedUntil,
        verifiedAt: user.verifiedAt
      }
    });
  } catch (error) {
    console.error("Check verification error:", error);
    res.status(500).json({ success: false, error: true, message: "Server error" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: true, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: true, message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const emailTemplate = passwordResetTemplate(user.name, resetToken);
    await sendEmailFun(user.email, "Password Reset Request", emailTemplate.text, emailTemplate.html);

    res.status(200).json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, error: true, message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { resettoken } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ resetPasswordToken: resettoken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, error: true, message: "Invalid or expired token" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, error: true, message: "Server error" });
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ success: false, error: true, message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, error: true, message: "Invalid refresh token" });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(401).json({ success: false, error: true, message: "Invalid refresh token" });
  }
};

// GET ME
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

// UPDATE DETAILS
export const updateDetails = async (req, res) => {
  const { name, email, mobile } = req.body;
  const updatedData = { name, email, mobile };
  const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: user });
};

// UPDATE PASSWORD
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({ success: false, error: true, message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
};

// LOGOUT
export const logoutUser = async (req, res) => {
  res.cookie("token", "none", { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.cookie("refreshToken", "none", { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};