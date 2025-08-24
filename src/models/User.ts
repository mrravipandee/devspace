import mongoose from "mongoose";

const SocialHandleSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const UsefulLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  profileImage: { type: String, default: "" },
  profileImagePublicId: { type: String, default: "" },
  location: { type: String, default: "" },
  bio: { type: String, default: "" },
  availableForWork: { type: Boolean, default: false },

  socialHandles: {
    type: [SocialHandleSchema],
    default: [],
    validate: [(val: any[]) => val.length <= 15, '{PATH} exceeds 15 handles']
  },

  usefulLinks: {
    type: [UsefulLinkSchema],
    default: [],
    validate: [(val: any[]) => val.length <= 50, '{PATH} exceeds 50 links']
  },

  profileCompleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
