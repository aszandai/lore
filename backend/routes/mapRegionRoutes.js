import express from 'express';

const router = express.Router();

export default (pool) => {
  router.get('/map_regions', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM map_regions');
      res.json(result.rows || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/map_regions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM map_regions WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/map_regions', async (req, res) => {
    try {
      const { world_map_id, name, description, color, path } = req.body;
      const result = await pool.query(
        'INSERT INTO map_regions (world_map_id, name, description, color, path) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [world_map_id, name, description, color, path]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/map_regions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { world_map_id, name, description, color, path } = req.body;
      const result = await pool.query(
        'UPDATE map_regions SET world_map_id = $1, name = $2, description = $3, color = $4, path = $5 WHERE id = $6 RETURNING *',
        [world_map_id, name, description, color, path, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/map_regions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM map_regions WHERE id = $1', [id]);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
