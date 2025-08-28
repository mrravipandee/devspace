import mongoose from "mongoose";

const TechStackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'other'], 
    required: true 
  },
  proficiency: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'], 
    required: true 
  },
  icon: { type: String, default: '' },
  yearsOfExperience: { type: Number, required: true, min: 0, max: 50 },
  lastUsed: { type: Date, required: true },
  projects: [{ type: String }],
  description: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.TechStack || mongoose.model("TechStack", TechStackSchema);
