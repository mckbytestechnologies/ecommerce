import UserModel from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"; // 🔥 ADD THIS
import sendEmailFun from "../config/sendEmail.js";
import { verificationEmailTemplate } from "../Utilis/verificationEmailTemplate.js";

// 🔥 ADD TOKEN GENERATION FUNCTION
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: "7d",
  });
};

export async function registerUser(request, response) {
  try {
    const { name, email, password } = request.body;
    
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide email, name and password",
        error: true,
        success: false
      });
    }

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return response.status(400).json({
        message: "Email already registered",
        error: true,
        success: false
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = new UserModel({
      email: email,
      password: hashedPassword,
      name: name,
      forgot_password_otp: verifyCode,
      forgot_password_expiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    await user.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${user._id}`;
    const emailTemplate = verificationEmailTemplate(name, verifyCode);

    const emailSent = await sendEmailFun(
      email,
      "Verify Email - McKbytes",
      emailTemplate.text,
      emailTemplate.html
    );

    if (!emailSent) {
      return response.status(500).json({
        message: "Failed to send verification email",
        error: true,
        success: false
      });
    }

    // 🔥 GENERATE TOKEN FOR REGISTRATION TOO
    const token = generateToken(user._id);

    return response.status(201).json({
      message: "User registered successfully. Verification email sent.",
      success: true,
      error: false,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token // 🔥 ADD TOKEN HERE
      }
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function loginUser(request, response) {
  try {
    const { email, password } = request.body;
    
    if (!email || !password) {
      return response.status(400).json({
        message: "Provide email and password",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return response.status(400).json({
        message: "Invalid email or password",
        error: true,
        success: false
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(400).json({
        message: "Invalid email or password",
        error: true,
        success: false
      });
    }

    // Update last login date
    user.last_login_date = new Date();
    await user.save();

    // 🔥 GENERATE TOKEN
    const token = generateToken(user._id);

    return response.status(200).json({
      message: "Login successful",
      success: true,
      error: false,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token // 🔥 THIS IS WHAT YOU'RE MISSING
      }
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function getUsers(request, response) {
  try {
    const users = await UserModel.find().select('-password -refresh_token');
    
    return response.status(200).json({
      message: "Users fetched successfully",
      success: true,
      error: false,
      data: users
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}