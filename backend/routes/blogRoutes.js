import express from 'express';

const router = express.Router();

export default (pool) => {
  router.get('/blog', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
      res.json(result.rows || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/blog', async (req, res) => {
    try {
      const { title, content, tags } = req.body;
      const result = await pool.query(
        'INSERT INTO blog_posts (title, content, tags, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
        [title, content, tags]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/blog/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, tags } = req.body;
      const result = await pool.query(
        'UPDATE blog_posts SET title = $1, content = $2, tags = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
        [title, content, tags, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/blog/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM blog_posts WHERE id = $1', [id]);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
