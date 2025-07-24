FROM node:20-alpine3.17

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

RUN mkdir -p uploads

COPY . .

# Set ownership of all files to node user (UID 1000)
RUN chown -R node:node /app

USER node

EXPOSE 5000

CMD ["npx", "nodemon", "index.js"]
