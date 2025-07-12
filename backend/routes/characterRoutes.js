import express from 'express';

const router = express.Router();

export default (pool) => {
  router.get('/characters', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM characters');
      res.json(result.rows || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/characters', async (req, res) => {
    try {
      const { name, type, location, description, notes, tags } = req.body;
      const result = await pool.query(
        'INSERT INTO characters (name, type, location, description, notes, tags, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
        [name, type, location, description, notes, tags]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/characters/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, type, location, description, notes, tags } = req.body;
      const result = await pool.query(
        'UPDATE characters SET name = $1, type = $2, location = $3, description = $4, notes = $5, tags = $6 WHERE id = $7 RETURNING *',
        [name, type, location, description, notes, tags, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/characters/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM characters WHERE id = $1', [id]);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
