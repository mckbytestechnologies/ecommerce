import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  verifyOTP,
  resendOTP,
  checkVerificationStatus
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.post("/refresh", refreshToken);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/check-verification", checkVerificationStatus);

// Protected routes
router.use(authenticate);
router.get("/me", getMe);
router.put("/updatedetails", updateDetails);
router.put("/updatepassword", updatePassword);
router.post("/logout", logoutUser);

export default router;