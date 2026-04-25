import mongoose from "mongoose";

export const connect = async () => {
  try {
    const mongoUri =
      "mongodb+srv://admin:admin@cluster0.sci9jms.mongodb.net/sikbo"

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};