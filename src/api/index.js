import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import serverless from "serverless-http";

import authRoutes from "../routes/authRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import { connectDB } from "../lib/db.js";

const app = express();
connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8081", // update this to your actual frontend URL
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("App works properly on Vercel!");
});

export const handler = serverless(app);
export default app;
