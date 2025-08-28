import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  type: { 
    type: String, 
    enum: ["certification", "hackathon", "internship", "project", "challenge"], 
    required: true 
  },
  image: { type: String, default: "" },
  issuer: { type: String, required: true },
  date: { type: Date, default: Date.now },
  verificationUrl: { type: String, required: true },
  skills: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
