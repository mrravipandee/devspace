import mongoose from "mongoose";

const ContributionSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  contributionType: { 
    type: String, 
    enum: ["Bug Fix", "Feature", "Docs", "Translation", "Other"], 
    required: true 
  },
  projectUrl: { type: String, default: "" },
  pullRequestUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  techLogos: { type: [String], default: [] }, 
  projectLogo: { type: String, default: "" } 
}, { timestamps: true });

export default mongoose.models.Contribution || mongoose.model("Contribution", ContributionSchema);
