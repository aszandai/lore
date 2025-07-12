# Lore Backend

## Setup

1. Copy `.env.example` to `.env` and fill in your PostgreSQL credentials.
2. Install dependencies:
   ```sh
   npm install express pg dotenv
   ```
3. Start the backend:
   ```sh
   npm start
   ```

## Endpoints
- `GET /api/health` — Health check
- `GET /api/characters` — Example endpoint (requires a `characters` table in your database)

## Database
You need a PostgreSQL database. Example table:
```sql
CREATE TABLE characters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);
```
