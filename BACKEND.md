# Tài liệu Backend

## Tổng quan

Backend của ứng dụng được xây dựng bằng Node.js với Express framework và TypeScript. Hệ thống sử dụng PostgreSQL làm cơ sở dữ liệu và được containerized bằng Docker.

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/         # Cấu hình database và các biến môi trường
│   ├── controllers/    # Xử lý logic nghiệp vụ
│   ├── middlewares/    # Middleware xác thực và phân quyền
│   ├── models/         # Định nghĩa models database
│   ├── routes/         # Định nghĩa các routes API
│   ├── services/       # Xử lý logic nghiệp vụ phức tạp
│   ├── app.ts         # Cấu hình Express app
│   └── index.ts       # Entry point của ứng dụng
├── docker-compose.yml  # Cấu hình Docker
└── package.json       # Dependencies và scripts
```

## Công nghệ sử dụng

- Node.js & Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- Docker
- AWS S3 & CloudFront
- JWT Authentication

## API Endpoints

### Authentication

- POST `/api/auth/register-user` - Đăng ký người dùng mới

### Movies

- GET `/api/movies` - Lấy danh sách phim
- GET `/api/movies/:id` - Lấy thông tin chi tiết phim
- POST `/api/movies` - Tạo phim mới (Admin)
- PUT `/api/movies/:id` - Cập nhật phim (Admin)
- DELETE `/api/movies/:id` - Xóa phim (Admin)

### Episodes

- GET `/api/episodes` - Lấy danh sách tập phim
- GET `/api/episodes/movie/:movieId` - Lấy tập phim theo movieId
- POST `/api/episodes` - Tạo tập phim mới (Admin)

### User Features

- `/api/user-favorites` - Quản lý phim yêu thích
- `/api/user-watch-histories` - Lịch sử xem phim
- `/api/movie-comments` - Bình luận phim

### AWS Integration

- POST `/api/aws/upload-url` - Tạo URL upload file lên S3

## Cấu hình môi trường

Các biến môi trường chính:

- `PORT`: Port chạy server (mặc định: 5000)
- `JWT_SECRET`: Secret key cho JWT
- `DB_NAME`: Tên database
- `DB_USER`: Username database
- `DB_PASS`: Password database
- `DB_HOST`: Host database
- `DB_PORT`: Port database
- `AWS_ACCESS_KEY_ID`: AWS Access Key
- `AWS_SECRET_ACCESS_KEY`: AWS Secret Key
- `AWS_REGION`: AWS Region
- `AWS_S3_BUCKET`: Tên S3 bucket
- `AWS_CLOUDFRONT_DOMAIN`: Domain CloudFront

## Cách chạy dự án

### Sử dụng Docker

```bash
docker-compose up
```

### Chạy trực tiếp

1. Cài đặt dependencies:

```bash
npm install
```

2. Chạy development server:

```bash
npm run dev
```

3. Build và chạy production:

```bash
npm run build
npm start
```

## Database Migrations

- Tạo migration mới: `npx sequelize-cli migration:generate --name migration-name`
- Chạy migrations: `npm run migrate`
- Hoàn tác migration: `npm run migrate:undo`

## Bảo mật

- Sử dụng JWT cho xác thực
- CORS được cấu hình cho các domain cụ thể
- Middleware xác thực và phân quyền cho các routes nhạy cảm
- Mật khẩu được mã hóa bằng bcrypt
- AWS credentials được quản lý qua biến môi trường
