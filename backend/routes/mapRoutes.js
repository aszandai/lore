import express from 'express';

const router = express.Router();

export default (pool) => {
  router.get('/maps', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM world_maps');
      res.json(result.rows || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/maps', async (req, res) => {
    try {
      const { name, description, imageUrl } = req.body;
      const result = await pool.query(
        'INSERT INTO world_maps (name, description, image_url) VALUES ($1, $2, $3) RETURNING *',
        [name, description, imageUrl]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/maps/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, imageUrl } = req.body;
      const result = await pool.query(
        'UPDATE world_maps SET name = $1, description = $2, image_url = $3 WHERE id = $4 RETURNING *',
        [name, description, imageUrl, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/maps/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM world_maps WHERE id = $1', [id]);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
