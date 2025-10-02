import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { connectTODB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

dotenv.config();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  cookieParser({
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
    signed: true,
  })
);

app.get("/", (req, res) => {
  res.send({
    message: "hi",
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("listening on port", PORT);
  connectTODB();
  mongoose;
});

app.use("/auth", authRoutes);
// app.use("/class", classroomRoutes);
