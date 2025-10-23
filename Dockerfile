# Multi-stage build for both frontend and backend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files and configs
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the Angular frontend
RUN npx nx build dashboard --configuration=production

# Backend build stage
FROM node:20-alpine AS backend-builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./

RUN npm ci --legacy-peer-deps

COPY . .

# Build the NestJS backend
RUN npx nx build api

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --production --legacy-peer-deps

# Copy built backend
COPY --from=backend-builder /app/dist/apps/api ./dist/api

# Copy built frontend
COPY --from=frontend-builder /app/dist/apps/dashboard/browser ./dist/frontend

# Install serve for frontend
RUN npm install -g serve

# Create startup script
RUN echo '#!/bin/sh\n\
# Start backend in background\n\
node dist/api/main.js &\n\
# Start frontend\n\
serve -s dist/frontend -l 3000\n\
' > start.sh && chmod +x start.sh

# Use node user
USER node

EXPOSE 3000

CMD ["./start.sh"]