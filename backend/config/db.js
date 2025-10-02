import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectTODB = async () => {
  const MONGOURL = process.env.MONGO_URL;
  try {
    await mongoose.connect(MONGOURL);
    console.log("connected to db");
  } catch (error) {
    console.log("error connvecting db");
  }
};
