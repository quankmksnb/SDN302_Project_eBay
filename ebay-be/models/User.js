import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    fullname: String,

    // Có thể null nếu user đăng nhập bằng Google
    password: { type: String },

    role: { type: String, default: "user", enum: ["admin", "user", "seller"] },
    avatarURL: { type: String },

    // Thông tin xác thực số điện thoại
    phone: { type: String, unique: true, sparse: true },
    phoneVerified: { type: Boolean, default: false },

    // Google login
    googleId: { type: String, unique: true, sparse: true },
    provider: { type: String, enum: ["local", "google"], default: "local" },

    // Trạng thái tài khoản
    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema, "users");
