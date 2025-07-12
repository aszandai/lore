import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import blogRoutes from './routes/blogRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import mapRegionRoutes from './routes/mapRegionRoutes.js';

dotenv.config({ path: '../.env' });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Use modular routes
app.use(blogRoutes(pool));
app.use(characterRoutes(pool));
app.use(mapRoutes(pool));
app.use(mapRegionRoutes(pool));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
