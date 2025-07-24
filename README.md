# lore

Setup for `.env`:

```
DATABASE_URL=postgres://username:password@postgres:5432/loredb
DB_HOST=postgres
DB_USER=username
DB_PASSWORD=password
DB_NAME=loredb
NEXT_PUBLIC_API_URL=http://backend:5000/
```

if needed for npm install:

```sh
sudo chown -R $(id -u):$(id -g) /workspaces/lore/frontend/node_modules

sudo chown -R $(id -u):$(id -g) /workspaces/lore/frontend

cd frontend

npm install
```
