import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Set up multer for local uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "backend", "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

export default (pool) => {
  router.get("/maps", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM world_maps");
      res.json(result.rows || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/maps", upload.single("image"), async (req, res) => {
    try {
      const { name, description } = req.body;
      let imageUrl;
      if (!req.file) {
        return res.status(400).json({ error: "Image is required." });
      } else {
        imageUrl = `/backend/uploads/${req.file.filename}`;
      }
      const result = await pool.query(
        "INSERT INTO world_maps (name, description, image_url) VALUES ($1, $2, $3) RETURNING *",
        [name, description, imageUrl]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/maps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const mapResult = await pool.query(
        "SELECT * FROM world_maps WHERE id = $1",
        [id]
      );

      if (!mapResult.rows.length) {
        return res.status(404).json({ error: "Map not found" });
      }
      const map = mapResult.rows[0];
      const regionsResult = await pool.query(
        "SELECT * FROM map_regions WHERE world_map_id = $1",
        [id]
      );
      map.regions = regionsResult.rows || [];

      res.json(map);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put("/maps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, imageUrl } = req.body;
      const result = await pool.query(
        "UPDATE world_maps SET name = $1, description = $2, image_url = $3 WHERE id = $4 RETURNING *",
        [name, description, imageUrl, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete("/maps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM world_maps WHERE id = $1", [id]);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
