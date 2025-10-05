# Stage 1: Build the application
FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

COPY --from=build /app/out /usr/share/nginx/html

# Copy the nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
