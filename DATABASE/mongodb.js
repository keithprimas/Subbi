import mongoose from "mongoose";
import {DB_URI, NODE_ENV} from "../config/env.js";

if (!DB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside the .env<development/production>.local");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI); 

        console.log(`MongoDB connected: ${NODE_ENV}`);
    } catch (error) {
        console.error("MongoDB connection error: ", error);
        process.exit(1);
    }
}

export default connectToDatabase;