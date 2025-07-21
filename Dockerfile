FROM node:20-alpine3.21

WORKDIR /workspaces/lore

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ENV NODE_ENV=development
ENV NODE_PATH=/workspaces/lore/node_modules

EXPOSE 3000 5000

CMD ["npm", "run", "dev"]