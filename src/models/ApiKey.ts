import mongoose, { Schema, Document } from "mongoose";

export interface IApiKey extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  key: string;
  isActive: boolean;
  lastUsed?: Date;
  permissions: string[];
  rateLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUsed: {
      type: Date,
    },
    permissions: {
      type: [String],
      default: ["read"],
      enum: ["read", "write", "delete"],
    },
    rateLimit: {
      type: Number,
      default: 1000, // requests per hour
    },
  },
  { timestamps: true }
);

// Index for faster queries
ApiKeySchema.index({ userId: 1, isActive: 1 });
ApiKeySchema.index({ key: 1 });

export default mongoose.models.ApiKey || mongoose.model<IApiKey>("ApiKey", ApiKeySchema);
