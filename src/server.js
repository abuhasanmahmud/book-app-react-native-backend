import app from "./api/index.js"; // Adjust path if needed
import dotenv from "dotenv/config";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running locally on http://localhost:${PORT}`);
});
