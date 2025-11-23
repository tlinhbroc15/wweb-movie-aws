import axios from "axios";
import fs from "fs";
import { Movie } from "./models/Movie";
import { Episode } from "./models/Episode";
import sequelize from "./config/database";
import dotenv from "dotenv";
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY || "d07e12921101420754be9154cf7b0924";

async function fetchAllMoviesAndTV() {
  try {
    await sequelize.authenticate();

    const allMovies: any[] = [];
    const allEpisodes: any[] = [];

    // =========================
    // 1️⃣ Fetch Movie (phim điện ảnh)
    // =========================
    for (let page = 1; page <= 2; page++) {
      const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
      const res = await axios.get(url);
      const movies = res.data.results;

      for (const m of movies) {
        // Lấy trailer
        const videoRes = await axios.get(`https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=${TMDB_API_KEY}`);
        const trailer = videoRes.data.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
        const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

        const movieData = {
          title: m.title,
          genre: m.genre_ids?.join(",") || "",
          rating: m.vote_average,
          views: 0,
          summary: m.overview,
          duration: m.runtime || 120,
          totalEpisodes: 1,
          releaseYear: parseInt(m.release_date?.split("-")[0]) || null,
          posterUrl: `https://image.tmdb.org/t/p/w500/${m.poster_path}`,
          trailerUrl,
        };

        const movie = await Movie.create(movieData);
        allMovies.push(movieData);

        // ----- Tạo episode cho Movie -----
        if (trailerUrl) {
          const episodeData = {
            movieId: movie.id,
            episodeNumber: 1,
            videoUrl: trailerUrl,
          };
          await Episode.create(episodeData);
           allEpisodes.push({
                  movie_id: movie.id,          // snake_case
                  episode_number: 1, // snake_case
                  video_url: trailerUrl       // snake_case
                  // created_at: new Date(),
                  // updated_at: new Date()
          });
        }
      }
    }

    // =========================
    // 2️⃣ Fetch TV Show + Episodes
    // =========================
    for (let page = 1; page <= 2; page++) {
      const url = `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
      const res = await axios.get(url);
      const shows = res.data.results;

      for (const s of shows) {
        // Chi tiết TV show + video
        const detailRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${s.id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos`
        );
        const show = detailRes.data;

        // Trailer chính
        const trailer = show.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
        const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

        const movieData = {
          title: show.name,
          genre: show.genre_ids?.join(",") || "",
          rating: show.vote_average,
          views: 0,
          summary: show.overview,
          duration: show.episode_run_time?.[0] || 45,
          totalEpisodes: show.number_of_episodes || 1,
          releaseYear: parseInt(show.first_air_date?.split("-")[0]) || null,
          posterUrl: `https://image.tmdb.org/t/p/w500/${show.poster_path}`,
          trailerUrl,
        };

        const movie = await Movie.create(movieData);
        allMovies.push(movieData);

        // ----- Tạo Episodes cho TV Show -----
        for (const season of show.seasons) {
          const seasonRes = await axios.get(
            `https://api.themoviedb.org/3/tv/${s.id}/season/${season.season_number}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos`
          );
          const seasonData = seasonRes.data;

          for (const ep of seasonData.episodes) {
            const video = seasonData.videos?.results?.find(
              (v: any) => v.type === "Trailer" && v.site === "YouTube"
            );
            const videoUrl = video ? `https://www.youtube.com/watch?v=${video.key}` : "";

            const episodeData = {
              movieId: movie.id,
              episodeNumber: ep.episode_number,
              videoUrl,
            };

            await Episode.create(episodeData);
            allEpisodes.push({
                  movie_id: movie.id,          // snake_case
                  episode_number: ep.episode_number, // snake_case
                  video_url: videoUrl       // snake_case
                  // created_at: new Date(),
                  // updated_at: new Date()
              });
          }
        }
      }
    }

    // =========================
    // 3️⃣ Ghi ra file JSON
    // =========================
    fs.writeFileSync("movies.json", JSON.stringify(allMovies, null, 2));
    fs.writeFileSync("episodes.json", JSON.stringify(allEpisodes, null, 2));

    console.log("Imported all movies, TV shows, and episodes successfully!");
    process.exit(0);

  } catch (err) {
    console.error("Error:", err);
  }
}

fetchAllMoviesAndTV();
