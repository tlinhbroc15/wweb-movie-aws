# ---------- STAGE 1: Build ----------
FROM node:20-slim AS builder

# Cập nhật các gói bảo mật
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json (nếu có) để cài đặt dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY .sequelizerc ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Chạy build TypeScript => JavaScript
RUN npm run build


# ---------- STAGE 2: Production Image ----------
FROM node:20-slim AS runner

# Cập nhật các gói bảo mật
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Sao chép mã đã biên dịch từ stage 1
COPY --from=builder /usr/src/app/dist ./dist

# Sao chép file package*.json để cài đặt dependencies (chỉ cần cho runtime)
COPY package*.json ./
RUN npm install --production

# Copy các file cần thiết khác (nếu có) - ví dụ file .sequelizerc, .env (nếu muốn)
COPY .sequelizerc ./

# Expose port 
EXPOSE 5000

# Lệnh khởi động app
CMD ["node", "dist/index.js"]
