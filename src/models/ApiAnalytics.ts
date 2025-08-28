import mongoose from "mongoose";

const ApiAnalyticsSchema = new mongoose.Schema({
  username: { type: String, required: true },
  endpoint: { type: String, required: true },
  method: { type: String, required: true, default: 'GET' },
  ip: { type: String, required: true },
  userAgent: { type: String },
  referer: { type: String },
  website: { type: String },
  responseTime: { type: Number }, // in milliseconds
  statusCode: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient querying
ApiAnalyticsSchema.index({ username: 1, timestamp: -1 });
ApiAnalyticsSchema.index({ endpoint: 1, timestamp: -1 });
ApiAnalyticsSchema.index({ website: 1, timestamp: -1 });

export default mongoose.models.ApiAnalytics || mongoose.model("ApiAnalytics", ApiAnalyticsSchema);
