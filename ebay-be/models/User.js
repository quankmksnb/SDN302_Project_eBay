import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullname: String,
    password: { type: String, required: true },
    role: { type: String, default: "user" }, //Add enum [addmin, user, seller,...]
    avatarURL: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema, "users");
