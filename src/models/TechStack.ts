import mongoose from "mongoose";

const TechStackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: "" },
  proficiency: { 
    type: String, 
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"], 
    default: "Beginner" 
  },
  yearsOfExperience: { type: Number, default: 0 },
  lastUsed: { type: Date },
  projects: { type: [String], default: [] },
  techIcon: { type: String, default: "" } // png/svg, validate during upload
}, { timestamps: true });

export default mongoose.models.TechStack || mongoose.model("TechStack", TechStackSchema);
