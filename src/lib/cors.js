// lib/cors.js

import Cors from "cors";

// Initialize the cors middleware
const cors = Cors({
  origin: "*", // or "http://localhost:8081" if you want to restrict
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

// Helper to wait for a middleware to execute before continuing
export function runCorsMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default cors;
