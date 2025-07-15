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

# Backup the database
db_backup:
	docker compose exec postgres sh -c 'mkdir -p /tmp/backup && pg_dump -U $$DB_USER $$DB_HOST > /tmp/backup/backup-$$(date +%Y%m%d%H%M).sql'

# Restore the database
db_restore:
	docker compose exec -T postgres sh -c 'psql -U $$DB_USER $$DB_HOST < /tmp/backup/$(FILE)'

db_ls:
	docker compose exec postgres ls /tmp/backup
