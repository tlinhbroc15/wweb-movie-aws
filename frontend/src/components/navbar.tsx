"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, User, ChevronRight } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

const genres = [
  { name: "Tổng Giám Đốc", slug: "tong-giam-doc" },
  { name: "Tái Sinh", slug: "tai-sinh" },
  { name: "Lịch Sử", slug: "lich-su" },
  { name: "Du Hành Thời Gian", slug: "du-hanh-thoi-gian" },
  { name: "Hài Hước", slug: "hai-huoc" },
  { name: "Tuổi Trẻ", slug: "tuoi-tre" },
  { name: "Tâm Lý", slug: "tam-ly" },
]

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [matches, query])

  return matches
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { data: session } = useSession()
  const isLoggedIn = Boolean(session?.user)
  const isSmallScreen = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
        setSearchQuery("")
        setIsSheetOpen(false)
      }
    },
    [searchQuery, router],
  )

  const handleLogout = () => signOut()

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full border-b border-border/40">
      <div className="container mx-auto px-4 py-2">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              <Image src="/logo.png" alt="Logo" width={120} height={40} className="cursor-pointer" />
            </Link>
            {/* Desktop navigation menu */}
            {!isSmallScreen && (
              <NavigationMenu className="ml-6">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Thể Loại</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {genres.map((genre) => (
                          <li key={genre.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={`/search?genre=${encodeURIComponent(genre.slug)}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                {genre.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {/* Mobile navigation */}
          {isSmallScreen ? (
            <div className="flex items-center gap-2">
              {/* Mobile user profile button */}
              {isLoggedIn && (
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Hồ sơ</span>
                  </Button>
                </Link>
              )}

              {/* Mobile menu using Sheet component with proper title for accessibility */}
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Mở menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col h-full mt-6">
                    {/* Search bar inside the sheet */}
                    <div className="mb-6">
                      <form onSubmit={handleSearch} className="relative">
                        <Input
                          type="search"
                          placeholder="Tìm kiếm phim..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pr-8"
                        />
                        <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0">
                          <Search className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>

                    <div className="flex-1 overflow-auto">
                      <div className="border-b pb-4 mb-4">
                        <h3 className="font-medium mb-2">Thể Loại</h3>
                        <div className="grid gap-2">
                          {genres.map((genre) => (
                            <Link
                              key={genre.slug}
                              href={`/search?genre=${encodeURIComponent(genre.slug)}`}
                              className="flex items-center text-sm py-1 hover:text-primary"
                              onClick={() => setIsSheetOpen(false)}
                            >
                              <ChevronRight className="h-4 w-4 mr-1" />
                              {genre.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {isLoggedIn ? (
                        <div className="pb-4">
                          <h3 className="font-medium mb-2">Tài khoản của tôi</h3>
                          <Link
                            href="/profile"
                            className="flex items-center text-sm py-1 hover:text-primary"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <ChevronRight className="h-4 w-4 mr-1" />
                            Hồ sơ
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout()
                              setIsSheetOpen(false)
                            }}
                            className="flex items-center text-sm py-1 hover:text-primary w-full text-left"
                          >
                            <ChevronRight className="h-4 w-4 mr-1" />
                            Đăng xuất
                          </button>
                        </div>
                      ) : (
                        <div className="pb-4">
                          <h3 className="font-medium mb-2">Tài khoản</h3>
                          <Link
                            href="/sign-in"
                            className="flex items-center text-sm py-1 hover:text-primary"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <ChevronRight className="h-4 w-4 mr-1" />
                            Đăng nhập
                          </Link>
                          <Link
                            href="/sign-up"
                            className="flex items-center text-sm py-1 hover:text-primary"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <ChevronRight className="h-4 w-4 mr-1" />
                            Đăng ký
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            // Desktop navigation remains the same
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Tìm kiếm phim..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pr-8"
                />
                <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="cursor-pointer h-9 w-9">
                        <AvatarImage src={"/placeholder-avatar.jpg"} alt="Ảnh đại diện người dùng" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href="/profile">
                        <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/sign-in">
                    <Button variant="outline" size="sm">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm">Đăng ký</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

