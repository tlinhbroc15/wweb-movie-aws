# Tài liệu Admin Frontend

## Tổng quan

Admin Frontend là một ứng dụng quản trị được xây dựng bằng Next.js với TypeScript và Tailwind CSS. Giao diện được thiết kế theo phong cách dashboard hiện đại, sử dụng các components từ thư viện shadcn/ui.

## Cấu trúc thư mục

```
admin-fe/
├── src/
│   ├── app/           # Next.js app router và pages
│   │   ├── (dashboard)/  # Các trang trong dashboard
│   │   └── login/       # Trang đăng nhập
│   ├── components/    # React components
│   │   ├── ui/       # UI components từ shadcn/ui
│   │   └── ...       # Custom components
│   ├── lib/          # Utility functions và configurations
│   └── hooks/        # Custom React hooks
├── public/           # Static assets
└── package.json      # Dependencies và scripts
```

## Công nghệ sử dụng

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- React Query
- Axios
- React Hot Toast
- Recharts (cho biểu đồ)

## Các tính năng chính

### Dashboard

- Tổng quan thống kê:
  - Tổng số phim
  - Tổng số người dùng
  - Tổng lượt xem
  - Số quảng cáo đang chạy
- Biểu đồ thống kê lượt xem theo thời gian
- Danh sách phim mới thêm
- Danh sách bình luận gần đây

### Quản lý phim

- Xem danh sách phim
- Thêm phim mới
- Chỉnh sửa thông tin phim
- Xóa phim
- Quản lý tập phim

### Quản lý người dùng

- Xem danh sách người dùng
- Phân quyền người dùng
- Khóa/Mở khóa tài khoản

### Quản lý bình luận

- Xem danh sách bình luận
- Xóa bình luận vi phạm
- Lọc bình luận theo phim/người dùng

### Cài đặt hệ thống

- Cài đặt chung
- Cài đặt bảo mật
- Cài đặt API

## Components chính

- DashboardLayout: Layout chung cho dashboard
- MoviesManagement: Quản lý phim
- UsersManagement: Quản lý người dùng
- CommentsManagement: Quản lý bình luận
- MetricsCard: Card hiển thị thống kê
- StatsChart: Biểu đồ thống kê
- UI Components từ shadcn/ui

## Cấu hình môi trường

Các biến môi trường chính:

- `NEXT_PUBLIC_API_URL`: URL của backend API
- `NEXT_PUBLIC_ADMIN_URL`: URL của admin dashboard
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`: ID Google Analytics

## Cách chạy dự án

### Development

```bash
npm install
npm run dev
```

### Production

```bash
npm run build
npm start
```

## Bảo mật

- Xác thực JWT
- Phân quyền người dùng
- CSRF protection
- XSS prevention
- Secure HTTP headers
- Environment variables protection
- API route protection

## Tối ưu hóa

- Server-side rendering (SSR)
- Code splitting
- Lazy loading components
- Responsive design
- Caching với React Query
- Optimistic updates
