import { Movie } from "../models/Movie";
import { Episode } from "../models/Episode";
import { AwsS3Service } from "./awsS3Service";

export class MovieService {
  /**
   * Lấy thông tin 1 phim theo id
   * @param id - ID của phim
   * @returns Movie nếu tìm thấy, nếu không sẽ ném lỗi
   */
  static async getMovie(id: number) {
    const movie = await Movie.findByPk(id);
    if (!movie) throw new Error("Movie not found");
    return movie;
  }

  /**
   * Lấy danh sách tất cả phim
   */
  static async getAllMovies() {
    return await Movie.findAll();
  }

  /**
   * Tạo mới 1 phim
   * @param data - Dữ liệu của phim cần tạo
   */
  static async createMovie(data: {
    title: string;
    rating: number;
    views: number;
    genre: string;
    summary: string;
    duration: number;
    total_episodes: number;
    release_year: number;
    poster_url: string;
    trailer_url: string;
  }) {
    const newMovie = await Movie.create({
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return newMovie;
  }

  /**
   * Cập nhật thông tin của phim
   * @param id - ID của phim cần cập nhật
   * @param data - Dữ liệu cập nhật (các trường có thể update)
   */
  static async updateMovie(
    id: number,
    data: Partial<{
      title: string;
      rating: number;
      views: number;
      genre: string;
      summary: string;
      duration: number;
      total_episodes: number;
      release_year: number;
      poster_url: string;
      trailer_url: string;
    }>
  ) {
    const movie = await Movie.findByPk(id);
    if (!movie) throw new Error("Movie not found");

    // Gán các giá trị mới và cập nhật updated_at
    Object.assign(movie, data, { updated_at: new Date() });
    await movie.save();
    return movie;
  }

  /**
   * Xóa phim theo id
   * @param id - ID của phim cần xóa
   */
  static async deleteMovie(id: number) {
    const movie = await Movie.findByPk(id, {
      include: [Episode]
    });
    if (!movie) throw new Error("Movie not found");

    try {
      // Xóa toàn bộ folder của phim trên S3
      // Sử dụng title của phim làm tên folder
      const folderName = movie.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      await AwsS3Service.deleteFile(folderName + '/');

      // Xóa các tập phim trong database
      if (movie.episodes) {
        for (const episode of movie.episodes) {
          await episode.destroy();
        }
      }

      // Xóa phim khỏi database
      await movie.destroy();
      return { message: "Movie and all related files deleted successfully" };
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw new Error("Failed to delete movie");
    }
  }
}
