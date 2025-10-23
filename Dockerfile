FROM node:20-alpine

WORKDIR /app

# Copy package files and Nx configs
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build Angular app
RUN npx nx build dashboard --configuration=production

# Install a static server that supports SPAs
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist/apps/dashboard/browser", "-l", "3000", "--single"]