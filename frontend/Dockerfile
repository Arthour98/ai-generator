# Use Node.js official image
FROM node:18-alpine

# Set working dir
WORKDIR /app

# Install deps (done inside container, packages stored in volume)
COPY ai-front/package*.json ./
RUN npm install

# Copy source
COPY ai-front ./

# Expose port
EXPOSE 3000

# Start dev mode with hot reload
CMD ["npm", "run", "dev"]