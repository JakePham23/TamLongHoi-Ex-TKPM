# Sử dụng image Node.js phiên bản mới
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json trước
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Mở cổng API (mặc định Express chạy cổng 3000)
EXPOSE 3000

# Chạy server khi container khởi động
CMD ["npm", "start"]
