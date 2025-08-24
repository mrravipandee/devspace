import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeFile: { type: String, required: true }, // PDF, max 2MB
  uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
