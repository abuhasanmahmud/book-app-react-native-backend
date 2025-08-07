import express from "express";
import cors from "cors"; // ✅ IMPORT CORS
import dotenv from "dotenv/config";

import authRoutes from "../routes/authRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import { connectDB } from "../lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8081", // ✅ match with your Expo web frontend
    credentials: true, // ✅ needed if sending cookies
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("App works properly!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
