import mongoose from "mongoose";

const ContributionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectName: { type: String, required: true },
  projectUrl: { type: String, required: true },
  description: { type: String, required: true },
  contributionType: { 
    type: String, 
    enum: ['bug-fix', 'feature', 'documentation', 'translation', 'other'], 
    required: true 
  },
  pullRequestUrl: { type: String, required: true },
  stars: { type: Number, required: true, min: 0 },
  forks: { type: Number, required: true, min: 0 },
  technologies: [{ type: String }],
  date: { type: Date, required: true },
  projectLogo: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Contribution || mongoose.model("Contribution", ContributionSchema);
