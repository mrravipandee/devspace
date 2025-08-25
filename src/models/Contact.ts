import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  userIp: { type: String, default: 'Unknown' },
  userAgent: { type: String, default: 'Unknown' },
  location: { type: String, default: 'Unknown' },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' }
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
