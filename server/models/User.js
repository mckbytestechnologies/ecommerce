import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    mobile: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    date_of_birth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    refresh_token: {
      type: String,
      select: false,
    },
    
    // OTP Verification Fields - REMOVED select: false FROM THESE
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: String, // Removed select: false
      expiresAt: Date, // Removed select: false
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    otpBlockedUntil: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
    },
    
    // Email verification (keep for backward compatibility)
    email_verified: {
      type: Boolean,
      default: false,
    },
    email_verification_token: {
      type: String,
      select: false,
    },
    email_verification_expires: {
      type: Date,
      select: false,
    },
    
    last_login: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending_verification"],
      default: "pending_verification",
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    preferences: {
      newsletter: {
        type: Boolean,
        default: true,
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
    stats: {
      total_orders: {
        type: Number,
        default: 0,
      },
      total_spent: {
        type: Number,
        default: 0,
      },
      last_otp_sent: {
        type: Date,
      },
    },
    
    // Security fields
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
    failed_login_attempts: {
      type: Number,
      default: 0,
      select: false,
    },
    account_locked_until: {
      type: Date,
      select: false,
    },
    
    // Audit fields
    created_ip: {
      type: String,
      select: false,
    },
    last_ip: {
      type: String,
      select: false,
    },
    
    // Soft delete
    deleted_at: {
      type: Date,
      select: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        // Remove sensitive fields
        delete ret.password;
        delete ret.refresh_token;
        delete ret.otp;
        delete ret.otpAttempts;
        delete ret.otpBlockedUntil;
        delete ret.email_verification_token;
        delete ret.email_verification_expires;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        delete ret.failed_login_attempts;
        delete ret.account_locked_until;
        delete ret.created_ip;
        delete ret.last_ip;
        delete ret.deleted_at;
        delete ret.is_deleted;
        return ret;
      }
    },
    toObject: { 
      virtuals: true,
      transform: function(doc, ret) {
        // Remove sensitive fields
        delete ret.password;
        delete ret.refresh_token;
        delete ret.otp;
        delete ret.otpAttempts;
        delete ret.otpBlockedUntil;
        delete ret.email_verification_token;
        delete ret.email_verification_expires;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        delete ret.failed_login_attempts;
        delete ret.account_locked_until;
        delete ret.created_ip;
        delete ret.last_ip;
        delete ret.deleted_at;
        delete ret.is_deleted;
        return ret;
      }
    }
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for account age in days
userSchema.virtual('accountAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamps and set status based on verification
userSchema.pre("save", function(next) {
  // If this is a new user and not verified, set status to pending_verification
  if (this.isNew && !this.isVerified) {
    this.status = "pending_verification";
  }
  
  // If user gets verified, update status to active and set verification date
  if (this.isModified('isVerified') && this.isVerified) {
    this.status = "active";
    this.email_verified = true;
    if (!this.verifiedAt) {
      this.verifiedAt = new Date();
    }
  }
  
  // Keep email_verified in sync with isVerified
  if (this.isModified('isVerified')) {
    this.email_verified = this.isVerified;
  }
  
  // If isVerified is true, make sure email_verified is also true
  if (this.isVerified && !this.email_verified) {
    this.email_verified = true;
  }
  
  next();
});

// Match password method
// Match password method - ADD LOGGING
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    console.log("🔐 matchPassword called for user:", this.email);
    console.log("Entered password length:", enteredPassword?.length);
    console.log("Stored password exists:", !!this.password);
    console.log("Stored password length:", this.password?.length);
    
    if (!this.password) {
      console.error("❌ No password stored for user:", this.email);
      return false;
    }
    
    const result = await bcrypt.compare(enteredPassword, this.password);
    console.log("🔐 bcrypt.compare result:", result);
    return result;
  } catch (error) {
    console.error("❌ Error in matchPassword for user:", this.email, error);
    return false;
  }
};

// Check if OTP is valid
userSchema.methods.isOTPValid = function(otpCode) {
  // Check if OTP exists
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    return { valid: false, reason: "No OTP found" };
  }
  
  // Check if OTP is expired
  if (this.otp.expiresAt < new Date()) {
    return { valid: false, reason: "OTP expired" };
  }
  
  // Check if OTP matches
  if (this.otp.code !== otpCode) {
    return { valid: false, reason: "Invalid OTP" };
  }
  
  // Check if account is blocked from OTP attempts
  if (this.otpBlockedUntil && this.otpBlockedUntil > new Date()) {
    return { 
      valid: false, 
      reason: "Too many failed attempts", 
      blockedUntil: this.otpBlockedUntil 
    };
  }
  
  return { valid: true };
};

