# ====================================================================
# STAGE 1: Build the Vite + React frontend application
# ====================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and configuration files
COPY . .

# Compile TypeScript and build production bundle
RUN npm run build

# ====================================================================
# STAGE 2: Production Server to serve the built static site
# ====================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package definitions and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled dist output from builder stage
COPY --from=builder /app/dist ./dist

# Copy production Express server
COPY server.js ./

# Expose container port
EXPOSE 3000

# Set production environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Start production Express web server
CMD ["node", "server.js"]
