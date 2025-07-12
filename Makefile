# Makefile for easier project handling

.PHONY: dev backend frontend db_login

# Start both frontend and backend in parallel

dev:
	npm install --no-save concurrently
	./node_modules/.bin/concurrently "make backend" "make frontend"

# Start backend only (dotenv loads .env automatically)
backend:
	cd backend && npm start

# Start frontend only
frontend:
	cd frontend && npm run dev

# Example DB login: make db_login user=your_username
db_login:
	psql -U $(user) -d loredb