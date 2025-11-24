import FeaturedBanner from "@/components/featured-banner"
import MovieList from "@/components/movie-list"
import RotatingNoticeBanner from "@/components/rotating-notice-banner"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <FeaturedBanner />
      <RotatingNoticeBanner />
      <div className="container mx-auto px-4 py-8">
        <div id="new">
          <MovieList title="Phim Mới" category="new" />
        </div>
        <div id="hot">
          <MovieList title="Phim Phổ Biến" category="hot" />
        </div>
        <div id="recommended">
          <MovieList title="Phim Đề Xuất" category="recommended" />
        </div>
      </div>
    </main>
  )
}

