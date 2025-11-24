"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useMovie, type Movie } from "@/app/providers/MovieContext";
import { VerticalCarousel } from "@/components/vertical-carousel";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS } from "@/config/api";

interface EpisodeAPI {
  id: number;
  movieId: number;
  episodeNumber: number;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentAPI {
  id: number;
  movieId: number;
  userId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface WatchPageClientProps {
  movieId: number;
  episodeNumber: number;
  initialVideoSrc: string | null;
  initialMovie: Movie | null;
}

export default function WatchPageClient({
  movieId,
  episodeNumber,
  initialVideoSrc,
  initialMovie = null,
}: WatchPageClientProps) {
  const { movies, fetchMovies } = useMovie();
  const { data: session } = useSession();

  const [movie, setMovie] = useState<Movie | null>(initialMovie);
  const [apiEpisodes, setApiEpisodes] = useState<EpisodeAPI[]>([]);
  const [apiComments, setApiComments] = useState<CommentAPI[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(episodeNumber);
  const [comment, setComment] = useState("");
  const [videoSize, setVideoSize] = useState<"normal" | "fullscreen">("normal");
  const [showCursor, setShowCursor] = useState(true);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportIssue, setReportIssue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullTitleVisible, setIsFullTitleVisible] = useState(false);
  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [currentVideoSrc, setCurrentVideoSrc] = useState<string | null>(
    initialVideoSrc || null
  );

  const updatedMovieIdsRef = useRef<Set<number>>(new Set());

  // ✅ Fix type explicit any by using string | undefined
  const updateWatchHistory = useCallback(
    async (movieId: number) => {
      if (!session) return;
      try {
        await axios.post(
          API_ENDPOINTS.USER.ADD_WATCH_HISTORY,
          { movieId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token as string}`,
            },
          }
        );
      } catch (error) {
        console.error("Error updating watch history:", error);
      }
    },
    [session]
  );

  useEffect(() => {
    if (movie && session && !updatedMovieIdsRef.current.has(movie.id)) {
      updateWatchHistory(movie.id);
      updatedMovieIdsRef.current.add(movie.id);
    }
  }, [movie, session, updateWatchHistory]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowCursor(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowCursor(false), 3000);
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!movie) {
      const found = movies.find((m) => m.id === movieId);
      if (found) setMovie(found);
    }
    if (movies.length === 0) fetchMovies();
  }, [movieId, movie, movies, fetchMovies]);

  useEffect(() => {
    if (!movie) return;
    axios
      .get<EpisodeAPI[]>(API_ENDPOINTS.EPISODES.LIST(movie.id))
      .then((response) => setApiEpisodes(response.data))
      .catch((error: Error) => console.error("Error fetching episodes:", error));
  }, [movie]);

  useEffect(() => {
    if (!movie) return;
    axios
      .get<CommentAPI[]>(API_ENDPOINTS.COMMENTS.LIST(movie.id))
      .then((response) => setApiComments(response.data))
      .catch((error: Error) => console.error("Error fetching comments:", error));
  }, [movie]);

  useEffect(() => {
    const selectedEpisodeData = apiEpisodes.find(
      (ep) => ep.episodeNumber === selectedEpisode
    );
    if (selectedEpisodeData) setCurrentVideoSrc(selectedEpisodeData.videoUrl);
  }, [apiEpisodes, selectedEpisode]);

  useEffect(() => {
    const checkTitleOverflow = () => {
      if (titleRef.current) {
        setIsTitleOverflowing(
          titleRef.current.scrollHeight > titleRef.current.clientHeight
        );
      }
    };
    checkTitleOverflow();
    window.addEventListener("resize", checkTitleOverflow);
    return () => window.removeEventListener("resize", checkTitleOverflow);
  }, []);

  const handleNextEpisode = () => {
    if (movie && selectedEpisode < movie.totalEpisodes) {
      setSelectedEpisode(selectedEpisode + 1);
    }
  };

  const handlePostComment = async () => {
    if (!session || !comment.trim() || !movie) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post<CommentAPI>(
        API_ENDPOINTS.COMMENTS.CREATE,
        { movieId: movie.id, comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token as string}`,
            withCredentials: true,
          },
        }
      );
      setApiComments((prev) => [...prev, response.data]);
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const similarMovies = movie
    ? movies.filter(
        (m) =>
          m.id !== movie.id &&
          m.genre.toLowerCase() === movie.genre.toLowerCase()
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div
        className={`${
          videoSize === "normal"
            ? "flex justify-center items-center w-full my-4"
            : "fixed inset-0 z-50 bg-black flex items-center justify-center"
        }`}
        style={{ cursor: showCursor ? "auto" : "none" }}
      >
        <VideoPlayer
          src={currentVideoSrc || "/placeholder.svg?height=1080&width=1920"}
          poster={movie?.posterUrl || "/placeholder.svg?height=1080&width=1920"}
          onNext={handleNextEpisode}
          hasNextEpisode={movie ? selectedEpisode < movie.totalEpisodes : false}
          videoSize={videoSize}
          setVideoSize={setVideoSize}
        />
      </div>
      {/* Phần còn lại giữ nguyên */}
    </div>
  );
}
