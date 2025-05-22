# Sử dụng node bản nhẹ
FROM node:18-slim

# Cài ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json nếu có
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Mở port backend (ví dụ 5000)
EXPOSE 5000

# Chạy script cluster (nodemon backend/cluster.js)
CMD ["npm", "run", "cluster"]
