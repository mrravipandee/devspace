import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  throw new Error("❌ Please define the MONGO_URI environment variable in .env.local");
}

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      dbName: 'devspace-auth',
    });

    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("✅ MongoDB connected successfully");
    } else {
      console.log("❌ MongoDB connection failed");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("MongoDB connection error");
  }
};

export default dbConnect;
