import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Certificate", "Hackathon", "Internship", "Project", "Coding Challenge"], 
    required: true 
  },
  date: { type: Date, default: Date.now },
  description: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
