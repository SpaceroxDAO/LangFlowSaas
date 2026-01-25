# Teach Charlie AI - Frontend Dockerfile
# Development: Runs Vite dev server with hot module reload
# Production: Build static files, serve via nginx

# =====================================================
# Development Stage
# =====================================================
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies first (cached if package.json unchanged)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 3001

# Development command with hot reload
# Note: --host 0.0.0.0 allows access from outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3001"]

# =====================================================
# Build Stage (for production)
# =====================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for Vite (must be available at build time)
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_URL=/api
ARG VITE_LANGFLOW_HOST=/langflow
ARG VITE_LANGFLOW_URL=/langflow

# Set as environment variables for the build
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_LANGFLOW_HOST=$VITE_LANGFLOW_HOST
ENV VITE_LANGFLOW_URL=$VITE_LANGFLOW_URL

COPY package*.json ./
RUN npm ci

COPY . .

# Build for production (Vite embeds VITE_* env vars at build time)
RUN npm run build

# =====================================================
# Production Stage
# =====================================================
FROM nginx:alpine AS production

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
