# Dùng Node.js để build app
FROM node:18 AS build

WORKDIR /app

# Copy package.json và cài dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy code và build
COPY . .
RUN npm run build

# Dùng Nginx để chạy React
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
