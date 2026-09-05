import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not set. Add it to backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
