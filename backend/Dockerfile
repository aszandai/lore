FROM  node:20-alpine3.17

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

RUN mkdir -p uploads

COPY . .

EXPOSE 5000

CMD ["npx", "nodemon", "index.js"]
