FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Set ownership of all files to node user (UID 1000)
RUN chown -R node:node /app
RUN mkdir -p /app/.next && chown -R node:node /app/.next

USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]