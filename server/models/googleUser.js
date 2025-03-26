import mongoose from "mongoose";

const googleUserSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
  },
  { timestamps: true }
);

const googleUser = mongoose.model("GoogleUser", googleUserSchema);
export default googleUser;
