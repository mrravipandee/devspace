import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  tech: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ["Planned", "Ongoing", "Completed"], default: "Planned" },
  members: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  liveLink: { type: String, default: "" },
  sourceCode: { type: String, default: "" },
  projectLogo: { type: String, default: "" },
  techLogos: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
