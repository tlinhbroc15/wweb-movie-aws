# Tài liệu Frontend

## Tổng quan

Frontend của ứng dụng được xây dựng bằng Next.js với TypeScript và Tailwind CSS. Giao diện người dùng được thiết kế hiện đại và responsive, sử dụng các components từ thư viện shadcn/ui.

## Cấu trúc thư mục

```
frontend/
├── src/
│   ├── app/           # Next.js app router và pages
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

## Các tính năng chính

### Trang chủ

- Banner nổi bật (FeaturedBanner)
- Banner thông báo xoay (RotatingNoticeBanner)
- Danh sách phim theo danh mục:
  - Phim mới
  - Phim phổ biến
  - Phim đề xuất

### Components chính

- MovieList: Hiển thị danh sách phim
- FeaturedBanner: Banner quảng cáo phim nổi bật
- RotatingNoticeBanner: Banner thông báo xoay
- UI Components từ shadcn/ui:
  - Button
  - Card
  - Input
  - Table
  - Dialog
  - Dropdown Menu
  - và nhiều components khác

## Cấu hình môi trường

Các biến môi trường chính:

- `NEXT_PUBLIC_API_URL`: URL của backend API
- `NEXT_PUBLIC_SITE_URL`: URL của website
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

## Tối ưu hóa

- Server-side rendering (SSR) cho SEO
- Image optimization với Next.js Image
- Code splitting tự động
- Lazy loading components
- Responsive design với Tailwind CSS

## Bảo mật

- CSRF protection
- XSS prevention
- Secure HTTP headers
- Environment variables protection
- API route protection
