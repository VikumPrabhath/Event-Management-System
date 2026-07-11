# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code and build the static files
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx (lightweight web server)
FROM nginx:alpine

# Copy the built static files from Stage 1 to Nginx's serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (default web port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]