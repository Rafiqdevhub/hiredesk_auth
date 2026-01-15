FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY tsconfig.json ./
COPY src ./src
COPY public ./public

RUN npm run build


FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY public ./public

USER node

EXPOSE 5000

CMD ["node", "dist/index.js"]