// Generate OTP (static method)
userSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Set OTP with expiry
userSchema.methods.setOTP = function(expiryMinutes = 10) {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  
  this.otp = {
    code: otpCode,
    expiresAt: expiresAt
  };
  
  if (!this.stats) {
    this.stats = {};
  }
  this.stats.last_otp_sent = new Date();
  
  return otpCode;
};

// Clear OTP
userSchema.methods.clearOTP = function() {
  this.otp = undefined;
  this.otpAttempts = 0;
  this.otpBlockedUntil = undefined;
};

// Increment OTP attempts and check if should block
userSchema.methods.incrementOTPAttempts = function() {
  this.otpAttempts = (this.otpAttempts || 0) + 1;
  
  // Block after 5 failed attempts for 30 minutes
  if (this.otpAttempts >= 5) {
    this.otpBlockedUntil = new Date(Date.now() + 30 * 60 * 1000);
  }
};

// Check if user can request OTP (rate limiting)
userSchema.methods.canRequestOTP = function(minutesBetweenRequests = 1) {
  if (!this.stats || !this.stats.last_otp_sent) return true;
  
  const timeSinceLastOTP = Date.now() - this.stats.last_otp_sent;
  const minTimeBetween = minutesBetweenRequests * 60 * 1000;
  
  return timeSinceLastOTP > minTimeBetween;
};

// Get remaining OTP attempts
userSchema.methods.getRemainingOTPAttempts = function() {
  return Math.max(0, 5 - (this.otpAttempts || 0));
};

// Verify OTP and update user status
userSchema.methods.verifyOTP = function(otpCode) {
  const otpValidation = this.isOTPValid(otpCode);
  
  if (!otpValidation.valid) {
    // Increment attempts if OTP is invalid
    if (otpValidation.reason === "Invalid OTP") {
      this.incrementOTPAttempts();
    }
    return otpValidation;
  }
  
  // OTP is valid - verify user
  this.isVerified = true;
  this.email_verified = true;
  this.status = "active";
  this.verifiedAt = new Date();
  this.clearOTP();
  
  return { valid: true, verified: true };
};

// Check if user is active
userSchema.methods.isActive = function() {
  return this.status === "active" && this.isVerified && !this.is_deleted;
};

// Soft delete method
userSchema.methods.softDelete = function() {
  this.is_deleted = true;
  this.deleted_at = new Date();
  this.status = "inactive";
};

// Restore method
userSchema.methods.restore = function() {
  this.is_deleted = false;
  this.deleted_at = undefined;
  this.status = this.isVerified ? "active" : "pending_verification";
};

// Indexes for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ status: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ "otp.expiresAt": 1 }, { expireAfterSeconds: 0 });
userSchema.index({ createdAt: 1 });
userSchema.index({ "stats.total_orders": -1 });
userSchema.index({ is_deleted: 1 });

// Query helper to exclude deleted users by default
userSchema.pre(/^find/, function(next) {
  if (!this.getQuery().is_deleted && !this.getQuery().$or?.some(q => q.is_deleted)) {
    this.where({ is_deleted: { $ne: true } });
  }
  next();
});

// Query helper for active users only
userSchema.query.active = function() {
  return this.where({ 
    status: "active", 
    isVerified: true,
    is_deleted: { $ne: true }
  });
};

// Query helper for pending verification
userSchema.query.pendingVerification = function() {
  return this.where({ 
    status: "pending_verification",
    isVerified: false,
    is_deleted: { $ne: true }
  });
};

// Query helper for verified users
userSchema.query.verified = function() {
  return this.where({ 
    isVerified: true,
    is_deleted: { $ne: true }
  });
};

// Method to get user data safely (excludes sensitive fields)
userSchema.methods.getSafeData = function() {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.password;
  delete userObject.refresh_token;
  delete userObject.otp;
  delete userObject.otpAttempts;
  delete userObject.otpBlockedUntil;
  delete userObject.email_verification_token;
  delete userObject.email_verification_expires;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  delete userObject.failed_login_attempts;
  delete userObject.account_locked_until;
  delete userObject.created_ip;
  delete userObject.last_ip;
  delete userObject.deleted_at;
  delete userObject.is_deleted;
  
  return userObject;
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;