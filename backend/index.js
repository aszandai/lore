import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import blogRoutes from "./routes/blogRoutes.js";
import characterRoutes from "./routes/characterRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import mapRegionRoutes from "./routes/mapRegionRoutes.js";
import path from "path";

dotenv.config({ path: [".env.local", ".env"] });
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

// Serve static files from uploads directory with CORS headers
app.use(
  "/backend/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(path.join(process.cwd(), "uploads"))
);

// Only use express.json() for routes that expect JSON, not for file upload
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(blogRoutes(pool));
app.use(characterRoutes(pool));
app.use(mapRoutes(pool));
app.use(mapRegionRoutes(pool));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
