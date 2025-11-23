import { Episode } from "../models/Episode";

export class EpisodeService {
  // Lấy thông tin một tập phim theo id
  static async getEpisode(id: number) {
    const episode = await Episode.findByPk(id);
    if (!episode) throw new Error("Episode not found");
    return episode;
  }

  // Lấy danh sách tất cả tập phim
  static async getAllEpisodes() {
    return await Episode.findAll();
  }

  // Lấy danh sách tập phim theo movieId
  static async getEpisodesByMovieId(movieId: number) {
    return await Episode.findAll({ where: { movieId } });
  }

  // Tạo mới một tập phim
  static async createEpisode(data: {
    movieId: number;
    episodeNumber: number;
    videoUrl: string;
  }) {
    const newEpisode = await Episode.create({
      ...data,
      // Nếu timestamps được bật thì Sequelize sẽ tự cập nhật createdAt, updatedAt
    });
    return newEpisode;
  }

  // Cập nhật thông tin tập phim theo id
  static async updateEpisode(
    id: number,
    data: Partial<{
      movieId: number;
      episodeNumber: number;
      videoUrl: string;
    }>
  ) {
    const episode = await Episode.findByPk(id);
    if (!episode) throw new Error("Episode not found");

    Object.assign(episode, data);
    await episode.save();
    return episode;
  }

  // **Phương thức mới:** Cập nhật tập phim theo movieId và episodeNumber
  static async updateEpisodeByMovieAndNumber(
    movieId: number,
    episodeNumber: number,
    data: Partial<{
      videoUrl: string;
    }>
  ) {
    const episode = await Episode.findOne({ where: { movieId, episodeNumber } });
    if (!episode) throw new Error("Episode not found");

    Object.assign(episode, data);
    await episode.save();
    return episode;
  }

  // Xóa tập phim theo id
  static async deleteEpisode(id: number) {
    const episode = await Episode.findByPk(id);
    if (!episode) throw new Error("Episode not found");

    await episode.destroy();
    return { message: "Episode deleted successfully" };
  }
}
