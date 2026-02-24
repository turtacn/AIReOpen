# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Define build arguments for API configuration
ARG VITE_API_MODE=mock
ARG VITE_API_BASE_URL=/api/v1

# Persist build arguments as environment variables for the build process
ENV VITE_API_MODE=$VITE_API_MODE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Install system dependencies if needed for native modules (though node:20 usually suffices)
# RUN apk add --no-cache python3 make g++

COPY package*.json ./
# Use npm ci for clean, reproducible installs
RUN npm ci

COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
