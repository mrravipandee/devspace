import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  featureImage: { type: String, default: "" }, // Max 2MB handled in upload
  tags: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
