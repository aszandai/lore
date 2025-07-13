# Makefile for easier project handling

.PHONY: dev backend frontend db_login

build:
	docker compose build

# Start backend only
backend:
	docker compose up --build backend

# Start frontend only
frontend:
	docker compose up --build frontend

# Example DB login: make db_login user=your_username
# Connect to the running postgres container
# Usage: make db_login user=your_username db=loredb
# Defaults to 'postgres' user and 'loredb' db if not provided
user?=postgres
db?=loredb
db_login:
	docker exec -it postgres psql -U $(user) -d $(db)