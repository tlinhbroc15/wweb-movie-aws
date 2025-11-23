import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Image src="/logo.png" alt="Logo" width={170} height={40} />
            </div>
            <p className="text-sm text-muted-foreground">
              Tận hưởng trải nghiệm xem phim tốt nhất với chất lượng cao và nội dung đa dạng.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/#new" className="text-sm hover:underline">
                  Phim Mới
                </Link>
              </li>
              <li>
                <Link href="/#hot" className="text-sm hover:underline">
                  Phim Phổ Biến
                </Link>
              </li>
              <li>
                <Link href="/#recommended" className="text-sm hover:underline">
                  Phim Đề Xuất
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm hover:underline">
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:underline">
                  Điều Khoản Sử Dụng
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm hover:underline">
                  Chính Sách Bảo Mật
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kết Nối Với Chúng Tôi</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-foreground hover:text-primary">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-foreground hover:text-primary">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-foreground hover:text-primary">
                <Twitter size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AllDrama. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  )
}
