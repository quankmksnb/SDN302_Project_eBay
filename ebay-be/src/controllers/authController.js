import User from "../models/User.js";
import OTP from "../models/OTP.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmailOtp } from "../services/OTPServices.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

// 🧩 Bước 1: Đăng ký người dùng
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      phoneNumber,
      status: "pending",
    });

    // Gửi OTP qua email
    await sendEmailOtp(email);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧩 Bước 2: Gửi lại OTP nếu cần
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    await sendEmailOtp(email);
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

// 🧩 Bước 3: Xác thực OTP qua email
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Cập nhật trạng thái user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.emailVerified = true;
    user.status = "active";
    await user.save();

    // Đánh dấu OTP đã dùng
    record.verified = true;
    await record.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

// 🧩 Đăng nhập
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const user = await User.findOne({ email }).select(
      "+password +refreshToken"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.status === "blocked")
      return res.status(403).json({ message: "Account is blocked" });

    if (!user.emailVerified)
      return res.status(403).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧩 Cấp lại Access Token (khi hết hạn)
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Missing refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Cập nhật refresh token mới
    user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// 🧩 Đăng xuất
export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken);
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, {
          $unset: { refreshToken: "" },
        });
      }
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
