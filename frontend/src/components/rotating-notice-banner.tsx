"use client"

import { useState, useEffect } from "react"
import { Heart, X, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const notices = [
  {
    id: "ads",
    title: "Thông báo về quảng cáo trên trang web",
    description: [
      "Chúng tôi xin lỗi nếu quảng cáo trên trang web gây ra bất kỳ sự phiền toái nào. Quảng cáo là cần thiết để duy trì và phát triển đội ngũ của chúng tôi.",
      "Chúng tôi luôn cố gắng kiểm soát số lượng và chất lượng quảng cáo để không ảnh hưởng quá nhiều đến việc sử dụng trang web của bạn.",
    ],
    footer: "Cảm ơn bạn rất nhiều!",
    icon: <Heart className="h-3 w-3 fill-red-500 text-red-500" />,
    variant: "default",
  },
  {
    id: "session",
    title: "Thông báo phiên đăng nhập",
    description: [
      "Nếu phiên đăng nhập của bạn đã hết hạn do token không còn hợp lệ, vui lòng đăng xuất và đăng nhập lại để tiếp tục sử dụng dịch vụ. Token xác thực có thời hạn để đảm bảo an toàn và bảo vệ tài khoản của bạn.",
    ],
    footer: "Cảm ơn sự thông cảm của bạn",
    icon: <AlertTriangle className="h-3 w-3 text-yellow-500" />,
    variant: "warning",
  },
]


// const notices = [
//   {
//     id: "ads",
//     title: "AVISO DE MANTENIMIENTO DEL SITIO WEB",
//     description: [
//       "Hola Nuestro sitio web estará temporalmente en mantenimiento para mejorar el sistema y brindarte una mejor experiencia.",
//       "⏳ Duración del mantenimiento: Aproximadamente 1 día.",
//       "📌 Durante este tiempo, no será posible acceder al sitio web.",
//       "🙏Lamentamos cualquier inconveniente y agradecemos tu comprensión. ¡Vuelve pronto para disfrutar de una versión optimizada!",
//       "Siempre nos esforzamos por controlar la cantidad y calidad de los anuncios para que no afecten demasiado su uso del sitio web.",
//     ],
//     footer: "¡Muchas gracias!",
//     icon: <Heart className="h-3 w-3 fill-red-500 text-red-500" />,
//     variant: "default",
//   },
//   {
//     id: "session",
//     title: "AVISO DE MANTENIMIENTO DEL SITIO WEB",
//     description: [
//       "Hola Nuestro sitio web estará temporalmente en mantenimiento para mejorar el sistema y brindarte una mejor experiencia.",
//       "⏳ Duración del mantenimiento: Aproximadamente 1 día.",
//       "📌 Durante este tiempo, no será posible acceder al sitio web.",
//       "🙏Lamentamos cualquier inconveniente y agradecemos tu comprensión. ¡Vuelve pronto para disfrutar de una versión optimizada!",
//       "Siempre nos esforzamos por controlar la cantidad y calidad de los anuncios para que no afecten demasiado su uso del sitio web.",
//     ],
//     footer: "¡Muchas gracias!",
//     icon: <Heart className="h-3 w-3 fill-red-500 text-red-500" />,
//     variant: "default",
//   },
// ]

export default function RotatingNoticeBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0)
  const [fadeState, setFadeState] = useState("in") // "in" or "out"

  // Function to handle the rotation
  const rotateNotice = () => {
    // Start fade out
    setFadeState("out")

    // After fade out completes, change content and fade in
    setTimeout(() => {
      setCurrentNoticeIndex((prev) => (prev + 1) % notices.length)
      setFadeState("in")
    }, 500)
  }

  useEffect(() => {
    if (!isVisible) return

    // Set up the interval for rotation
    const interval = setInterval(rotateNotice, 5000) // Shorter interval (5 seconds)

    // Clean up on unmount
    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  const currentNotice = notices[currentNoticeIndex]

  return (
    <Alert
      className={cn(
        "relative border-border/30 bg-black/40 backdrop-blur-sm transition-all duration-500",
        fadeState === "out" ? "opacity-0 transform -translate-y-1" : "opacity-100 transform translate-y-0",
        currentNotice.variant === "warning" ? "border-l-4 border-l-yellow-500/70" : "",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6 rounded-full text-muted-foreground hover:bg-background/10 hover:text-foreground z-10"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Đóng</span>
      </Button>

      <div className="mx-auto max-w-5xl px-4 py-3">
        <AlertTitle className="mb-2 text-center text-sm font-medium text-foreground/90">
          {currentNotice.title}
        </AlertTitle>
        <AlertDescription className="text-center text-xs text-muted-foreground">
          {currentNotice.description.map((paragraph, index) => (
            <p key={index} className="mb-1.5">
              {paragraph}
            </p>
          ))}
          <p className="flex items-center justify-center gap-1 pt-1 text-xs font-medium text-foreground/80">
            {currentNotice.footer} {currentNotice.icon}
          </p>
        </AlertDescription>
      </div>
    </Alert>
  )
}

